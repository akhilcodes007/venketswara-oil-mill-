import Notification from "../models/Notification.js";

/**
 * Gets notifications list.
 */
export async function getNotifications(req, res) {
  try {
    let notifications;
    if (req.user.role === "admin") {
      // Admins get general/admin alerts
      notifications = await Notification.find({ user_id: null }).sort({ createdAt: -1 });
    } else {
      // Customers get their own specific notifications
      notifications = await Notification.find({ user_id: req.user._id.toString() }).sort({ createdAt: -1 });
    }
    res.status(200).json(notifications);
  } catch (error) {
    console.error("[Notification Controller] Get Notifications Error:", error);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
}

/**
 * Marks a notification as read.
 */
export async function markAsRead(req, res) {
  const { id } = req.params;

  try {
    const updated = await Notification.findByIdAndUpdate(id, { $set: { isRead: true } }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("[Notification Controller] Mark Read Error:", error);
    res.status(500).json({ message: "Server error updating notification status" });
  }
}
