import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

interface QuickRepliesProps {
  questions: string[];
  onSelect: (question: string) => void;
  onRefresh?: () => Promise<void>;
  disabled?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  questions,
  onSelect,
  onRefresh,
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    if (!onRefresh || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 pt-1" role="group" aria-label="Quick reply suggestions">
      {questions.map((q, idx) => (
        <button
          key={`${q}-${idx}`}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-slate-300/80 bg-white hover:bg-slate-50 hover:border-cyan-500/60 text-slate-800 shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-left"
        >
          {q}
        </button>
      ))}

      {onRefresh && (
        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={disabled || isRefreshing}
          aria-label="Refresh suggestion questions"
          title="Show different questions"
          className="w-7 h-7 rounded-full border border-slate-300/80 bg-white hover:bg-slate-50 hover:border-cyan-500/60 text-slate-600 flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-600' : ''}`} />
        </button>
      )}
    </div>
  );
};
