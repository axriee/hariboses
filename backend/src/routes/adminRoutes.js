import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { getPendingUsers, approveUser, deleteUser, getSystemStats } from '../controllers/adminController.js';       
import { createPost, getPendingPosts, approvePost, deletePost, replyGrievance } from '../controllers/postController.js';  
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();
 
router.get("/pending-users", protectRoute, isAdmin, getPendingUsers);
router.put("/approve-user/:userId", protectRoute, isAdmin, approveUser);
router.delete("/delete-user/:userId", protectRoute, isAdmin, deleteUser);
router.get("/system-stats", protectRoute, isAdmin, getSystemStats);

router.post('/create-post', protectRoute, upload.single('image'), createPost);
router.get("/posts/pending", protectRoute, isAdmin, getPendingPosts);
router.put("/posts/approve/:id", protectRoute, isAdmin, approvePost);
router.delete("/posts/delete/:id", protectRoute, deletePost);
router.post("/reply-grievance/:postId", protectRoute, replyGrievance);



export default router;