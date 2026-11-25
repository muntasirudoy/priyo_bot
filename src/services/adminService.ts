import { api } from './api';
import { DashboardMetrics, ConversationSummary, BotSettings, KnowledgeGap } from '../types';

export interface DashboardData {
  metrics: DashboardMetrics;
  recentConversations: ConversationSummary[];
}

export const adminService = {
  async getDashboard(): Promise<DashboardData> {
    const res = await api.get('/admin/dashboard');
    return res.data.data;
  },
  async getSettings(): Promise<BotSettings> { const res = await api.get('/admin/settings'); return res.data.data; },
  async updateSettings(settings: BotSettings): Promise<BotSettings> { const res = await api.put('/admin/settings', settings); return res.data.data; },
  async getKnowledgeGaps(): Promise<KnowledgeGap[]> { const res = await api.get('/admin/knowledge-gaps'); return res.data.data; },
  async resolveKnowledgeGap(id: string): Promise<void> { await api.patch(`/admin/knowledge-gaps/${id}/resolve`); },
};
