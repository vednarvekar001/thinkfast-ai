import { Router } from 'express';
import {handleChat, getChatHistory, createNewChat, getChatById } from '../controllers/chat.controller';
import checkAuth from '../middlewares/auth.middleware';

const router = Router();

router.post('/ask', checkAuth, handleChat);
router.get('/history', checkAuth, getChatHistory);
router.post('/new', checkAuth, createNewChat); // ✅ Add this
router.get('/:id', checkAuth, getChatById);     // ✅ Add this

export default router;
