import { prisma } from "../../config/prisma.js";

type PaymentMethod = "CASH" | "CARD" | "UPI" | "OTHER";
type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";

export const PaymentModel = {
  createAndUpdateInvoice: async (data: {
    salonId: string;
    branchId?: string;
    customerId: string;
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    referenceNo?: string;
    note?: string;
    paidAt?: Date;

    newPaidAmount: number;
    newBalanceAmount: number;
    newPaymentStatus: PaymentStatus;
  }) => {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          salonId: data.salonId,
          ...(data.branchId ? { branchId: data.branchId } : {}),
          customerId: data.customerId,
          invoiceId: data.invoiceId,
          amount: data.amount,
          method: data.method,
          ...(data.referenceNo ? { referenceNo: data.referenceNo } : {}),
          ...(data.note ? { note: data.note } : {}),
          ...(data.paidAt ? { paidAt: data.paidAt } : {}),
        },
        include: {
          salon: {
            select: {
              id: true,
              name: true,
            },
          },
          branch: {
            select: {
              id: true,
              name: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              customerCode: true,
            },
          },
          invoice: {
            select: {
              id: true,
              invoiceCode: true,
              totalAmount: true,
              paidAmount: true,
              balanceAmount: true,
              paymentStatus: true,
            },
          },
        },
      });

      const invoice = await tx.invoice.update({
        where: {
          id: data.invoiceId,
        },
        data: {
          paidAmount: data.newPaidAmount,
          balanceAmount: data.newBalanceAmount,
          paymentStatus: data.newPaymentStatus,
        },
        include: {
          items: true,
          payments: true,
        },
      });

      return {
        payment,
        invoice,
      };
    });
  },

  findAll: async () => {
    return prisma.payment.findMany({
      include: {
        salon: {
          select: {
            id: true,
            name: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            customerCode: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceCode: true,
            totalAmount: true,
            paidAmount: true,
            balanceAmount: true,
            paymentStatus: true,
          },
        },
      },
      orderBy: {
        paidAt: "desc",
      },
    });
  },

  findBySalon: async (
    salonId: string,
    filters?: {
      branchId?: string;
      customerId?: string;
      invoiceId?: string;
      method?: PaymentMethod;
    }
  ) => {
    return prisma.payment.findMany({
      where: {
        salonId,
        ...(filters?.branchId ? { branchId: filters.branchId } : {}),
        ...(filters?.customerId ? { customerId: filters.customerId } : {}),
        ...(filters?.invoiceId ? { invoiceId: filters.invoiceId } : {}),
        ...(filters?.method ? { method: filters.method } : {}),
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            customerCode: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceCode: true,
            totalAmount: true,
            paidAmount: true,
            balanceAmount: true,
            paymentStatus: true,
          },
        },
      },
      orderBy: {
        paidAt: "desc",
      },
    });
  },

  findById: async (id: string) => {
    return prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        salon: {
          select: {
            id: true,
            name: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            customerCode: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceCode: true,
            totalAmount: true,
            paidAmount: true,
            balanceAmount: true,
            paymentStatus: true,
          },
        },
      },
    });
  },

  findByIdAndSalon: async (id: string, salonId: string) => {
    return prisma.payment.findFirst({
      where: {
        id,
        salonId,
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            customerCode: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceCode: true,
            totalAmount: true,
            paidAmount: true,
            balanceAmount: true,
            paymentStatus: true,
          },
        },
      },
    });
  },
};