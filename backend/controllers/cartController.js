import Cart from "../models/Cart.js";

/**
 * Gets a user's persistent cart from the database.
 */
export async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id.toString() });
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("[Cart Controller] Get Cart Error:", error);
    res.status(500).json({ message: "Server error fetching cart" });
  }
}

/**
 * Saves/Syncs the cart to the database.
 */
export async function saveCart(req, res) {
  const { items } = req.body;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user_id: req.user._id.toString() },
      { $set: { items } },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("[Cart Controller] Save Cart Error:", error);
    res.status(500).json({ message: "Server error syncing cart to database" });
  }
}

/**
 * Clears the persistent cart in the database.
 */
export async function clearCart(req, res) {
  try {
    await Cart.findOneAndDelete({ user_id: req.user._id.toString() });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("[Cart Controller] Clear Cart Error:", error);
    res.status(500).json({ message: "Server error clearing cart" });
  }
}
