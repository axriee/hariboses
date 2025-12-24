import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

// 1. GET ALL PENDING USERS: For the Admin "Approval Queue" screen
export const getPendingUsers = asyncHandler(async (req, res) => {
    // Fetch users where isApproved is false and role is 'user'
    const pendingUsers = await User.find({ isApproved: false, role: "user" }).sort({ createdAt: -1 });
    res.status(200).json(pendingUsers);
});

// 2. APPROVE USER: Flip the isApproved switch
export const approveUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
        userId,
        { isApproved: true },
        { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    // NOTIFY THE STUDENT: Create a notification so they know they can now log in
    await Notification.create({
        from: req.user._id, // The Admin
        to: user._id,       // The Student
        type: "account_approved", // Ensure this is in your Notification enum
    });

    res.status(200).json({ message: `User ${user.username} approved successfully`, user });
});

// 3. DELETE USER: Admin can remove problematic accounts
export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if trying to delete another admin (Safety feature)
    if (user.role === "admin") {
        return res.status(403).json({ error: "You cannot delete another admin account" });
    }

    await User.findByIdAndDelete(userId);
    
    // Optional: Delete all posts/comments associated with this user
    await Post.deleteMany({ author: userId });

    res.status(200).json({ message: "User and their data deleted successfully" });
});

// 4. GET SYSTEM STATS: (Optional but helpful for Admin Dashboard)
export const getSystemStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: "user" });
    const pendingGrievances = await Post.countDocuments({ status: "pending" });
    const totalAnnouncements = await Post.countDocuments({ type: "announcement" });

    res.status(200).json({
        totalUsers,
        pendingGrievances,
        totalAnnouncements
    });
});