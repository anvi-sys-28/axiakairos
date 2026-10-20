import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { SourceItem } from './types';

interface SourcesRowProps {
  sources: SourceItem[];
  onSourceClick?: () => void;
}

export const SourcesRow: React.FC<SourcesRowProps> = ({ sources, onSourceClick }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mr-1 select-none">
        Sources:
      </span>
      {sources.map((s, idx) => (
        <Link
          key={`${s.url}-${idx}`}
          to={s.url}
          onClick={onSourceClick}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-cyan-700 transition-colors"
        >
          <span className="truncate max-w-[160px] sm:max-w-[200px]">{s.title}</span>
          <ExternalLink className="w-2.5 h-2.5 text-slate-400 shrink-0" />
        </Link>
      ))}
    </div>
  );
};
