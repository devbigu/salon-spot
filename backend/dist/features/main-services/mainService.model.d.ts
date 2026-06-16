export declare const MainServiceModel: {
    create: (data: {
        name: string;
        salonId: string;
        status?: boolean;
    }) => Promise<{
        salon: {
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
    }>;
    findAll: () => Promise<({
        salon: {
            name: string;
            id: string;
        };
        services: {
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
        }[];
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    })[]>;
    findBySalon: (salonId: string) => Promise<({
        services: {
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
        }[];
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    })[]>;
    findById: (id: string) => Promise<({
        salon: {
            name: string;
            id: string;
        };
        services: {
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
        }[];
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }) | null>;
    findByIdAndSalon: (id: string, salonId: string) => Promise<({
        services: {
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
        }[];
    } & {
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }) | null>;
    findByNameAndSalon: (name: string, salonId: string) => Promise<{
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    } | null>;
    update: (id: string, data: {
        name?: string;
        status?: boolean;
    }) => Promise<{
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }>;
    updateStatus: (id: string, status: boolean) => Promise<{
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }>;
    delete: (id: string) => Promise<{
        salonId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }>;
};
//# sourceMappingURL=mainService.model.d.ts.map