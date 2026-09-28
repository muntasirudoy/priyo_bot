import { api } from './api';
import { SourceReference, ChatMessage } from '../types';

export interface SendMessageResponse {
  answer: string;
  sources: SourceReference[];
  conversationId: string;
  needsHuman: boolean;
}

export const chatService = {
  async sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
    const res = await api.post('/chat/message', { sessionId, message });
    return res.data;
  },

  async getSessionHistory(sessionId: string): Promise<ChatMessage[]> {
    const res = await api.get(`/chat/conversations/${sessionId}`);
    return res.data.data.messages || [];
  },
};
