import { api } from './api';
import { AdminUser } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ admin: AdminUser; token: string }> {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  async getMe(): Promise<AdminUser> {
    const res = await api.get('/auth/me');
    return res.data.data.admin;
  },

  logout(): void {
    localStorage.removeItem('support_admin_token');
    localStorage.removeItem('support_admin_user');
  },
};
