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

  // Determine response type
  const isGreetingMsg = isGreeting(prompt);
  const isCapabilitiesQuery = /what can you do|capabilities|functions/i.test(prompt);
  const isTechnical = isTechnicalQuestion(prompt);

  // HARD-CODED RESPONSES
  if (isGreetingMsg) {
    const name = extractName(prompt);
    return `Hi${name ? ' ' + name : ''}! I'm Bolt. How can I help?`;
  }

  if (isCapabilitiesQuery) {
    return `I can answer questions and help with various topics. What specifically would you like to know?`;
  }

  // For all other cases, use the AI with strict controls
  const systemPrompt: ChatCompletionRequestMessage = {
    role: 'system',
    content: `You are Bolt from ThinkFast AI. STRICT RULES:
1. RESPONSE LENGTH:
   - MAXIMUM 2 sentences
   - 1 sentence preferred

2. CONTENT:
   - NO introductions
   - NO self-references
   - NO unsolicited examples
   - NO capability listings
   - ONLY answer what was asked

3. TONE:
   - Friendly but professional
   - Concise and direct
   - Avoid filler words

VIOLATIONS WILL RESULT IN REPLY REJECTION`
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

  // Enforce hard limits
  if (!isTechnical) {
    const sentences = reply.split(/[.!?]+/).filter(Boolean);
    if (sentences.length > 2) {
      reply = sentences.slice(0, 2).join('. ') + '.';
    }
  }

  return reply.trim();
};

// Helper functions
const extractName = (text: string): string | null => {
  const nameMatch = text.match(/(?:i am|i'm|name is|it's|this is) ([a-zA-Z]+)/i);
  return nameMatch ? nameMatch[1] : null;
};

const isGreeting = (text: string): boolean => {
  return /^(hi|hello|hey|greetings|sup|yo)/i.test(text.trim());
};

const isTechnicalQuestion = (text: string): boolean => {
  return /(explain|how does|what is|define|describe)/i.test(text);
};