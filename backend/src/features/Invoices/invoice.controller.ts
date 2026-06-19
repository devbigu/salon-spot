import { type Request, type Response } from "express";

import { InvoiceModel } from "./invoice.model.js";
import { AppointmentModel } from "../appointments/appointment.model.js";
import { CustomerModel } from "../customers/customer.model.js";


const INVOICE_TYPES = ["GST_INVOICE", "BILL_OF_SUPPLY"] as const;
const INVOICE_STATUSES = ["DRAFT", "ISSUED", "CANCELLED"] as const;
const PAYMENT_STATUSES = ["UNPAID", "PARTIALLY_PAID", "PAID"] as const;

type InvoiceType = (typeof INVOICE_TYPES)[number];
type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const isValidInvoiceType = (value: string): value is InvoiceType => {
  return INVOICE_TYPES.includes(value as InvoiceType);
};

const isValidInvoiceStatus = (value: string): value is InvoiceStatus => {
  return INVOICE_STATUSES.includes(value as InvoiceStatus);
};

const isValidPaymentStatus = (value: string): value is PaymentStatus => {
  return PAYMENT_STATUSES.includes(value as PaymentStatus);
};

const generateInvoiceCode = () => {
  return `INV${Date.now()}`;
};

const getInvoiceIdParam = (req: Request) => {
  const { id } = req.params;
  return typeof id === "string" ? id : null;
};

const getAppointmentIdParam = (req: Request) => {
  const { appointmentId } = req.params;
  return typeof appointmentId === "string" ? appointmentId : null;
};

const buildAddress = (parts: Array<string | null | undefined>) => {
  return parts.filter(Boolean).join(", ");
};

const getExistingInvoiceByAccess = async (req: Request, invoiceId: string) => {
  if (req.user?.role === "SUPER_ADMIN") {
    return InvoiceModel.findById(invoiceId);
  }

  const salonId = req.user?.salonId;

  if (!salonId) {
    return null;
  }

  return InvoiceModel.findByIdAndSalon(invoiceId, salonId);
};

export const createInvoiceFromAppointment = async (
  req: Request,
  res: Response
) => {
  try {
    const appointmentId = getAppointmentIdParam(req);

    const {
      invoiceType,
      discountAmount,
      processingFeeAmount,
      taxPercent,
      billingNote,
      footerNote,
    } = req.body as {
      invoiceType?: string;
      discountAmount?: number;
      processingFeeAmount?: number;
      taxPercent?: number;
      billingNote?: string;
      footerNote?: string;
    };

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    if (invoiceType && !isValidInvoiceType(invoiceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice type",
      });
    }

    const appointment =
      req.user?.role === "SUPER_ADMIN"
        ? await AppointmentModel.findInvoiceSourceById(appointmentId)
        : req.user?.salonId
          ? await AppointmentModel.findInvoiceSourceByIdAndSalon(
              appointmentId,
              req.user.salonId
            )
          : null;

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Only completed appointments can be converted to invoice",
      });
    }

    const existingInvoice = await InvoiceModel.findByAppointmentIdAndSalon(
      appointment.id,
      appointment.salonId
    );

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: "Invoice already exists for this appointment",
      });
    }

    if (!appointment.services.length) {
      return res.status(400).json({
        success: false,
        message: "Appointment has no services",
      });
    }

    const finalInvoiceType: InvoiceType =
      invoiceType && isValidInvoiceType(invoiceType)
        ? invoiceType
        : "BILL_OF_SUPPLY";

    const subtotalAmount = appointment.services.reduce((total, item) => {
      return total + Number(item.price);
    }, 0);

    const finalDiscountAmount = Math.max(Number(discountAmount || 0), 0);
    const finalProcessingFeeAmount = Math.max(
      Number(processingFeeAmount || 0),
      0
    );

    const taxableAmount = Math.max(
      subtotalAmount - finalDiscountAmount + finalProcessingFeeAmount,
      0
    );

    const finalTaxPercent =
      finalInvoiceType === "GST_INVOICE" ? Math.max(Number(taxPercent || 0), 0) : 0;

    const finalTaxAmount = Number(
      ((taxableAmount * finalTaxPercent) / 100).toFixed(2)
    );

    const totalAmount = Number((taxableAmount + finalTaxAmount).toFixed(2));

    const invoice = await InvoiceModel.create({
      invoiceCode: generateInvoiceCode(),

      salonId: appointment.salonId,
      ...(appointment.branchId ? { branchId: appointment.branchId } : {}),
      customerId: appointment.customerId,
      appointmentId: appointment.id,

      invoiceType: finalInvoiceType,

      salonName: appointment.salon.name,
      ...(appointment.salon.phone ? { salonPhone: appointment.salon.phone } : {}),
      ...(appointment.salon.email ? { salonEmail: appointment.salon.email } : {}),
      salonAddress: buildAddress([
        appointment.salon.addressLine1,
        appointment.salon.addressLine2,
        appointment.salon.city,
        appointment.salon.state,
        appointment.salon.country,
        appointment.salon.postalCode,
      ]),

      customerName: appointment.customer.name,
      ...(appointment.customer.phone
        ? { customerPhone: appointment.customer.phone }
        : {}),
      ...(appointment.customer.email
        ? { customerEmail: appointment.customer.email }
        : {}),
      ...(appointment.customer.gst
        ? { customerGst: appointment.customer.gst }
        : {}),

      subtotalAmount,
      discountAmount: finalDiscountAmount,
      processingFeeAmount: finalProcessingFeeAmount,
      taxAmount: finalTaxAmount,
      totalAmount,

      paidAmount: 0,
      balanceAmount: totalAmount,

      status: "ISSUED",
      paymentStatus: "UNPAID",

      ...(billingNote ? { billingNote } : {}),
      ...(footerNote ? { footerNote } : {}),

      items: appointment.services.map((item) => ({
        serviceId: item.serviceId,
        itemCode: item.serviceId.slice(0, 8),
        description: item.serviceName,
        serviceName: item.serviceName,
        quantity: 1,
        unitPrice: Number(item.price),
        discountAmount: 0,
        taxPercent: finalTaxPercent,
        taxAmount:
          finalInvoiceType === "GST_INVOICE"
            ? Number(((Number(item.price) * finalTaxPercent) / 100).toFixed(2))
            : 0,
        lineTotal:
          finalInvoiceType === "GST_INVOICE"
            ? Number(
                (
                  Number(item.price) +
                  (Number(item.price) * finalTaxPercent) / 100
                ).toFixed(2)
              )
            : Number(item.price),
      })),
      
    });
    await CustomerModel.increaseOutstandingWithTransaction({
  customerId: invoice.customerId,
  salonId: invoice.salonId,
  invoiceId: invoice.id,
  billNo: invoice.invoiceCode,
  amount: Number(invoice.totalAmount),
  narration: `Invoice generated: ${invoice.invoiceCode}`,
});


    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { branchId, customerId, status, paymentStatus } = req.query;

    if (status && !isValidInvoiceStatus(String(status))) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice status",
      });
    }

    if (paymentStatus && !isValidPaymentStatus(String(paymentStatus))) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    if (req.user?.role === "SUPER_ADMIN") {
      const invoices = await InvoiceModel.findAll();

      return res.status(200).json({
        success: true,
        message: "Invoices fetched successfully",
        data: invoices,
      });
    }

    if (!req.user?.salonId) {
      return res.status(400).json({
        success: false,
        message: "Salon ID is missing",
      });
    }

    const invoices = await InvoiceModel.findBySalon(req.user.salonId, {
      ...(branchId ? { branchId: String(branchId) } : {}),
      ...(customerId ? { customerId: String(customerId) } : {}),
      ...(status ? { status: String(status) as InvoiceStatus } : {}),
      ...(paymentStatus
        ? { paymentStatus: String(paymentStatus) as PaymentStatus }
        : {}),
    });

    return res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      data: invoices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const id = getInvoiceIdParam(req);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    const invoice = await getExistingInvoiceByAccess(req, id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const cancelInvoice = async (req: Request, res: Response) => {
  try {
    const id = getInvoiceIdParam(req);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    const existingInvoice = await getExistingInvoiceByAccess(req, id);

    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (existingInvoice.paymentStatus !== "UNPAID") {
      return res.status(400).json({
        success: false,
        message: "Paid or partially paid invoice cannot be cancelled",
      });
    }

    const invoice = await InvoiceModel.cancel(id);

    return res.status(200).json({
      success: true,
      message: "Invoice cancelled successfully",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};