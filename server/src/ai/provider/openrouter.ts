import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { ChatCompletionRequestMessage } from '../ai.service';

const formatResponse = (response: string): string => {
  // Preserve Markdown formatting while cleaning
  return response
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    // Ensure proper paragraph spacing
    .replace(/\n{3,}/g, '\n\n')
    // Clean up bullet points
    .replace(/^\s*[\-•*]\s+/gm, '- ')
    // Trim each line
    .split('\n').map(line => line.trim()).join('\n')
    // Final trim
    .trim();
};

const openRouterAPI = async (
  messages: ChatCompletionRequestMessage[],
  maxLength: number = 150
): Promise<string> => {
  try {
    // Add formatting instructions to the last message
    const formattedMessages = [...messages];
    if (formattedMessages.length > 0) {
      formattedMessages.push({
        role: 'system',
        content: 'Format your response using Markdown: **bold** for important terms, _italics_ for emphasis, and proper paragraph breaks.'
      });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: formattedMessages,
        temperature: 0.5,
        max_tokens: maxLength,
        top_p: 0.9,
        frequency_penalty: 0.5,
        response_format: { type: 'text' } // Ensure we get plain text with Markdown
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:4004',
          'Content-Type': 'application/json',
        },
      }
    );

    return formatResponse(response.data.choices[0].message.content);
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response');
  }
};

export default openRouterAPI;