type DurationUnit = "MINUTES" | "HOURS";
export declare const ServiceModel: {
    create: (data: {
        name: string;
        description?: string;
        price: number;
        durationValue?: number;
        durationUnit?: DurationUnit;
        salonId: string;
        branchId?: string;
        mainServiceId: string;
    }) => Promise<{
        salon: {
            name: string;
            id: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
        mainService: {
            name: string;
            id: string;
        };
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
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
        mainService: {
            name: string;
            id: string;
        };
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
    })[]>;
    findBySalon: (salonId: string) => Promise<({
        branch: {
            name: string;
            id: string;
        } | null;
        mainService: {
            name: string;
            id: string;
        };
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
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
        mainService: {
            name: string;
            id: string;
        };
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
    }) | null>;
    findByIdAndSalon: (id: string, salonId: string) => Promise<({
        branch: {
            name: string;
            id: string;
        } | null;
        mainService: {
            name: string;
            id: string;
        };
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
    }) | null>;
    findByNameMainServiceAndSalon: (name: string, mainServiceId: string, salonId: string) => Promise<{
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
    } | null>;
    update: (id: string, data: {
        name?: string;
        description?: string | null;
        price?: number;
        durationValue?: number | null;
        durationUnit?: DurationUnit;
        status?: boolean;
        branchId?: string | null;
        mainServiceId?: string;
    }) => Promise<{
        branch: {
            name: string;
            id: string;
        } | null;
        mainService: {
            name: string;
            id: string;
        };
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
    }>;
    updateStatus: (id: string, status: boolean) => Promise<{
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
    }>;
    delete: (id: string) => Promise<{
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
    }>;
    findManyByIdsAndSalon: (serviceIds: string[], salonId: string) => Promise<{
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
        branchId: string | null;
        description: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        durationValue: number | null;
        durationUnit: import("../../../generated/prisma/enums.js").DurationUnit;
        mainServiceId: string;
    }[]>;
};
export {};
//# sourceMappingURL=service.model.d.ts.map