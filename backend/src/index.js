import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
 import commentRoutes from "./routes/commentRoutes.js";
 import notificationRoutes from "./routes/notificationRoutes.js";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { arcjetMiddleware } from "./middleware/arcjetMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware({
  secretKey: ENV.CLERK_SECRET_KEY,
}));
// app.use(arcjetMiddleware);

app.get("/", (req, res) => res.send("Hello from server"));

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();

    // listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// export for vercel
export default app;