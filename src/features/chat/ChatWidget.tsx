import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../../types';
import { chatService } from '../../services/chatService';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or retrieve sessionId
  const getSessionId = () => {
    let id = sessionStorage.getItem('support_session_id');
    if (!id) {
      id = `session_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      sessionStorage.setItem('support_session_id', id);
    }
    return id;
  };

  const sessionId = getSessionId();

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatService.getSessionHistory(sessionId);
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          // Welcome greeting
          setMessages([
            {
              role: 'ASSISTANT',
              content:
                'Hello! 👋 Welcome to customer support. How can I assist you today? You can ask about our shipping, refund policies, warranties, or company info.',
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, [sessionId]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setErrorMessage(null);

    // Optimistic user message
    const userMsg: ChatMessage = {
      role: 'USER',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(sessionId, text);

      if (response.needsHuman) {
        setIsEscalated(true);
      }

      const aiMsg: ChatMessage = {
        role: 'ASSISTANT',
        content: response.answer,
        sources: response.sources,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setErrorMessage(
        err.response?.data?.message || 'Unable to connect to support assistant. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    sessionStorage.removeItem('support_session_id');
    getSessionId();
    setIsEscalated(false);
    setErrorMessage(null);
    setMessages([
      {
        role: 'ASSISTANT',
        content:
          'Starting a fresh conversation! How can I help you today?',
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const sampleQuestions = [
    '',
    '',
    '',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[410px] h-[580px] max-h-[85vh] bg-slate-50 rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden mb-4 animate-slide-up">
          {/* Header */}
          <ChatHeader
            onClose={() => setIsOpen(false)}
            onReset={handleResetSession}
            isEscalated={isEscalated}
          />

          {/* Escalation Alert Banner */}
          {isEscalated && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                A human representative has been notified and this chat is flagged for priority support.
              </span>
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}

            {isLoading && <TypingIndicator />}

            {errorMessage && (
              <div className="my-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions (if few messages) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-[11px] bg-white hover:bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 shadow-xs transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-lg shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
        aria-label="Toggle Customer Support Chat"
      >
        <span className="sr-only">Toggle Support Chat</span>
        <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />

        {/* Pulse beacon */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
        </span>
      </button>
    </div>
  );
};
