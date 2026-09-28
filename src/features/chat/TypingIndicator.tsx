import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2.5 my-3 animate-message">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0 bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-sm">
        <Bot className="w-3.5 h-3.5" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-xs bg-white text-slate-500 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};
