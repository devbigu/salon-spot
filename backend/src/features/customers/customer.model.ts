import { prisma } from "../../config/prisma.js";

type CustomerStatus = "REGULAR" | "PREMIUM" | "IRREGULAR";
type TransactionStatus = "PENDING" | "COMPLETE" | "FAILED";

export const CustomerModel = {
  create: async (data: {
    customerCode: string;
    name: string;
    phone: string;
    email?: string;
    gst?: string;
    customNotes?: string;
    dob?: Date;
    anniversaryDate?: Date;
    status?: CustomerStatus;
    salonId: string;
    branchId?: string;
  }) => {
    return prisma.customer.create({
      data,
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
      },
    });
  },

  findAll: async () => {
    return prisma.customer.findMany({
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findBySalon: async (salonId: string) => {
    return prisma.customer.findMany({
      where: {
        salonId,
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById: async (id: string) => {
    return prisma.customer.findUnique({
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
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  },

  findByIdAndSalon: async (id: string, salonId: string) => {
    return prisma.customer.findFirst({
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
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  },

  findByPhoneAndSalon: async (phone: string, salonId: string) => {
    return prisma.customer.findFirst({
      where: {
        phone,
        salonId,
      },
    });
  },

  findByCustomerCodeAndSalon: async (
    customerCode: string,
    salonId: string
  ) => {
    return prisma.customer.findFirst({
      where: {
        customerCode,
        salonId,
      },
    });
  },

  update: async (
    id: string,
    data: {
      name?: string;
      phone?: string;
      email?: string | null;
      gst?: string | null;
      customNotes?: string | null;
      dob?: Date | null;
      anniversaryDate?: Date | null;
      status?: CustomerStatus;
      branchId?: string | null;
    }
  ) => {
    return prisma.customer.update({
      where: {
        id,
      },
      data,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  delete: async (id: string) => {
    return prisma.customer.delete({
      where: {
        id,
      },
    });
  },

  findTransactions: async (customerId: string, salonId: string) => {
    return prisma.customerTransaction.findMany({
      where: {
        customerId,
        salonId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  createTransaction: async (data: {
    customerId: string;
    salonId: string;
    billNo?: string;
    narration: string;
    debit?: number;
    credit?: number;
    status?: TransactionStatus;
  }) => {
    return prisma.customerTransaction.create({
      data,
    });
  },

  addWalletAmount: async (
    customerId: string,
    amount: number
  ) => {
    return prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        walletBalance: {
          increment: amount,
        },
      },
    });
  },

  increaseOutstanding: async (
    customerId: string,
    amount: number
  ) => {
    return prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        outstandingAmount: {
          increment: amount,
        },
      },
    });
  },

  reduceOutstanding: async (
    customerId: string,
    amount: number
  ) => {
    return prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        outstandingAmount: {
          decrement: amount,
        },
      },
    });
  },
};
