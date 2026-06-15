type CustomerStatus = "REGULAR" | "PREMIUM" | "IRREGULAR";
type TransactionStatus = "PENDING" | "COMPLETE" | "FAILED";
export declare const CustomerModel: {
    create: (data: {
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
    }) => Promise<{
        salon: {
            name: string;
            id: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    findAll: () => Promise<({
        salon: {
            name: string;
            id: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    findBySalon: (salonId: string) => Promise<({
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    findById: (id: string) => Promise<({
        salon: {
            name: string;
            id: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
        transactions: {
            salonId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../../generated/prisma/enums.js").TransactionStatus;
            customerId: string;
            billNo: string | null;
            narration: string;
            debit: import("@prisma/client-runtime-utils").Decimal;
            credit: import("@prisma/client-runtime-utils").Decimal;
        }[];
    } & {
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    }) | null>;
    findByIdAndSalon: (id: string, salonId: string) => Promise<({
        branch: {
            name: string;
            id: string;
        } | null;
        transactions: {
            salonId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../../generated/prisma/enums.js").TransactionStatus;
            customerId: string;
            billNo: string | null;
            narration: string;
            debit: import("@prisma/client-runtime-utils").Decimal;
            credit: import("@prisma/client-runtime-utils").Decimal;
        }[];
    } & {
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    }) | null>;
    findByPhoneAndSalon: (phone: string, salonId: string) => Promise<{
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    } | null>;
    findByCustomerCodeAndSalon: (customerCode: string, salonId: string) => Promise<{
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    } | null>;
    update: (id: string, data: {
        name?: string;
        phone?: string;
        email?: string | null;
        gst?: string | null;
        customNotes?: string | null;
        dob?: Date | null;
        anniversaryDate?: Date | null;
        status?: CustomerStatus;
        branchId?: string | null;
    }) => Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
    } & {
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    delete: (id: string) => Promise<{
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    findTransactions: (customerId: string, salonId: string) => Promise<{
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").TransactionStatus;
        customerId: string;
        billNo: string | null;
        narration: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    createTransaction: (data: {
        customerId: string;
        salonId: string;
        billNo?: string;
        narration: string;
        debit?: number;
        credit?: number;
        status?: TransactionStatus;
    }) => Promise<{
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").TransactionStatus;
        customerId: string;
        billNo: string | null;
        narration: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
    }>;
    addWalletAmount: (customerId: string, amount: number) => Promise<{
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    increaseOutstanding: (customerId: string, amount: number) => Promise<{
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
    reduceOutstanding: (customerId: string, amount: number) => Promise<{
        salonId: string;
        name: string;
        email: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        status: import("../../../generated/prisma/enums.js").CustomerStatus;
        branchId: string | null;
        customerCode: string;
        gst: string | null;
        customNotes: string | null;
        dob: Date | null;
        anniversaryDate: Date | null;
        outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
        walletBalance: import("@prisma/client-runtime-utils").Decimal;
    }>;
};
export {};
//# sourceMappingURL=customer.model.d.ts.map