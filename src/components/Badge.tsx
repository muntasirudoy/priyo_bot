import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PROCESSING':
      case 'UPLOADING':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case 'HUMAN_REQUIRED':
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getDot = () => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'ACTIVE':
        return 'bg-emerald-500';
      case 'PROCESSING':
      case 'UPLOADING':
        return 'bg-amber-500';
      case 'HUMAN_REQUIRED':
      case 'FAILED':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDot()}`} />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
