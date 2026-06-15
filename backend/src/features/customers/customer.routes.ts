import { Router } from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerTransactions,
  addCustomerWalletAmount,
} from "./customer.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requireRole("SUPER_ADMIN", "SALON_ADMIN", "STAFF"),
  createCustomer
);

router.get(
  "/",
  requireRole("SUPER_ADMIN", "SALON_ADMIN", "STAFF"),
  getCustomers
);

router.get(
  "/:id/transactions",
  requireRole("SUPER_ADMIN", "SALON_ADMIN", "STAFF"),
  getCustomerTransactions
);

router.post(
  "/:id/wallet/add",
  requireRole("SUPER_ADMIN", "SALON_ADMIN"),
  addCustomerWalletAmount
);

router.get(
  "/:id",
  requireRole("SUPER_ADMIN", "SALON_ADMIN", "STAFF"),
  getCustomerById
);

router.put(
  "/:id",
  requireRole("SUPER_ADMIN", "SALON_ADMIN", "STAFF"),
  updateCustomer
);

router.delete(
  "/:id",
  requireRole("SUPER_ADMIN", "SALON_ADMIN"),
  deleteCustomer
);

export default router;