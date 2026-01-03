import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { getUserProfile, updateProfile, syncUser, getCurrentUser, checkUserApprovalStatus  } from '../controllers/userController.js';
import { createPost, getPosts, getPost, getUserPosts, likePost, deletePost } from '../controllers/postController.js';  
import { protectRoute } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/sync", protectRoute, syncUser);
router.put("/profile", protectRoute, updateProfile);
router.get("/me", protectRoute, getCurrentUser);
router.get("/approval-status", protectRoute, checkUserApprovalStatus);

router.post('/create-post', protectRoute, upload.single('image'), createPost);
// router.post("/create-post", protectRoute, createPost);
router.get("/post/feed", protectRoute, getPosts);
router.get("/post/:postId", protectRoute, getPost);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/:postId/like", protectRoute, likePost);
router.delete("/:postId", protectRoute, deletePost);



export default router;