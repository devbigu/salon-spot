import { prisma } from "../../config/prisma.js";
export const SalonModel = {
    create: async (data) => {
        return prisma.salon.create({
            data,
        });
    },
    findAll: async () => {
        return prisma.salon.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    findById: async (id) => {
        return prisma.salon.findUnique({
            where: {
                id,
            },
        });
    },
};
