import { prisma } from "../../config/prisma.js";

type DurationUnit = "MINUTES" | "HOURS";

export const ServiceModel = {
  create: async (data: {
    name: string;
    description?: string;
    price: number;
    durationValue?: number;
    durationUnit?: DurationUnit;
    salonId: string;
    branchId?: string;
    mainServiceId: string;
  }) => {
    return prisma.service.create({
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
        mainService: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  findAll: async () => {
    return prisma.service.findMany({
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
        mainService: {
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
    return prisma.service.findMany({
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
        mainService: {
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
    return prisma.service.findUnique({
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
        mainService: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  findByIdAndSalon: async (id: string, salonId: string) => {
    return prisma.service.findFirst({
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
        mainService: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  findByNameMainServiceAndSalon: async (
    name: string,
    mainServiceId: string,
    salonId: string
  ) => {
    return prisma.service.findFirst({
      where: {
        name,
        mainServiceId,
        salonId,
      },
    });
  },

  update: async (
    id: string,
    data: {
      name?: string;
      description?: string | null;
      price?: number;
      durationValue?: number | null;
      durationUnit?: DurationUnit;
      status?: boolean;
      branchId?: string | null;
      mainServiceId?: string;
    }
  ) => {
    return prisma.service.update({
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
        mainService: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  updateStatus: async (id: string, status: boolean) => {
    return prisma.service.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },

  delete: async (id: string) => {
    return prisma.service.delete({
      where: {
        id,
      },
    });
  },
   findManyByIdsAndSalon: async (serviceIds: string[], salonId: string) => {
  return prisma.service.findMany({
    where: {
      id: {
        in: serviceIds,
      },
      salonId,
      status: true,
    },
  });
},
};