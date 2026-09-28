import { api } from './api';
import { DashboardMetrics, ConversationSummary } from '../types';

export interface DashboardData {
  metrics: DashboardMetrics;
  recentConversations: ConversationSummary[];
}

export const adminService = {
  async getDashboard(): Promise<DashboardData> {
    const res = await api.get('/admin/dashboard');
    return res.data.data;
  },
};
