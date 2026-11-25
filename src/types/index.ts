export type DocumentStatus = 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ConversationStatus = 'bot' | 'human_requested' | 'agent_active' | 'resolved';
export type MessageRole = 'USER' | 'ASSISTANT' | 'AGENT' | 'SYSTEM';
export interface BotSettings { botName: string; tone: 'friendly' | 'professional' | 'casual'; greetingMessage: string; fallbackMessage: string; confidenceThreshold: number }
export interface KnowledgeGap { id: string; query: string; userEmail: string; conversationId: string; resolved: boolean; createdAt: string }

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
  siteId?: string;
  status: ConversationStatus;
  userEmail: string;
  userName?: string;
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
    siteId?: string;
    status: ConversationStatus;
    userEmail: string;
    userName?: string;
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
