import express from "express";
import { createOrder, getOrders, updateOrderStatus, downloadInvoice, getOrderTracking } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { validateCheckout } from "../middleware/validators.js";

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post("/", validateCheckout, createOrder);
router.get("/", getOrders);
router.get("/:id/invoice", downloadInvoice);
router.get("/:id/tracking", getOrderTracking);

// Admin-only order status modifications
router.put("/:id/status", adminOnly, updateOrderStatus);

export default router;
