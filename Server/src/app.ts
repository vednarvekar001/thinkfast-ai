import express from 'express';
import authRoutes from './routes/auth.routes'
import chatRoutes from './routes/chat.routes';
import cookieParser from 'cookie-parser';



const app = express()


app.use(express.json())
app.use(cookieParser());
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes);



export default app;

