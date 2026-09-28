import { api } from './api';
import { DocumentItem } from '../types';

export const documentService = {
  async getDocuments(): Promise<DocumentItem[]> {
    const res = await api.get('/documents');
    return res.data.data.documents;
  },

  async getDocument(id: string): Promise<DocumentItem> {
    const res = await api.get(`/documents/${id}`);
    return res.data.data.document;
  },

  async uploadPdf(file: File): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data.document;
  },

  async deleteDocument(id: string): Promise<void> {
    await api.delete(`/documents/${id}`);
  },
};
