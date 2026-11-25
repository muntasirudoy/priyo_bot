import { api } from './api';
import { ConversationSummary, ConversationDetail, ConversationStatus } from '../types';

export const conversationService = {
  async getConversations(page = 1, limit = 20): Promise<{
    conversations: ConversationSummary[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const res = await api.get('/conversations', { params: { page, limit } });
    return res.data.data;
  },

  async getConversation(id: string): Promise<ConversationDetail> {
    const res = await api.get(`/conversations/${id}`);
    return res.data.data;
  },

  async updateStatus(id: string, status: ConversationStatus): Promise<void> {
    await api.patch(`/conversations/${id}/status`, { status });
  },
};
