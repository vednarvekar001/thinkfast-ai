import { Request, Response } from 'express';
import Chat from '../models/chat.model';
import { chatWithAI } from '../ai/ai.service';
import { UserDocument } from '../models/user.model';

interface AuthRequest extends Request {
  user?: UserDocument;
}

export const handleChat = async (req: AuthRequest, res: Response) => {
  const { prompt, chatId, extractedText, fileInfo, conversationHistory } = req.body;
  const userId = req.user?._id;

  const finalPrompt = prompt || extractedText;

  if (!finalPrompt || !userId) {
    return res.status(400).json({ message: 'Prompt and user are required' });
  }

  try {
    const response = await chatWithAI({
      userId: userId.toString(),
      prompt: finalPrompt,
      history: conversationHistory || [],
      fileInfo
    });

    const userMessage = fileInfo ? `📄 ${fileInfo.name}` : finalPrompt;

    let chat;
    if (chatId) {
      // Existing chat - just add messages
      chat = await Chat.findOneAndUpdate(
        { _id: chatId, user: userId },
        {
          $push: {
            messages: {
              $each: [
                { role: 'user', content: userMessage },
                { role: 'assistant', content: response }
              ]
            }
          }
        },
        { new: true }
      );
    } else {
      // New chat - create with initial title based on content
      const title = (fileInfo ? fileInfo.name : finalPrompt).slice(0, 50) + '...';
      chat = await Chat.create({
        user: userId,
        messages: [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: response }
        ],
        title: title,
      });
    }

    res.status(200).json({ response, chatId: chat._id });
  } catch (err) {
    console.error('Chat Error:', err);
    res.status(500).json({ message: 'Failed to get AI response' });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const chats = await Chat.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.status(200).json({ chats });
  } catch (error) {
    console.error('❌ Chat History Error:', error);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};

export const createNewChat = async (req: AuthRequest, res: Response) => {
  try {
    const newChat = new Chat({
      user: req.user?._id,
      messages: [],
      title: 'New Chat', // Default title
    });

    await newChat.save();
    res.status(201).json({ chatId: newChat._id });
  } catch (err) {
    console.error('Error creating new chat:', err);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

export const getChatById = async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user?._id });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.status(200).json({ chat });
  } catch (err) {
    console.error('Error fetching chat by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
