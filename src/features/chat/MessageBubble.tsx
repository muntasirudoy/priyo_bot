import React from 'react';
import { ChatMessage } from '../../types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'USER';

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex items-end gap-2.5 my-3 animate-message ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 text-xs shadow-sm ${
          isUser
            ? 'bg-slate-700 text-white'
            : 'bg-gradient-to-tr from-red-600 to-red-500 text-white'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed break-words shadow-sm ${
            isUser
              ? 'bg-red-600 text-white rounded-br-xs'
              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Sources Section */}
          {/* {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
                Sources
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.sources.map((src, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    <FileText className="w-3 h-3 text-brand-600" />
                    <span className="truncate max-w-[130px]">{src.documentName}</span>
                    <span className="text-slate-400">· p.{src.pageNumber}</span>
                  </span>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* Timestamp */}
        {message.createdAt && (
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
};
