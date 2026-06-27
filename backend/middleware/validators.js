/**
 * Validates email structure.
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validator middleware for Email Login OTP sending.
 */
export function validateOtpSend(req, res, next) {
  const { email } = req.body;
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ message: "A valid email address is required" });
  }
  next();
}

/**
 * Validator middleware for Checkout Details validation.
 */
export function validateCheckout(req, res, next) {
  const { customer_name, phone, address, city, state, pincode, items } = req.body;

  if (!customer_name || customer_name.trim().length < 2) {
    return res.status(400).json({ message: "Full Name must be at least 2 characters" });
  }

  // Validate Indian Phone format (typically 10 digits)
  const phoneClean = (phone || "").replace(/\D/g, "");
  if (phoneClean.length < 10 || phoneClean.length > 13) {
    return res.status(400).json({ message: "Enter a valid 10-digit mobile number" });
  }

  if (!address || address.trim().length < 10) {
    return res.status(400).json({ message: "Delivery Address must be at least 10 characters" });
  }

  if (!city || city.trim().length < 2) {
    return res.status(400).json({ message: "City is required" });
  }

  if (!state || state.trim().length < 2) {
    return res.status(400).json({ message: "State is required" });
  }

  // Pincode validation (typically 6 digits)
  const pinClean = (pincode || "").replace(/\D/g, "");
  if (pinClean.length !== 6) {
    return res.status(400).json({ message: "Pincode must be a 6-digit code" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Shopping cart is empty or invalid" });
  }

  next();
}
