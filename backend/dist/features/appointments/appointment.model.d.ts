type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
type DurationUnit = "MINUTES" | "HOURS";
export declare const AppointmentModel: {
    create: (data: {
        appointmentCode: string;
        salonId: string;
        branchId?: string;
        customerId: string;
        staffId: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: number;
        status?: AppointmentStatus;
        bookingNote?: string;
        internalNote?: string;
        services: {
            serviceId: string;
            serviceName: string;
            price: number;
            durationValue?: number;
            durationUnit?: DurationUnit;
        }[];
    }) => Promise<{
        services: ({
            service: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            durationValue: number | null;
            durationUnit: import("../../../generated/prisma/enums.js").DurationUnit | null;
            serviceName: string;
            serviceId: string;
            appointmentId: string;
        })[];
        staff: {
            name: string;
            id: string;
            jobRole: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string | null;
            customerCode: string;
        };
    } & {
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    }>;
    findAll: () => Promise<({
        salon: {
            name: string;
            id: string;
        };
        services: {
            id: string;
            createdAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            durationValue: number | null;
            durationUnit: import("../../../generated/prisma/enums.js").DurationUnit | null;
            serviceName: string;
            serviceId: string;
            appointmentId: string;
        }[];
        staff: {
            name: string;
            id: string;
            jobRole: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string | null;
            customerCode: string;
        };
    } & {
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    })[]>;
    findBySalon: (salonId: string, filters?: {
        branchId?: string;
        staffId?: string;
        customerId?: string;
        status?: AppointmentStatus;
        dateFrom?: Date;
        dateTo?: Date;
    }) => Promise<({
        services: {
            id: string;
            createdAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            durationValue: number | null;
            durationUnit: import("../../../generated/prisma/enums.js").DurationUnit | null;
            serviceName: string;
            serviceId: string;
            appointmentId: string;
        }[];
        staff: {
            name: string;
            id: string;
            jobRole: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string | null;
            customerCode: string;
        };
    } & {
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    })[]>;
    findById: (id: string) => Promise<({
        salon: {
            name: string;
            id: string;
        };
        services: ({
            service: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            durationValue: number | null;
            durationUnit: import("../../../generated/prisma/enums.js").DurationUnit | null;
            serviceName: string;
            serviceId: string;
            appointmentId: string;
        })[];
        staff: {
            name: string;
            id: string;
            jobRole: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string | null;
            customerCode: string;
            outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
            walletBalance: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    }) | null>;
    findByIdAndSalon: (id: string, salonId: string) => Promise<({
        services: ({
            service: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            durationValue: number | null;
            durationUnit: import("../../../generated/prisma/enums.js").DurationUnit | null;
            serviceName: string;
            serviceId: string;
            appointmentId: string;
        })[];
        staff: {
            name: string;
            id: string;
            jobRole: string;
        };
        branch: {
            name: string;
            id: string;
        } | null;
        customer: {
            name: string;
            id: string;
            phone: string | null;
            customerCode: string;
            outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
            walletBalance: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    }) | null>;
    findConflict: (data: {
        staffId: string;
        startTime: Date;
        endTime: Date;
        excludeAppointmentId?: string;
    }) => Promise<{
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    } | null>;
    updateStatus: (id: string, status: AppointmentStatus) => Promise<{
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    }>;
    updateBasicDetails: (id: string, data: {
        bookingNote?: string | null;
        internalNote?: string | null;
        status?: AppointmentStatus;
    }) => Promise<{
        services: {
            id: string;
            createdAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            durationValue: number | null;
            durationUnit: import("../../../generated/prisma/enums.js").DurationUnit | null;
            serviceName: string;
            serviceId: string;
            appointmentId: string;
        }[];
        staff: {
            name: string;
            id: string;
            jobRole: string;
        };
        customer: {
            name: string;
            id: string;
            phone: string | null;
        };
    } & {
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    }>;
    delete: (id: string) => Promise<{
        salonId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../../generated/prisma/enums.js").AppointmentStatus;
        branchId: string | null;
        customerId: string;
        appointmentCode: string;
        startTime: Date;
        endTime: Date;
        totalDurationMinutes: number;
        estimatedAmount: import("@prisma/client-runtime-utils").Decimal;
        bookingNote: string | null;
        internalNote: string | null;
        staffId: string;
    }>;
};
export {};
//# sourceMappingURL=appointment.model.d.ts.map