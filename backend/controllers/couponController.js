import Coupon from "../models/Coupon.js";

/**
 * Checks validity of a coupon code.
 */
export async function verifyCoupon(req, res) {
  const { code } = req.params;
  const cleanCode = code.trim().toUpperCase();

  try {
    const coupon = await Coupon.findOne({ code: cleanCode });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon has been deactivated" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Coupon code has expired" });
    }

    res.status(200).json({
      code: coupon.code,
      discountPct: coupon.discountPct,
    });
  } catch (error) {
    console.error("[Coupon Controller] Verify Coupon Error:", error);
    res.status(500).json({ message: "Server error checking coupon" });
  }
}

/**
 * Admin: Creates a new coupon.
 */
export async function createCoupon(req, res) {
  const { code, discountPct, expiresAt } = req.body;

  try {
    const exists = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountPct,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error("[Coupon Controller] Create Coupon Error:", error);
    res.status(500).json({ message: "Server error saving coupon" });
  }
}
