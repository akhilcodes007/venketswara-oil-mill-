import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Notifications require user session

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);

export default router;
