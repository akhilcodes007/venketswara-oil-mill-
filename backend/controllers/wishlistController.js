import Wishlist from "../models/Wishlist.js";

/**
 * Gets a user's persistent wishlist.
 */
export async function getWishlist(req, res) {
  try {
    const wishlist = await Wishlist.findOne({ user_id: req.user._id.toString() });
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("[Wishlist Controller] Get Wishlist Error:", error);
    res.status(500).json({ message: "Server error fetching wishlist" });
  }
}

/**
 * Saves/Syncs the wishlist to the database.
 */
export async function saveWishlist(req, res) {
  const { items } = req.body;

  try {
    const updated = await Wishlist.findOneAndUpdate(
      { user_id: req.user._id.toString() },
      { $set: { items } },
      { new: true, upsert: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error("[Wishlist Controller] Save Wishlist Error:", error);
    res.status(500).json({ message: "Server error syncing wishlist" });
  }
}
