import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import { v2 as cloudinary } from "cloudinary";

// 1. CREATE POST: Handles both Student Grievances and Admin Announcements
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, image } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  // Automatic logic: Users create pending grievances, Admins create approved announcements
  let postType = "grievance";
  let postStatus = "pending";

  if (userRole === "admin") {
    postType = "announcement";
    postStatus = "approved";
  }

  let imageUrl = "";
  if (image) {
    const uploadedResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadedResponse.secure_url;
  }

  const newPost = new Post({
    author: userId,
    title,
    content,
    image: imageUrl,
    type: postType,
    status: postStatus,
  });

  await newPost.save();

  // If student posts a grievance, notify all admins
  if (postType === "grievance") {
    const admins = await User.find({ role: "admin" });
    const adminNotifications = admins.map(admin => ({
      from: userId,
      to: admin._id,
      type: "new_grievance", // Ensure this is in your Notification enum
      post: newPost._id,
    }));
    await Notification.insertMany(adminNotifications);
  }

  res.status(201).json(newPost);
});

// 2. GET APPROVED POSTS: For the main student feed
export const getApprovedPosts = asyncHandler(async (req, res) => {
  // Fetches both Announcements and Approved Grievances
  const posts = await Post.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .populate("author", "firstName lastName profilePicture");
    
  res.status(200).json(posts);
});

// 3. GET PENDING POSTS: (Admin Only) For the approval queue
export const getPendingPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .populate("author", "firstName lastName email");
    
  res.status(200).json(posts);
});

// 4. APPROVE POST: (Admin Only) Moves grievance to public feed
export const approvePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findByIdAndUpdate(
    id,
    { status: "approved" },
    { new: true }
  );

  if (!post) return res.status(404).json({ error: "Post not found" });

  // Notify the student that their post is now public
  await Notification.create({
    from: req.user._id,
    to: post.author,
    type: "post_approved",
    post: post._id,
  });

  res.status(200).json({ message: "Post approved", post });
});

// 5. DELETE POST: Admin can delete anything, Student can delete own
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) return res.status(404).json({ error: "Post not found" });

  const isAdmin = req.user.role === "admin";
  const isOwner = post.author.toString() === req.user._id.toString();

  if (isAdmin || isOwner) {
    // If there is a cloudinary image, delete it too
    if (post.image) {
      const imgId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
});