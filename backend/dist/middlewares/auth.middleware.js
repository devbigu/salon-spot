import {} from "express";
import jwt, {} from "jsonwebtoken";
import { env } from "../config/env.js";
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        if (typeof decoded.userId !== "string" ||
            typeof decoded.role !== "string") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        const user = {
            userId: decoded.userId,
            role: decoded.role,
            ...(typeof decoded.salonId === "string" ? { salonId: decoded.salonId } : {}),
            ...(typeof decoded.branchId === "string"
                ? { branchId: decoded.branchId }
                : {}),
        };
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
