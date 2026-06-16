import { prisma } from "../../config/prisma.js";
export const ServiceModel = {
    create: async (data) => {
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
    findBySalon: async (salonId) => {
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
    findById: async (id) => {
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
    findByIdAndSalon: async (id, salonId) => {
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
    findByNameMainServiceAndSalon: async (name, mainServiceId, salonId) => {
        return prisma.service.findFirst({
            where: {
                name,
                mainServiceId,
                salonId,
            },
        });
    },
    update: async (id, data) => {
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
    updateStatus: async (id, status) => {
        return prisma.service.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    },
    delete: async (id) => {
        return prisma.service.delete({
            where: {
                id,
            },
        });
    },
    findManyByIdsAndSalon: async (serviceIds, salonId) => {
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
