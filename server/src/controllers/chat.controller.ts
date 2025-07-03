import { Request, Response } from 'express';
import { chatWithAI } from '../ai/ai.service';
import Chat from '../models/chat.model';

export const handleChat = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const userId = req.user?.id;

  if (!prompt || !userId) {
    res.status(400).json({ message: 'Prompt and user are required' });
    return;
  }

  try {
    const response = await chatWithAI(userId, prompt);
    res.status(200).json({ response });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Failed to get AI response' });
  }
};


export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return; 
    }

    const chats = await Chat.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ chats });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
}