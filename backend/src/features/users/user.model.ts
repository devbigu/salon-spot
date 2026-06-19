import { prisma } from "../../config/prisma.js"

export const UserModel = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  createSalonAdmin: async (data: {
    name: string;
    email: string;
    phone_number: string;
    passwordHash: string;
    salonId: string;
  }) => {
    return prisma.user.create({
      data: {
        ...data,
        role: "SALON_ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        role: true,
        salonId: true,
        branchId: true,
        createdAt: true,
      },
    });
  },

  createReceptionist: async (data: {
    name: string;
    email: string;
    phone_number: string;
    passwordHash: string;
    salonId: string;
    branchId?: string;
  }) => {
    return prisma.user.create({
      data: {
        ...data,
        role: "RECEPTIONIST",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        role: true,
        salonId: true,
        branchId: true,
        createdAt: true,
      },
    });
  },

  findByPhoneNumber: async (phone_number: string) => {
    return prisma.user.findUnique({
      where: { phone_number },
    });
  },


  create: async (data: {
    name: string;
    email: string;
    phone_number?: string;
    passwordHash: string;
    role?: "SUPER_ADMIN" | "SALON_ADMIN" | "BRANCH_MANAGER" | "RECEPTIONIST" | "STAFF";
    salonId?: string;
    branchId?: string;
  }) => {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        role: true,
        salonId: true,
        branchId: true,
        createdAt: true,
      },
    });
  },
}
