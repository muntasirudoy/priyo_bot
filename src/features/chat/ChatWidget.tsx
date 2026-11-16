import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../types';
import { chatService } from '../../services/chatService';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';

interface ChatWidgetProps { embedded?: boolean; siteId?: string; title?: string; greeting?: string; primaryColor?: string; parentOrigin?: string; }

export const ChatWidget: React.FC<ChatWidgetProps> = ({ embedded = false, siteId = 'default', title = 'PriyoShop Customer Support', greeting = 'Hello! 👋 Welcome to customer support. How can I assist you today?', primaryColor = '#dc2626', parentOrigin }) => {
  const [isOpen, setIsOpen] = useState(false); const [messages, setMessages] = useState<ChatMessage[]>([]); const [isLoading, setIsLoading] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false); const [errorMessage, setErrorMessage] = useState<string | null>(null); const messagesEndRef = useRef<HTMLDivElement>(null);
  const getSessionId = () => { let id = sessionStorage.getItem('support_session_id'); if (!id) { id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `session_${Date.now()}_${Math.random().toString(36).slice(2)}`; sessionStorage.setItem('support_session_id', id); } return id; };
  const sessionId = getSessionId();
  const notifyParent = (type: string, payload: Record<string, unknown> = {}) => { if (embedded && parentOrigin && window.parent !== window) window.parent.postMessage({ source: 'priyo-chat-widget', type, ...payload }, parentOrigin); };

  useEffect(() => { (async () => { try { const history = await chatService.getSessionHistory(sessionId); setMessages(history.length ? history : [{ role: 'ASSISTANT', content: greeting, createdAt: new Date().toISOString() }]); } catch { setMessages([{ role: 'ASSISTANT', content: greeting, createdAt: new Date().toISOString() }]); } })(); }, [sessionId, greeting]);
  useEffect(() => { notifyParent('ready'); }, []);
  useEffect(() => {
    if (!embedded || !parentOrigin) return;
    const receive = (event: MessageEvent) => {
      if (event.origin !== parentOrigin || event.source !== window.parent || event.data?.source !== 'priyo-chat-host') return;
      if (event.data.type === 'open') setOpen(true);
      if (event.data.type === 'close') setOpen(false);
      if (event.data.type === 'reset-session') handleResetSession();
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [embedded, parentOrigin]);
  useEffect(() => { if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading, isOpen]);

  const setOpen = (open: boolean) => { setIsOpen(open); notifyParent(open ? 'open' : 'close'); };
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return; setErrorMessage(null); setMessages((prev) => [...prev, { role: 'USER', content: text, createdAt: new Date().toISOString() }]); setIsLoading(true);
    try { const response = await chatService.sendMessage(sessionId, text, siteId); if (response.needsHuman) setIsEscalated(true); setMessages((prev) => [...prev, { role: 'ASSISTANT', content: response.answer, sources: response.sources, createdAt: new Date().toISOString() }]); if (!isOpen) notifyParent('unread-count', { count: 1 }); }
    catch (err: any) { setErrorMessage(err.response?.data?.message || 'Unable to connect to support assistant. Please try again.'); } finally { setIsLoading(false); }
  };
  const handleResetSession = () => { sessionStorage.removeItem('support_session_id'); setIsEscalated(false); setErrorMessage(null); setMessages([{ role: 'ASSISTANT', content: greeting, createdAt: new Date().toISOString() }]); notifyParent('reset-session'); };

  return <div data-embed-root={embedded || undefined} className={`fixed ${embedded ? 'bottom-3 right-3' : 'bottom-6 right-6'} z-50 flex flex-col items-end`}>
    {isOpen && <div className="w-[380px] sm:w-[410px] h-[580px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-100px)] bg-slate-50 rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden mb-4 animate-slide-up">
      <ChatHeader onClose={() => setOpen(false)} onReset={handleResetSession} isEscalated={isEscalated} title={title} />
      {isEscalated && <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2 text-xs text-amber-800"><AlertCircle className="w-4 h-4" /><span>A human representative has been notified.</span></div>}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">{messages.map((msg, index) => <MessageBubble key={index} message={msg} />)}{isLoading && <TypingIndicator />}{errorMessage && <div className="my-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex gap-2"><AlertCircle className="w-4 h-4" />{errorMessage}</div>}<div ref={messagesEndRef} /></div>
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>}
    <button onClick={() => setOpen(!isOpen)} style={{ background: `linear-gradient(45deg, ${primaryColor}, ${primaryColor}dd)` }} className="group relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-red-500/30" aria-label="Toggle Customer Support Chat">
      <MessageSquare className="w-6 h-6" /><span className="absolute -top-1 -right-1 flex h-3.5 w-3.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" /></span>
    </button>
  </div>;
};
