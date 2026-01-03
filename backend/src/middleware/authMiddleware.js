import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - you must be logged in" });
  }
  
  // Fetch the user from MongoDB and attach to request
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  req.user = user;
  next();
});

export const isAdmin = (req, res, next) => {
  // This depends on protectRoute being called first
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied - Admin privileges required" });
  }
};