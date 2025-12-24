import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { createComment, getComments, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

// Public
router.get("/post/:postId", getComments);

// Protected
router.post("/post/:postId", protectRoute, createComment);
router.delete("/:commentId", protectRoute, deleteComment);

export default router;