import openRouterAPI from './provider/openrouter';
import Chat from '../models/chat.model';

export type ChatCompletionRequestMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const getResponseConfig = (prompt: string) => {
  const trimmed = prompt.toLowerCase().trim();

  if (/^(yo|hi|hello|hey|sup)$/.test(trimmed)) {
    return {
      maxLength: 100,
      forceSimple: true,
      systemNote: 'Reply casually in one short sentence with **bold** for emphasis when needed.'
    };
  }

  if (/^(explain|describe|how\s|what\s|why\s|analyze|compare)/.test(trimmed)) {
    return {
      maxLength: 1500,
      systemNote: `Provide a detailed, structured answer with:
- Clear paragraphs
- **Bold** for key terms
- _Italics_ for emphasis
- Bullet points when listing items`
    };
  }

  return {
    maxLength: 3000,
    systemNote: `Reply concisely with:
- 1-2 paragraphs max
- **Bold** for important terms
- _Italics_ for emphasis`
  };
};

interface ChatWithAIOptions {
  userId: string;
  prompt: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  fileInfo?: {
    name: string;
  };
}

export const chatWithAI = async (options: ChatWithAIOptions): Promise<string> => {
  const { userId, prompt, history, fileInfo } = options;
  const responseConfig = getResponseConfig(prompt);

  const systemPrompt: ChatCompletionRequestMessage = {
    role: 'system',
    content: `You are Bolt from ThinkFast AI. Follow these rules STRICTLY:
1. ${history.length === 0 ? 'Introduce yourself briefly once' : 'Never introduce yourself'}
2. ${responseConfig.systemNote}
3. Always use Markdown formatting:
   - **bold** for important terms
   - _italics_ for emphasis
   - Proper paragraph breaks
   - Bullet points for lists
4. Keep technical responses well-structured`
  };

  const messages: ChatCompletionRequestMessage[] = [
    systemPrompt,
    ...history.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { 
      role: 'user', 
      content: fileInfo ? `[File: ${fileInfo.name}] ${prompt}` : prompt 
    }
  ];

  let reply = await openRouterAPI(messages, responseConfig.maxLength);

  // Ensure basic formatting if API didn't comply
  if (!reply.includes('\n\n') && reply.length > 120) {
    reply = reply.replace(/([.!?])\s/g, '$1\n\n');
  }

  // Ensure the response isn't truncated mid-sentence
  const lastPunctuation = Math.max(
    reply.lastIndexOf('.'),
    reply.lastIndexOf('!'),
    reply.lastIndexOf('?')
  );
  
  if (lastPunctuation > 0 && lastPunctuation < reply.length - 1) {
    reply = reply.slice(0, lastPunctuation + 1);
  }

  return reply;
};