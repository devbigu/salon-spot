import { prisma } from "../../config/prisma.js";
export const MainServiceModel = {
    create: async (data) => {
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
    findBySalon: async (salonId) => {
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
    findById: async (id) => {
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
    findByIdAndSalon: async (id, salonId) => {
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
    findByNameAndSalon: async (name, salonId) => {
        return prisma.mainService.findFirst({
            where: {
                name,
                salonId,
            },
        });
    },
    update: async (id, data) => {
        return prisma.mainService.update({
            where: {
                id,
            },
            data,
        });
    },
    updateStatus: async (id, status) => {
        return prisma.mainService.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    },
    delete: async (id) => {
        return prisma.mainService.delete({
            where: {
                id,
            },
        });
    },
};
//# sourceMappingURL=mainService.model.js.map