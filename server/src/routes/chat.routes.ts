import { Router } from 'express';
import { handleChat, getChatHistory } from '../controllers/chat.controller';
import checkAuth from '../middlewares/auth.middleware';

const router = Router();

router.post('/ask', checkAuth, handleChat);
router.get('/history', checkAuth, getChatHistory)

export default router;
