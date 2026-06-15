import {} from "express";
import { ServiceModel } from "./service.model.js";
import { BranchModel } from "../branches/branch.model.js";
import { MainServiceModel } from "../main-services/mainService.model.js";
const DURATION_UNITS = ["MINUTES", "HOURS"];
const isValidDurationUnit = (unit) => {
    return DURATION_UNITS.includes(unit);
};
const getFinalSalonId = (req, bodySalonId) => {
    if (req.user?.role === "SUPER_ADMIN") {
        return bodySalonId;
    }
    return req.user?.salonId;
};
const getServiceIdParam = (req) => {
    const { id } = req.params;
    return typeof id === "string" ? id : null;
};
const getExistingServiceByAccess = async (req, serviceId) => {
    if (req.user?.role === "SUPER_ADMIN") {
        return ServiceModel.findById(serviceId);
    }
    const salonId = req.user?.salonId;
    if (!salonId) {
        return null;
    }
    return ServiceModel.findByIdAndSalon(serviceId, salonId);
};
export const createService = async (req, res) => {
    try {
        const { name, description, price, durationValue, durationUnit, salonId, branchId, mainServiceId, } = req.body;
        if (!name || price === undefined || !mainServiceId) {
            return res.status(400).json({
                success: false,
                message: "Name, price and mainServiceId are required",
            });
        }
        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative",
            });
        }
        if (durationUnit && !isValidDurationUnit(durationUnit)) {
            return res.status(400).json({
                success: false,
                message: "Invalid duration unit",
            });
        }
        const finalSalonId = getFinalSalonId(req, salonId);
        if (!finalSalonId) {
            return res.status(400).json({
                success: false,
                message: "Salon ID is required",
            });
        }
        const mainService = await MainServiceModel.findByIdAndSalon(mainServiceId, finalSalonId);
        if (!mainService) {
            return res.status(400).json({
                success: false,
                message: "Invalid main service for this salon",
            });
        }
        if (branchId) {
            const branch = await BranchModel.findByIdAndSalon(branchId, finalSalonId);
            if (!branch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid branch for this salon",
                });
            }
        }
        const existingService = await ServiceModel.findByNameMainServiceAndSalon(name, mainServiceId, finalSalonId);
        if (existingService) {
            return res.status(400).json({
                success: false,
                message: "Service already exists under this main service",
            });
        }
        const service = await ServiceModel.create({
            name,
            salonId: finalSalonId,
            mainServiceId,
            price: Number(price),
            ...(description ? { description } : {}),
            ...(durationValue ? { durationValue: Number(durationValue) } : {}),
            ...(durationUnit ? { durationUnit } : {}),
            ...(branchId ? { branchId } : {}),
        });
        return res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const getServices = async (req, res) => {
    try {
        if (req.user?.role === "SUPER_ADMIN") {
            const services = await ServiceModel.findAll();
            return res.status(200).json({
                success: true,
                message: "Services fetched successfully",
                data: services,
            });
        }
        if (!req.user?.salonId) {
            return res.status(400).json({
                success: false,
                message: "Salon ID is missing",
            });
        }
        const services = await ServiceModel.findBySalon(req.user.salonId);
        return res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            data: services,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const getServiceById = async (req, res) => {
    try {
        const id = getServiceIdParam(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Service ID is required",
            });
        }
        const service = await getExistingServiceByAccess(req, id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Service fetched successfully",
            data: service,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const updateService = async (req, res) => {
    try {
        const id = getServiceIdParam(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Service ID is required",
            });
        }
        const existingService = await getExistingServiceByAccess(req, id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        const { name, description, price, durationValue, durationUnit, status, branchId, mainServiceId, } = req.body;
        const finalSalonId = existingService.salonId;
        if (price !== undefined && Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative",
            });
        }
        if (durationUnit && !isValidDurationUnit(durationUnit)) {
            return res.status(400).json({
                success: false,
                message: "Invalid duration unit",
            });
        }
        if (branchId) {
            const branch = await BranchModel.findByIdAndSalon(branchId, finalSalonId);
            if (!branch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid branch for this salon",
                });
            }
        }
        if (mainServiceId) {
            const mainService = await MainServiceModel.findByIdAndSalon(mainServiceId, finalSalonId);
            if (!mainService) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid main service for this salon",
                });
            }
        }
        const finalMainServiceId = mainServiceId || existingService.mainServiceId;
        const finalName = name || existingService.name;
        if (name || mainServiceId) {
            const duplicate = await ServiceModel.findByNameMainServiceAndSalon(finalName, finalMainServiceId, finalSalonId);
            if (duplicate && duplicate.id !== id) {
                return res.status(400).json({
                    success: false,
                    message: "Service already exists under this main service",
                });
            }
        }
        const updatedService = await ServiceModel.update(id, {
            ...(name ? { name } : {}),
            ...("description" in req.body
                ? { description: description ?? null }
                : {}),
            ...(price !== undefined ? { price: Number(price) } : {}),
            ...("durationValue" in req.body
                ? {
                    durationValue: durationValue === null ? null : Number(durationValue),
                }
                : {}),
            ...(durationUnit ? { durationUnit } : {}),
            ...(typeof status === "boolean" ? { status } : {}),
            ...("branchId" in req.body ? { branchId: branchId ?? null } : {}),
            ...(mainServiceId ? { mainServiceId } : {}),
        });
        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: updatedService,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const updateServiceStatus = async (req, res) => {
    try {
        const id = getServiceIdParam(req);
        const { status } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Service ID is required",
            });
        }
        if (typeof status !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Status must be true or false",
            });
        }
        const existingService = await getExistingServiceByAccess(req, id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        const updatedService = await ServiceModel.updateStatus(id, status);
        return res.status(200).json({
            success: true,
            message: "Service status updated successfully",
            data: updatedService,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const deleteService = async (req, res) => {
    try {
        const id = getServiceIdParam(req);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Service ID is required",
            });
        }
        const existingService = await getExistingServiceByAccess(req, id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        await ServiceModel.delete(id);
        return res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error. This service may already be used in appointments or invoices.",
        });
    }
};
//# sourceMappingURL=service.controller.js.map