import http from 'http';
import express from 'express';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { initSocket } from './sockets/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// ── Route imports ────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

// ── Express + HTTP server ─────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// Allowed CORS origins — extend via FRONTEND_URL env var for Vercel/Netlify etc.
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
];

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new SocketServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});
initSocket(io);

// ── Security middleware ───────────────────────────────────────────────────────
// Helmet sets sensible HTTP security headers; CSP disabled to allow Swagger UI.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Applied to all /api/* routes — individual sub-limiters can be added per route.
app.use('/api/', apiLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
// Used by Render, Railway, or any uptime monitor.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Sri Venkateshwara Oil Mill API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Swagger API documentation ─────────────────────────────────────────────────
// Available at /api/docs (UI) and /api/docs.json (raw spec)
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { background-color: #4A3B32; }',
    customSiteTitle: 'SVEM API Docs',
  })
);
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// ── Error handlers (must be registered last) ──────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5000', 10);
server.listen(PORT, () => {
  console.log(`\n🚀 SVEM Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Docs:  http://localhost:${PORT}/api/docs`);
  console.log(`🔍 Health:    http://localhost:${PORT}/health`);
  console.log(`📦 Env:       ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
