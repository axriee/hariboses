import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - you must be logged in" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  // This depends on protectRoute being called first
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied - Admin privileges required" });
  }
};