import { prisma } from "../../config/prisma.js";

export const MainServiceModel = {
  create: async (data: {
    name: string;
    salonId: string;
    status?: boolean;
  }) => {
    return prisma.mainService.create({
      data,
      include: {
        salon: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  findAll: async () => {
    return prisma.mainService.findMany({
      include: {
        salon: {
          select: {
            id: true,
            name: true,
          },
        },
        services: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findBySalon: async (salonId: string) => {
    return prisma.mainService.findMany({
      where: {
        salonId,
      },
      include: {
        services: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById: async (id: string) => {
    return prisma.mainService.findUnique({
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
        services: true,
      },
    });
  },

  findByIdAndSalon: async (id: string, salonId: string) => {
    return prisma.mainService.findFirst({
      where: {
        id,
        salonId,
      },
      include: {
        services: true,
      },
    });
  },

  findByNameAndSalon: async (name: string, salonId: string) => {
    return prisma.mainService.findFirst({
      where: {
        name,
        salonId,
      },
    });
  },

  update: async (
    id: string,
    data: {
      name?: string;
      status?: boolean;
    }
  ) => {
    return prisma.mainService.update({
      where: {
        id,
      },
      data,
    });
  },

  updateStatus: async (id: string, status: boolean) => {
    return prisma.mainService.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },

  delete: async (id: string) => {
    return prisma.mainService.delete({
      where: {
        id,
      },
    });
  },
};