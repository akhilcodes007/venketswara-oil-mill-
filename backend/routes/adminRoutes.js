import express from "express";
import { getDashboardStats, getCustomers, toggleBlockCustomer } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly); // Admin-only routes

router.get("/stats", getDashboardStats);
router.get("/customers", getCustomers);
router.put("/customers/:id/block", toggleBlockCustomer);

export default router;
