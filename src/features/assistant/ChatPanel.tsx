import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  X,
  Paperclip,
  ArrowRight,
  Square,
  ArrowDown,
  Trash2,
  Download,
  Headphones,
  Shield,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { HandoffForm } from './HandoffForm';
import { useChat } from './useChat';

export interface ChatPanelRef {
  sendMessage: (text: string) => void;
  openHandoff: (reason?: string) => void;
}

export interface ChatPanelProps {
  onClose?: () => void;
  isFloating?: boolean;
  className?: string;
}

export const ChatPanel = forwardRef<ChatPanelRef, ChatPanelProps>(
  ({ onClose, isFloating = false, className = '' }, ref) => {
    const navigate = useNavigate();
    const {
      messages,
      isStreaming,
      isOnline,
      sendMessage,
      stopStreaming,
      clearConversation,
      openHandoff,
      refreshChips,
    } = useChat();

    useImperativeHandle(ref, () => ({
      sendMessage,
      openHandoff,
    }));

  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [attachmentNotice, setAttachmentNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;
    setShowScrollBottom(!isAtBottom);
  };

  useEffect(() => {
    if (!showScrollBottom) {
      scrollToBottom();
    }
  }, [messages, isStreaming, showScrollBottom]);

  // Keep focus in input on mount and after sending
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ESC to close floating window & focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSend = () => {
    if (!inputText.trim() || isStreaming) return;
    sendMessage(inputText.trim());
    setInputText('');
    setAttachmentNotice(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  // File upload handling from paperclip
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const validFiles: File[] = [];
    for (const f of selected.slice(0, 3)) {
      if (f.size <= 5 * 1024 * 1024) {
        validFiles.push(f);
      }
    }

    setAttachedFiles(validFiles);
    setAttachmentNotice(
      "Attachments are shared with our team only. Use 'Connect with our team' to send documents."
    );
  };

  const handleOpenHandoffWithFiles = () => {
    openHandoff('Document review & inquiry', attachedFiles);
    setAttachedFiles([]);
    setAttachmentNotice(null);
  };

  // Download transcript (.txt)
  const handleDownloadTranscript = () => {
    setShowMenu(false);
    const transcriptText = messages
      .map((m) => {
        const time = new Date(m.createdAt).toLocaleString();
        const role = m.role === 'user' ? 'You' : 'AXIA Assistant';
        const textParts = m.parts
          .filter((p) => p.type === 'text')
          .map((p) => (p as { type: 'text'; content: string }).content)
          .join(' ');
        return `[${time}] ${role}:\n${textParts}\n`;
      })
      .join('\n');

    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axia-assistant-transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={panelRef}
      className={`w-full h-full flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-3xl overflow-hidden relative text-slate-900 select-none ${className}`}
      role="region"
      aria-label="AXIA Assistant Chat"
    >
      {/* 1. HEADER */}
      <header className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white/80 shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          {/* Circular navy avatar with white "A" mark */}
          <div className="w-9 h-9 rounded-full bg-[#0b192c] border border-slate-200/60 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
            <img src="/c.webp" alt="AXIA Assistant" className="w-full h-full object-cover object-top" />
          </div>
          <div className="text-left">
            <h3 className="font-serif text-sm font-bold tracking-tight text-slate-900 leading-none">
              AXIA Assistant
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-[11px] font-mono text-slate-500">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* "..." Menu button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Chat options menu"
              aria-expanded={showMenu}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-9 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-left text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    clearConversation();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear conversation</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTranscript}
                  className="w-full px-4 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download transcript (.txt)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    openHandoff('Inquiry from options menu');
                  }}
                  className="w-full px-4 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-cyan-700 transition-colors"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Talk to our team</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/privacy-policy');
                  }}
                  className="w-full px-4 py-2 flex items-center gap-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors text-[11px]"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Privacy Policy</span>
                </button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close chat"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MESSAGES CONTAINER */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2 text-left scrollbar-thin scrollbar-thumb-slate-200"
      >
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && idx === messages.length - 1}
            onSendChip={(q) => sendMessage(q)}
            onRefreshChips={(msgId) => refreshChips(msgId)}
            onNavigate={isFloating ? onClose : undefined}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating "Scroll to latest" button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-24 right-6 px-3 py-1.5 rounded-full bg-white/95 border border-slate-300 shadow-md text-xs font-mono text-slate-700 hover:text-cyan-600 flex items-center gap-1.5 z-30 transition-all"
        >
          <span>Latest</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Attachment info notice banner */}
      {attachmentNotice && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="truncate">{attachedFiles.map((f) => f.name).join(', ')}</span>
          </div>
          <button
            type="button"
            onClick={handleOpenHandoffWithFiles}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0b192c] text-white hover:bg-slate-800 shrink-0"
          >
            Attach to Inquiry
          </button>
        </div>
      )}

      {/* Offline State Fallback Banner */}
      {!isOnline && (
        <div className="p-3 bg-amber-50 border-t border-amber-200 text-amber-800 text-xs flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Assistant backend is currently offline. You can still reach our team directly.</span>
          </div>
          <button
            type="button"
            onClick={() => openHandoff('Direct offline inquiry')}
            className="font-semibold underline ml-2 shrink-0 hover:text-amber-950"
          >
            Open Form
          </button>
        </div>
      )}

      {/* 3. INPUT BAR OR OFFLINE HANDOFF FORM */}
      <footer className="p-3.5 sm:p-4 border-t border-slate-200/80 bg-white/90 shrink-0 space-y-2">
        {!isOnline ? (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Assistant is currently offline. You can connect with our advisory team directly below:
              </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto pr-1">
              <HandoffForm
                data={{ reason: 'Direct offline inquiry', preselectedFiles: attachedFiles }}
                onSubmitted={() => {
                  setAttachedFiles([]);
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 bg-slate-50/90 border border-slate-300/80 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-500 transition-all">
              {/* Paperclip Button */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="sr-only"
                aria-label="Attach documents or images"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach file"
                title="Attach file (PDF, DOCX, TXT, PNG/JPG max 5MB)"
                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Pill Text Input */}
              <textarea
                ref={inputRef}
                rows={1}
                maxLength={1000}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                aria-label="Type your question"
                className="flex-1 bg-transparent border-0 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 resize-none py-1.5 max-h-24"
              />

              {/* Send / Stop Button */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  aria-label="Stop generation"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-full bg-[#0b192c] hover:bg-[#1a2f4c] text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Small Muted Disclaimer */}
            <p className="text-[11px] font-mono text-slate-400 text-center select-none">
              AXIA Assistant can make mistakes. Please verify important information.
            </p>
          </>
        )}
      </footer>
    </div>
  );
});

ChatPanel.displayName = 'ChatPanel';
