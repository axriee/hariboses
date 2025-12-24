import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/Notification.js";
import Comment from "../models/Comment.js";

// --- PUBLIC FUNCTIONS ---

// @desc    Get all APPROVED posts for the public feed
export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .populate("author", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      // Sort comments so that the pinned admin reply always stays at the top
      options: { sort: { isPinned: -1, createdAt: -1 } },
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture role",
      },
    });

  res.status(200).json({ posts });
});

// @desc    Get a single post by ID
export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .populate("author", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      options: { sort: { isPinned: -1, createdAt: -1 } },
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture role",
      },
    });

  if (!post) return res.status(404).json({ error: "Post not found" });
  res.status(200).json({ post });
});

// @desc    Get all posts by a specific user
export const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate("author", "username firstName lastName profilePicture");

  res.status(200).json({ posts });
});

// @desc    Create a new post (starts as pending)
export const createPost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  if (!content && !imageFile) {
    return res.status(400).json({ error: "Post must contain either text or image" });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  let imageUrl = "";
  if (imageFile) {
    const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "social_media_posts",
    });
    imageUrl = uploadResponse.secure_url;
  }

  const post = await Post.create({
    author: user._id,
    content: content || "",
    image: imageUrl,
    status: "pending", // New posts require admin approval
  });

  res.status(201).json({ post });
});

// @desc    Like/Unlike a post
export const likePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) return res.status(404).json({ error: "User or post not found" });

  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
  } else {
    await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } });
    if (post.author.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.author,
        type: "like",
        post: postId,
      });
    }
  }

  res.status(200).json({ message: isLiked ? "Unliked" : "Liked" });
});

// --- ADMIN & MODERATION FUNCTIONS ---

// @desc    Get PENDING posts (Admin only)
export const getPendingPosts = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const posts = await Post.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .populate("author", "username firstName lastName profilePicture");

  res.status(200).json({ posts });
});

// @desc    Approve a pending post
export const approvePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const post = await Post.findByIdAndUpdate(postId, { status: "approved" }, { new: true });
  if (!post) return res.status(404).json({ error: "Post not found" });

  res.status(200).json({ message: "Post approved", post });
});

// @desc    Admin replies to grievance: Creates a comment and pins it to the top
export const replyGrievance = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { replyText } = req.body;

  const adminUser = await User.findOne({ clerkId: userId });
  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (!replyText) {
    return res.status(400).json({ error: "Reply text is required" });
  }

  // 1. Create the admin's reply as a Pinned Comment
  const adminComment = await Comment.create({
    content: replyText,
    user: adminUser._id,
    post: postId,
    isPinned: true, // Custom field to ensure it sorts to the top
  });

  // 2. Update post: Add comment ID, resolve grievance, and approve for public view
  const post = await Post.findByIdAndUpdate(
    postId,
    { 
      $push: { comments: adminComment._id },
      grievanceViewed: true,
      status: "approved" 
    },
    { new: true }
  );

  if (!post) return res.status(404).json({ error: "Post not found" });

  res.status(200).json({ message: "Admin response pinned to comments", post });
});

// @desc    Delete post (Owner or Admin)
export const deletePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) return res.status(404).json({ error: "User or post not found" });

  if (post.user.toString() !== user._id.toString() && user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Deleting the post also cleans up all associated comments
  await Comment.deleteMany({ post: postId });
  await Post.findByIdAndDelete(postId);

  res.status(200).json({ message: "Post and comments deleted successfully" });
});