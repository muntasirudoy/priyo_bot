import { api } from './api';
import { SourceReference, ChatMessage } from '../types';
import { ChatIdentity } from '../features/chat/EmailGate';

export interface SendMessageResponse {
  answer: string;
  sources: SourceReference[];
  conversationId: string;
  needsHuman: boolean;
  status: string;
}

export const chatService = {
  async getGreeting(): Promise<{ botName: string; greetingMessage: string }> { const res = await api.get('/chat/greeting'); return res.data.data; },
  async sendMessage(sessionId: string, message: string, identity: ChatIdentity, siteId = 'default'): Promise<SendMessageResponse> {
    const res = await api.post('/chat/message', { sessionId, message, siteId, userEmail: identity.email, userName: identity.name });
    return res.data;
  },

  async getSessionHistory(sessionId: string, email: string): Promise<{ messages: ChatMessage[]; status: string }> {
    const res = await api.get(`/chat/conversations/${sessionId}`, { params: { userEmail: email } });
    return { messages: res.data.data.messages || [], status: res.data.data.conversation.status };
  },
};
