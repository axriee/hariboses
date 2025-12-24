import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getNotifications, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;