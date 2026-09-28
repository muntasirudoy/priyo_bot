export type DocumentStatus = 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ConversationStatus = 'ACTIVE' | 'HUMAN_REQUIRED' | 'CLOSED';
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface SourceReference {
  documentId?: string;
  documentName: string;
  pageNumber: number;
  chunkId?: string;
  similarityScore?: number;
}

export interface ChatMessage {
  id?: string;
  role: MessageRole;
  content: string;
  sources?: SourceReference[];
  createdAt?: string;
}

export interface DocumentItem {
  id: string;
  originalName: string;
  filename: string;
  status: DocumentStatus;
  totalChunks: number;
  processingError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationSummary {
  id: string;
  sessionId: string;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  lastQuestion: string;
  lastActivity: string;
  messageCount: number;
}

export interface ConversationDetail {
  conversation: {
    id: string;
    sessionId: string;
    status: ConversationStatus;
    createdAt: string;
    updatedAt: string;
  };
  messages: Array<{
    id: string;
    role: MessageRole;
    content: string;
    sources: SourceReference[];
    createdAt: string;
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface DashboardMetrics {
  totalConversations: number;
  totalQuestions: number;
  totalAiResponses: number;
  humanEscalationCount: number;
  totalDocuments: number;
}
