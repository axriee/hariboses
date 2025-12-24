import express from 'express';
import { getUserProfile, updateProfile, syncUser, getCurrentUser  } from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/sync", protectRoute, syncUser);
router.put("/profile", protectRoute, updateProfile);
router.get("/me", protectRoute, getCurrentUser);




export default router;