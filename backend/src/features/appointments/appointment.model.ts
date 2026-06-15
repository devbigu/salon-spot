import { prisma } from "../../config/prisma.js";

type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

type DurationUnit = "MINUTES" | "HOURS";

export const AppointmentModel = {
  create: async (data: {
    appointmentCode: string;
    salonId: string;
    branchId?: string;
    customerId: string;
    staffId: string;
    startTime: Date;
    endTime: Date;
    totalDurationMinutes: number;
    estimatedAmount: number;
    status?: AppointmentStatus;
    bookingNote?: string;
    internalNote?: string;
    services: {
      serviceId: string;
      serviceName: string;
      price: number;
      durationValue?: number;
      durationUnit?: DurationUnit;
    }[];
  }) => {
    return prisma.appointment.create({
      data: {
        appointmentCode: data.appointmentCode,
        salonId: data.salonId,
        customerId: data.customerId,
        staffId: data.staffId,
        startTime: data.startTime,
        endTime: data.endTime,
        totalDurationMinutes: data.totalDurationMinutes,
        estimatedAmount: data.estimatedAmount,
        status: data.status || "SCHEDULED",
        ...(data.branchId ? { branchId: data.branchId } : {}),
        ...(data.bookingNote ? { bookingNote: data.bookingNote } : {}),
        ...(data.internalNote ? { internalNote: data.internalNote } : {}),

        services: {
          create: data.services.map((service) => ({
            service: {
              connect: {
                id: service.serviceId,
              },
            },
            serviceName: service.serviceName,
            price: service.price,
            ...(service.durationValue !== undefined
              ? { durationValue: service.durationValue }
              : {}),
            ...(service.durationUnit ? { durationUnit: service.durationUnit } : {}),
          })),
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            customerCode: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            jobRole: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },

  findAll: async () => {
    return prisma.appointment.findMany({
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
        staff: {
          select: {
            id: true,
            name: true,
            jobRole: true,
          },
        },
        services: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  },

  findBySalon: async (
    salonId: string,
    filters?: {
      branchId?: string;
      staffId?: string;
      customerId?: string;
      status?: AppointmentStatus;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ) => {
    return prisma.appointment.findMany({
      where: {
        salonId,
        ...(filters?.branchId ? { branchId: filters.branchId } : {}),
        ...(filters?.staffId ? { staffId: filters.staffId } : {}),
        ...(filters?.customerId ? { customerId: filters.customerId } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.dateFrom && filters?.dateTo
          ? {
              startTime: {
                gte: filters.dateFrom,
                lt: filters.dateTo,
              },
            }
          : {}),
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
        staff: {
          select: {
            id: true,
            name: true,
            jobRole: true,
          },
        },
        services: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  },

  findById: async (id: string) => {
    return prisma.appointment.findUnique({
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
            outstandingAmount: true,
            walletBalance: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            jobRole: true,
          },
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },

  findByIdAndSalon: async (id: string, salonId: string) => {
    return prisma.appointment.findFirst({
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
            outstandingAmount: true,
            walletBalance: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            jobRole: true,
          },
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },

  findConflict: async (data: {
  staffId: string;
  startTime: Date;
  endTime: Date;
  excludeAppointmentId?: string;
   }) => {
  return prisma.appointment.findFirst({
    where: {
      staffId: data.staffId,
      status: {
        notIn: ["CANCELLED", "NO_SHOW"],
      },
      startTime: {
        lt: data.endTime,
      },
      endTime: {
        gt: data.startTime,
      },
      ...(data.excludeAppointmentId
        ? {
            id: {
              not: data.excludeAppointmentId,
            },
          }
        : {}),
    },
  });
 },

  updateStatus: async (id: string, status: AppointmentStatus) => {
    return prisma.appointment.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },

  updateBasicDetails: async (
    id: string,
    data: {
      bookingNote?: string | null;
      internalNote?: string | null;
      status?: AppointmentStatus;
    }
  ) => {
    return prisma.appointment.update({
      where: {
        id,
      },
      data,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            jobRole: true,
          },
        },
        services: true,
      },
    });
  },

  delete: async (id: string) => {
    return prisma.appointment.delete({
      where: {
        id,
      },
    });
  },
 
};
