import http from "http";
import express from "express";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { initSocket } from "./utils/socket.js";
import { seedDB } from "./scripts/seed.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Routers
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load Environment Variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io Server with CORS enabled for frontend ports
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Adjust to specific frontend domains (like port 5173 / localhost) in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Bind Socket events
initSocket(io);

// Database connection initialized below before starting server listener

// Middleware stack
app.use(helmet());
app.use(
  cors({
    origin: "*", // Matches client domains
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all requests
app.use("/api/", apiLimiter);

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Fallbacks for undefined routes and general exceptions
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Resolve database first, seed initial values, then boot Express listener
connectDB().then(() => {
  seedDB();
  server.listen(PORT, () => {
    console.log(`[Server] Express server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
});
