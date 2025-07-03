import mongoose, { Schema, Document } from 'mongoose';
import { ChatCompletionRequestMessage } from '../ai/ai.service';

export interface ChatDocument extends Document {
  user: mongoose.Types.ObjectId;
  messages: ChatCompletionRequestMessage[];
  createdAt: Date;
  imageUrl: String;
}

const chatSchema = new Schema<ChatDocument>(
  {
    imageUrl: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
      {
        role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
        content: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model<ChatDocument>('Chat', chatSchema);
export default Chat;
