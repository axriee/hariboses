import express from 'express';
import { getPendingUsers, approveUser, deleteUser, getSystemStats } from '../controllers/adminController.js';       
import { createPost, getApprovedPosts, getPendingPosts, approvePost, deletePost } from '../controllers/postController.js';  
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/pending-users", protectRoute, isAdmin, getPendingUsers);
router.put("/approve-user/:userId", protectRoute, isAdmin, approveUser);
router.delete("/delete-user/:userId", protectRoute, isAdmin, deleteUser);
router.get("/system-stats", protectRoute, isAdmin, getSystemStats);

router.post("/posts", protectRoute, createPost);
router.get("/posts/approved", protectRoute, isAdmin, getApprovedPosts);
router.get("/posts/pending", protectRoute, isAdmin, getPendingPosts);
router.put("/posts/approve/:id", protectRoute, isAdmin, approvePost);
router.delete("/posts/delete/:id", protectRoute, deletePost);



export default router;