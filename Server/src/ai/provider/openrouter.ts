import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { ChatCompletionRequestMessage } from '../ai.service';

const openRouterAPI = async (
  messages: ChatCompletionRequestMessage[],
  model: string = 'mistralai/mistral-7b-instruct'
): Promise<string> => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:4004',
          'Content-Type': 'application/json',
        },
      }
    );
console.log('Loaded OpenRouter Key:', process.env.OPENROUTER_API_KEY);

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('🛑 Error calling OpenRouter API');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
    throw new Error('Failed to fetch response from OpenRouter API');
  }
};

export default openRouterAPI;
