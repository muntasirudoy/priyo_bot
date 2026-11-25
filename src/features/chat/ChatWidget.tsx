import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../types';
import { chatService } from '../../services/chatService';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { ChatIdentity, EmailGate } from './EmailGate';

interface ChatWidgetProps { embedded?: boolean; siteId?: string; title?: string; greeting?: string; primaryColor?: string; parentOrigin?: string }
function getIdentity(): ChatIdentity | null {
  try { const saved = JSON.parse(localStorage.getItem('chat_user_identity') || 'null'); return saved && typeof saved.email === 'string' && /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(saved.email) ? { email: saved.email, name: typeof saved.name === 'string' ? saved.name : '' } : null; } catch { return null; }
}
function splitReply(text: string): string[] {
  const paragraphs = text.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  const sentences = paragraphs.flatMap((p) => p.match(/[^.!?।]+[.!?।]*\s*/g)?.map((x) => x.trim()).filter(Boolean) || [p]);
  if (sentences.length < 3 && text.length < 180) return [text];
  const chunks: string[] = []; const target = Math.ceil(sentences.length / Math.min(3, Math.ceil(sentences.length / 2)));
  for (let i = 0; i < sentences.length; i += target) chunks.push(sentences.slice(i, i + target).join(' '));
  return chunks.slice(0, 3);
}
export const ChatWidget: React.FC<ChatWidgetProps> = ({ embedded = false, siteId = 'default', title = 'Customer Support', greeting = 'Hi! How can I help you today?', primaryColor = '#dc2626', parentOrigin }) => {
  const [isOpen, setIsOpen] = useState(false); const [identity, setIdentity] = useState<ChatIdentity | null>(getIdentity);
  const [messages, setMessages] = useState<ChatMessage[]>([]); const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('bot'); const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveGreeting, setLiveGreeting] = useState(greeting);
  const messagesEndRef = useRef<HTMLDivElement>(null); const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const getSessionId = () => { let id = sessionStorage.getItem('support_session_id'); if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('support_session_id', id); } return id; };
  const [sessionId, setSessionId] = useState(getSessionId);
  const notifyParent = (type: string, payload: Record<string, unknown> = {}) => { if (embedded && parentOrigin && window.parent !== window) window.parent.postMessage({ source: 'priyo-chat-widget', type, ...payload }, parentOrigin); };
  useEffect(() => { chatService.getGreeting().then((config) => setLiveGreeting(config.greetingMessage)).catch(() => {}); }, []);
  useEffect(() => { if (!identity) return; let active = true; const refresh = async () => { try { const history = await chatService.getSessionHistory(sessionId, identity.email); if (active) { setMessages(history.messages.length ? history.messages : [{ role: 'ASSISTANT', content: liveGreeting }]); setStatus(history.status); } } catch { if (active) setMessages((prev) => prev.length ? prev : [{ role: 'ASSISTANT', content: liveGreeting }]); } }; refresh(); return () => { active = false; }; }, [sessionId, identity?.email, liveGreeting]);
  useEffect(() => { if (!identity || (status !== 'human_requested' && status !== 'agent_active')) return; const timer = setInterval(async () => { try { const history = await chatService.getSessionHistory(sessionId, identity.email); setMessages(history.messages); setStatus(history.status); } catch { /* retry on next poll */ } }, 3000); return () => clearInterval(timer); }, [status, sessionId, identity?.email]);
  useEffect(() => { notifyParent('ready'); }, []);
  useEffect(() => { if (!embedded || !parentOrigin) return; const receive = (event: MessageEvent) => { if (event.origin !== parentOrigin || event.source !== window.parent || event.data?.source !== 'priyo-chat-host') return; if (event.data.type === 'open') setIsOpen(true); if (event.data.type === 'close') setIsOpen(false); if (event.data.type === 'reset-session') reset(); }; window.addEventListener('message', receive); return () => window.removeEventListener('message', receive); }, [embedded, parentOrigin]);
  useEffect(() => { if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading, isOpen]);
  useEffect(() => () => pendingTimers.current.forEach(clearTimeout), []);
  const reset = () => { pendingTimers.current.forEach(clearTimeout); pendingTimers.current = []; sessionStorage.removeItem('support_session_id'); setSessionId(getSessionId()); setStatus('bot'); setMessages([{ role: 'ASSISTANT', content: liveGreeting }]); setErrorMessage(null); notifyParent('reset-session'); };
  const send = async (text: string) => {
    if (!identity || !text.trim() || isLoading) return;
    setErrorMessage(null); setMessages((prev) => [...prev, { role: 'USER', content: text, createdAt: new Date().toISOString() }]); setIsLoading(true);
    try {
      const response = await chatService.sendMessage(sessionId, text, identity, siteId); setStatus(response.status);
      if (response.answer) {
        const chunks = splitReply(response.answer);
        for (const chunk of chunks) {
          await new Promise<void>((resolve) => { const timer = setTimeout(resolve, Math.min(1500, Math.max(700, chunk.length * 12))); pendingTimers.current.push(timer); });
          setMessages((prev) => [...prev, { role: 'ASSISTANT', content: chunk, sources: response.sources, createdAt: new Date().toISOString() }]);
        }
        if (!isOpen) notifyParent('unread-count', { count: chunks.length });
      }
    } catch (err: any) { setErrorMessage(err.response?.data?.message || 'Unable to connect. Please try again.'); } finally { setIsLoading(false); }
  };
  return <div data-embed-root={embedded || undefined} className={`fixed ${embedded ? 'bottom-3 right-3' : 'bottom-6 right-6'} z-50 flex flex-col items-end`}>
    {isOpen && <div className="w-[380px] sm:w-[410px] h-[580px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-100px)] bg-slate-50 rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden mb-4 animate-slide-up">
      <ChatHeader onClose={() => setIsOpen(false)} onReset={reset} isEscalated={status === 'human_requested' || status === 'agent_active'} title={title} />
      {!identity ? <EmailGate onVerified={setIdentity} /> : <>
        {(status === 'human_requested' || status === 'agent_active') && <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-xs text-amber-800"><AlertCircle className="w-4 h-4" />A support person is joining this chat.</div>}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">{messages.map((msg, index) => <MessageBubble key={msg.id || index} message={msg} />)}{isLoading && <TypingIndicator />}{errorMessage && <div role="alert" className="p-3 text-xs text-rose-700">{errorMessage}</div>}<div ref={messagesEndRef} /></div>
        <ChatInput onSend={send} isLoading={isLoading} />
      </>}
    </div>}
    <button onClick={() => { setIsOpen(!isOpen); notifyParent(!isOpen ? 'open' : 'close'); }} style={{ background: primaryColor }} className="flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg" aria-label="Toggle Customer Support Chat"><MessageSquare className="w-6 h-6" /></button>
  </div>;
};
