import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import uploadRoutes from './routes/upload.routes';
import userRoutes from './routes/user.routes';

import { errorHandler } from './middlewares/error.middleware';
import { limiter } from './middlewares/rateLimit.middleware';

const app = express();

// ✅ Apply rate limiter early
app.use(limiter);

// ✅ Enable CORS with credentials (cookie support)
app.use(cors({
  origin: 'http://localhost:4064', // your frontend port
  credentials: true,
}));

// ✅ Middleware for JSON parsing and cookies
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user', userRoutes);

// ✅ Global error handler should be last
app.use(errorHandler);

export default app;
