import express from 'express';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import uploadRoutes from './routes/upload.routes';
import userRoutes from './routes/user.routes';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware';
import { limiter } from './middlewares/rateLimit.middleware';

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user', userRoutes);
app.use(errorHandler);
app.use(limiter);

export default app;

