import React from 'react';
import { X, RotateCcw, Bot } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
  statusText?: string;
  isEscalated?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  onReset,
  statusText = 'Priyo AI',
  isEscalated = false,
}) => {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden bg-white backdrop-blur-md border border-white/20">
          {/* <Bot className="w-5 h-5 text-white" /> */}
          <img src="/icon.png" alt="Bot" className="w-full h-full text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-red-500 rounded-full" />
        </div>
        <div>
          <h2 className="text-sm font-semibold leading-tight tracking-wide">PriyoShop Customer Support</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isEscalated ? 'bg-amber-300 animate-ping' : 'bg-emerald-300'
              }`}
            />
            <span className="text-[11px] text-brand-100 font-medium">
              {isEscalated ? 'Human Representative Alerted' : statusText}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-white/80">
        <button
          onClick={onReset}
          title="Restart Conversation"
          className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          title="Close Chat"
          className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
