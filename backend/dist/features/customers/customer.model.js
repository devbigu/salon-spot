import { prisma } from "../../config/prisma.js";
export const CustomerModel = {
    create: async (data) => {
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
    findBySalon: async (salonId) => {
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
    findById: async (id) => {
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
    findByIdAndSalon: async (id, salonId) => {
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
    findByPhoneAndSalon: async (phone, salonId) => {
        return prisma.customer.findFirst({
            where: {
                phone,
                salonId,
            },
        });
    },
    findByCustomerCodeAndSalon: async (customerCode, salonId) => {
        return prisma.customer.findFirst({
            where: {
                customerCode,
                salonId,
            },
        });
    },
    update: async (id, data) => {
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
    delete: async (id) => {
        return prisma.customer.delete({
            where: {
                id,
            },
        });
    },
    findTransactions: async (customerId, salonId) => {
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
    createTransaction: async (data) => {
        return prisma.customerTransaction.create({
            data,
        });
    },
    addWalletAmount: async (customerId, amount) => {
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
    increaseOutstanding: async (customerId, amount) => {
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
    reduceOutstanding: async (customerId, amount) => {
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
