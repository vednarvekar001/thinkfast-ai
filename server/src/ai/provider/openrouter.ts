import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { ChatCompletionRequestMessage } from '../ai.service';

const formatResponse = (response: string): string => {
  // Normalize all numbered lists first
  let formatted = response
    // Fix numbered lists with missing newlines
    .replace(/(\d+\.)\s+(.*?)(?=\n\d+\.|\n\n|$)/gs, '$1 $2\n')
    // Ensure space after numbers
    .replace(/(\d+)\.(\S)/g, '$1. $2')
    // Add newlines before numbered lists
    .replace(/([^\n])(\d+\.)/g, '$1\n$2')
    // Fix spaced numbers (1 0. → 10.)
    .replace(/(\d)\s+(\d)\./g, '$1$2.')
    // Ensure proper spacing after numbers
    .replace(/(\d+)\.(\S)/g, '$1. $2')
    // Standardize list formatting
    .replace(/(\d+\.)\s*(.+?)(?=\n\d+\.|\n\n|$)/gs, '$1 $2\n');

  // Then handle general formatting
  formatted = formatted
    .replace(/\r\n/g, '\n')
    .replace(/(\n\s*[A-Z][a-z].*?:)\s*\n/g, '$1\n\n')
    .replace(/(\d+\.|\-)\s+(.*?)(?=\n\d+\.|\n\-|\n\n|$)/gs, '$1 $2\n')
    .replace(/^\s*[\-•*]\s+/gm, '• ')
    .replace(/([.!?])\s+(?=[A-Z])/g, '$1\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Final cleanup for numbered lists
  return formatted.replace(/(\d+\.)\s*(.+)\n(\D)/g, '$1 $2\n\n$3');
};

const openRouterAPI = async (
  messages: ChatCompletionRequestMessage[],
  maxLength: number = 150
): Promise<string> => {
  try {
    // Add a system prompt to enforce Markdown formatting
    const formattedMessages = [
      {
        role: 'system',
        content: `You are Bolt AI. STRICT RESPONSE FORMATTING RULES:
1. Paragraph Structure:
   - Maximum 4 sentences per paragraph
   - Separate paragraphs with 2 newlines (\\n\\n)
  
2. For numbered lists:
   - ALWAYS start with number and period (1. 2. 3.)
   - Put EXACTLY one space after the period
   - Put each item on its own line
   - Add blank line before first item
   - Example:
     1. First item
     2. Second item

3. NEVER continue list items in paragraphs
4. If explaining list items, add blank line after list first
5. Maximum 1 sentence per numbered list item

6. Lists:
   - Use • for bullet points
   - Use 1. 2. 3. for numbered lists
   - Put each item on new line
   - Add blank line before/after lists

7. Emphasis:
   - **Bold** for key terms
   - _Italics_ for emphasis
8. NEVER merge different topics into one paragraph.
9. ALWAYS add space after headings.
10. Keep technical explanations CLEARLY separated.

Numbering Rules:
1. For lists with 1-9 items:
   - Use "1. ", "2. ", etc. with single space after dot
   
2. For lists with 10+ items:
   - Use "10. ", "11. " (NO space between number and dot)
   - ALWAYS use two digits for 1-9 when list goes beyond 9:
     - 01. First item
     - 02. Second item
     - ...
     - 10. Tenth item

3. NEVER:
   - Put space between digits ("1 0.")
   - Continue list items in paragraphs
   - Mix numbered and bullet points`
      },
      ...messages
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'moonshotai/kimi-k2:free',
        messages: formattedMessages,
        temperature: 0.5,
        max_tokens: maxLength,
        top_p: 0.9,
        frequency_penalty: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:4004',
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0]?.message?.content || '';
    return formatResponse(content);
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response');
  }
};

export default openRouterAPI;