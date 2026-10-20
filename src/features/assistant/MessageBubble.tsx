import React from 'react';
import { User } from 'lucide-react';
import type { Message } from './types';
import { ServiceCardRow } from './ServiceCardRow';
import { QuickReplies } from './QuickReplies';
import { SourcesRow } from './SourcesRow';
import { HandoffForm } from './HandoffForm';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onSendChip?: (question: string) => void;
  onRefreshChips?: (messageId: string) => Promise<void>;
  onNavigate?: () => void;
}

function formatMessageTime(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  onSendChip,
  onRefreshChips,
  onNavigate,
}) => {
  const isUser = message.role === 'user';
  const timeFormatted = formatMessageTime(message.createdAt);

  if (isUser) {
    const textPart = message.parts.find((p) => p.type === 'text') as { type: 'text'; content: string } | undefined;
    return (
      <div className="flex flex-col items-end my-3 space-y-1">
        <div className="flex items-end gap-2.5 max-w-[85%] sm:max-w-[75%]">
          <div className="px-4 py-2.5 rounded-[18px] bg-[#DCE6F8] text-slate-900 text-sm leading-relaxed shadow-sm break-words text-left">
            {textPart?.content || ''}
          </div>
          {/* User Circular Outlined Avatar */}
          <div className="w-8 h-8 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400 mr-10 select-none">
          {timeFormatted}
        </span>
      </div>
    );
  }

  // Assistant Bubble
  return (
    <div className="flex flex-col items-start my-3 space-y-1">
      <div className="flex items-start gap-2.5 max-w-full sm:max-w-[92%]">
        {/* Assistant Navy "A" Mark Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#0b192c] text-white flex items-center justify-center font-serif font-black text-xs shrink-0 shadow-sm mt-0.5">
          A
        </div>

        <div className="flex-1 min-w-0">
          <div className="px-4 py-3 rounded-[18px] bg-white border border-slate-200/80 text-slate-900 text-sm leading-relaxed shadow-sm text-left">
            {message.parts.map((part, pIdx) => {
              if (part.type === 'text') {
                if (!part.content && isStreaming) {
                  // Three bouncing dots typing indicator
                  return (
                    <div key={pIdx} className="flex items-center gap-1.5 py-1" aria-label="AXIA Assistant is thinking">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                    </div>
                  );
                }
                return (
                  <div key={pIdx} className="whitespace-pre-line break-words">
                    {part.content}
                  </div>
                );
              }

              if (part.type === 'cards') {
                return (
                  <ServiceCardRow
                    key={pIdx}
                    cards={part.items}
                    onCardClick={onNavigate}
                  />
                );
              }

              if (part.type === 'sources') {
                return (
                  <SourcesRow
                    key={pIdx}
                    sources={part.sources}
                    onSourceClick={onNavigate}
                  />
                );
              }

              if (part.type === 'form') {
                return <HandoffForm key={pIdx} data={part.data} />;
              }

              return null;
            })}
          </div>

          {/* Quick Reply Chips attached below the bubble */}
          {message.parts.map((part, pIdx) => {
            if (part.type === 'chips' && onSendChip) {
              return (
                <QuickReplies
                  key={pIdx}
                  questions={part.questions}
                  onSelect={onSendChip}
                  onRefresh={
                    onRefreshChips ? () => onRefreshChips(message.id) : undefined
                  }
                  disabled={isStreaming}
                />
              );
            }
            return null;
          })}

          <span className="text-[10px] font-mono text-slate-400 ml-1 select-none">
            {timeFormatted}
          </span>
        </div>
      </div>
    </div>
  );
};
