import express from "express";
import { verifyCoupon, createCoupon } from "../controllers/couponController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Coupons are applied inside authenticated checkouts

router.get("/:code", verifyCoupon);
router.post("/", adminOnly, createCoupon);

export default router;
