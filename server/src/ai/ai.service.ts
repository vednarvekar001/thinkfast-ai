import openRouterAPI from './provider/openrouter';
import Chat from '../models/chat.model';
// import { ChatCompletionRequestMessage } from '../types/chat';

export type ChatCompletionRequestMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};


export const chatWithAI = async (userId: string, prompt: string): Promise<string> => {
  // Fetch latest chat history for the user (optional: limit by last 10)
  const previousChats = await Chat.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(1);

  const messages: ChatCompletionRequestMessage[] =
    previousChats[0]?.messages || [
      { role: 'system', content: 'You are a helpful AI assistant.' },
    ];

  messages.push({ role: 'user', content: prompt });

  const reply = await openRouterAPI(messages);

  messages.push({ role: 'assistant', content: reply });

  // Save updated chat history
  await Chat.findOneAndUpdate(
    { _id: previousChats[0]?._id || null },
    { user: userId, messages },
    { upsert: true, new: true }
  );

  return reply;
};
