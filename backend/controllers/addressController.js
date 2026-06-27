import ShippingAddress from "../models/ShippingAddress.js";

/**
 * Gets all saved addresses for a user.
 */
export async function getAddresses(req, res) {
  try {
    const addresses = await ShippingAddress.find({ user_id: req.user._id.toString() });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("[Address Controller] Get Addresses Error:", error);
    res.status(500).json({ message: "Server error retrieving addresses" });
  }
}

/**
 * Adds a new address.
 */
export async function createAddress(req, res) {
  const { label, address, landmark, city, state, pincode, phone } = req.body;
  const userId = req.user._id.toString();

  try {
    const existing = await ShippingAddress.find({ user_id: userId });
    
    // First address is default
    const isDefault = existing.length === 0;

    const newAddress = await ShippingAddress.create({
      user_id: userId,
      label: label || "Home",
      address,
      landmark,
      city,
      state,
      pincode,
      phone,
      isDefault,
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error("[Address Controller] Create Address Error:", error);
    res.status(500).json({ message: "Server error saving address" });
  }
}

/**
 * Updates an address.
 */
export async function updateAddress(req, res) {
  const { id } = req.params;

  try {
    const addressRecord = await ShippingAddress.findOne({ _id: id, user_id: req.user._id.toString() });
    if (!addressRecord) {
      return res.status(404).json({ message: "Address not found" });
    }

    const updated = await ShippingAddress.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("[Address Controller] Update Address Error:", error);
    res.status(500).json({ message: "Server error updating address" });
  }
}

/**
 * Deletes an address.
 */
export async function deleteAddress(req, res) {
  const { id } = req.params;
  const userId = req.user._id.toString();

  try {
    const deleted = await ShippingAddress.findOneAndDelete({ _id: id, user_id: userId });
    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If we deleted the default address, make another one default (if any exist)
    if (deleted.isDefault) {
      const remaining = await ShippingAddress.find({ user_id: userId });
      if (remaining.length > 0) {
        await ShippingAddress.findByIdAndUpdate(remaining[0]._id, { $set: { isDefault: true } });
      }
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("[Address Controller] Delete Address Error:", error);
    res.status(500).json({ message: "Server error deleting address" });
  }
}

/**
 * Sets a specific address as default.
 */
export async function setDefaultAddress(req, res) {
  const { id } = req.params;
  const userId = req.user._id.toString();

  try {
    const address = await ShippingAddress.findOne({ _id: id, user_id: userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Set all others to false
    await ShippingAddress.updateMany({ user_id: userId }, { $set: { isDefault: false } });

    // Set this to true
    address.isDefault = true;
    await address.save();

    res.status(200).json({ message: "Default address updated", address });
  } catch (error) {
    console.error("[Address Controller] Set Default Error:", error);
    res.status(500).json({ message: "Server error setting default address" });
  }
}
