import { Router } from "express";

import {
  createPayment,
  getPayments,
  getPaymentById,
} from "./payment.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requireRole("SUPER_ADMIN", "SALON_ADMIN", "STAFF"),
  createPayment
);

router.get(
  "/",
  requireRole("SUPER_ADMIN", "SALON_ADMIN", "STAFF"),
  getPayments
);

router.get(
  "/:id",
  requireRole("SUPER_ADMIN", "SALON_ADMIN", "STAFF"),
  getPaymentById
);

export default router;