import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { Layers, FileText, Users, ArrowRight } from 'lucide-react';
// Robot chatbot avatar from public/c.webp
import type { ChatPanelRef } from './ChatPanel';

const ChatPanel = lazy(() =>
  import('./ChatPanel').then((module) => ({ default: module.ChatPanel }))
);

export const AssistantLauncher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const launcherButtonRef = useRef<HTMLButtonElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<ChatPanelRef>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Hidden on /assistant page and /admin portal
  const isHiddenPage = location.pathname === '/assistant' || location.pathname.startsWith('/admin');

  const handleOpen = () => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      launcherButtonRef.current?.focus();
    }, 50);
  }, []);

  const handleAction = (type: 'services' | 'insights' | 'handoff') => {
    if (type === 'services') {
      chatRef.current?.sendMessage('What services do you offer?');
    } else if (type === 'insights') {
      chatRef.current?.sendMessage('Show me your case studies and insights');
    } else if (type === 'handoff') {
      chatRef.current?.openHandoff('Direct inquiry from Assistant modal');
    }
  };

  // Trap focus & ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusableElements = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (isHiddenPage) {
    return null;
  }

  return (
    <>
      {/* Floating launcher trigger button: right-docked tab matching old theme switch button */}
      {!isOpen && (
        <aside
          aria-label="AI Assistant Launcher"
          className="fixed right-3 sm:right-5 bottom-24 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-50 select-none animate-in fade-in duration-300"
        >
          <button
            ref={launcherButtonRef}
            type="button"
            onClick={handleOpen}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-label="Open AXIA AI Assistant"
            title="Chat with AXIA Assistant"
            className="group relative w-16 sm:w-20 h-20 sm:h-24 p-0 bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2a675] active:scale-95 transition-all duration-300"
          >
            {/* Pulsing Green Online Indicator Ring */}
            <span className="absolute top-1 right-2 flex h-3 w-3 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white shadow-sm" />
            </span>

            {/* Pure Robot Character Image - No circle, no black box */}
            <img
              src="/c.webp"
              alt="AXIA AI Assistant"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] group-hover:drop-shadow-[0_12px_24px_rgba(194,166,117,0.45)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none select-none"
            />

            {/* Flyout Tooltip on Hover */}
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-200 px-3 py-1.5 rounded-xl bg-[#0b192c]/95 text-white text-[12px] font-medium whitespace-nowrap shadow-xl border border-white/15 flex items-center gap-1.5 backdrop-blur-md">
              <span className="font-semibold text-[#c2a675]">Ask AXIA</span>
              <span className="text-slate-300">· Assistant</span>
            </div>
          </button>
        </aside>
      )}

      {/* Floating Chat Modal Popup (Matching attached two-panel screenshot) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AXIA Assistant Chat"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-7 select-none animate-in fade-in duration-300"
        >
          {/* Blurred Backdrop (Click outside to close) */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Main Two-Panel Card Container */}
          <div
            ref={modalContainerRef}
            className="relative z-10 w-full max-w-[1180px] h-[92vh] max-h-[780px] min-h-[580px] rounded-[32px] shadow-[0_35px_100px_rgba(0,0,0,0.7)] border border-white/20 overflow-hidden flex flex-col lg:flex-row bg-[#070e1b] animate-in zoom-in-95 duration-200"
          >
            {/* Background Office Skyline Photo with Subtle Gradient */}
            <div
              className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url('/assets/chatbot/bg.jpg')` }}
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent backdrop-blur-[0.5px]" />
            </div>

            {/* ================= LEFT PANEL (Matches attached reference exactly) ================= */}
            <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col justify-start p-8 xl:p-10 relative z-10 text-white select-text">
              {/* Stacked AXIA KAIROS Logo */}
              <div className="flex flex-col select-none mb-6">
                <div className="flex items-start">
                  <span className="font-sans font-black text-[27px] xl:text-[29px] tracking-tight text-white leading-none">
                    AXIA
                  </span>
                  
                </div>
                <span className="font-sans font-bold text-[19px] xl:text-[21px] tracking-[0.06em] text-[#afcaea] mt-1 leading-none">
                  KAIROS
                </span>
              </div>

              {/* Eyebrow */}
              <div className="mb-3.5">
                <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#73849e]">
                  YOUR AI ASSISTANT
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-[38px] xl:text-[44px] font-sans font-extrabold tracking-tight leading-[1.08] text-white">
                Ask AXIA.
                <span className="block text-[#96B9EE] mt-0.5">
                  Get clear<br />answers.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-4 text-[14px] xl:text-[14.5px] leading-relaxed text-[#c4d3e8] max-w-[340px] font-normal">
                Your AI assistant to explore our services, expertise, and insights. Get instant
                information or speak to our team for complex needs.
              </p>

              {/* Three Translucent Action Buttons */}
              <div className="space-y-3 mt-7 max-w-[380px]">
                {/* Button 1: Explore our services */}
                <button
                  type="button"
                  onClick={() => handleAction('services')}
                  className="w-full text-left p-3.5 sm:p-4 rounded-[16px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group cursor-pointer backdrop-blur-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB2F2]"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <Layers className="w-6 h-6 text-[#96B9EE] shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <div className="text-[14px] sm:text-[14.5px] font-medium text-white tracking-tight truncate">
                        Explore our services
                      </div>
                      <div className="text-[11.5px] sm:text-[12px] text-[#8296af] truncate font-normal mt-0.5">
                        Get details about our expertise
                      </div>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 group-hover:border-white group-hover:text-white transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </button>

                {/* Button 2: Find relevant insights */}
                <button
                  type="button"
                  onClick={() => handleAction('insights')}
                  className="w-full text-left p-3.5 sm:p-4 rounded-[16px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group cursor-pointer backdrop-blur-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB2F2]"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <FileText className="w-6 h-6 text-[#96B9EE] shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <div className="text-[14px] sm:text-[14.5px] font-medium text-white tracking-tight truncate">
                        Find relevant insights
                      </div>
                      <div className="text-[11.5px] sm:text-[12px] text-[#8296af] truncate font-normal mt-0.5">
                        Discover case studies and thought leadership
                      </div>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 group-hover:border-white group-hover:text-white transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </button>

                {/* Button 3: Connect with our team */}
                <button
                  type="button"
                  onClick={() => handleAction('handoff')}
                  className="w-full text-left p-3.5 sm:p-4 rounded-[16px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group cursor-pointer backdrop-blur-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB2F2]"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <Users className="w-6 h-6 text-[#96B9EE] shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <div className="text-[14px] sm:text-[14.5px] font-medium text-white tracking-tight truncate">
                        Connect with our team
                      </div>
                      <div className="text-[11.5px] sm:text-[12px] text-[#8296af] truncate font-normal mt-0.5">
                        Get in touch for tailored support
                      </div>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 group-hover:border-white group-hover:text-white transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </button>
              </div>
            </div>

            {/* ================= RIGHT PANEL (Floating Inset Chat Card) ================= */}
            <div className="w-full lg:w-[56%] xl:w-[58%] h-full p-2.5 sm:p-4 lg:p-5 flex flex-col relative z-10 overflow-hidden">
              <div className="w-full h-full rounded-[24px] bg-white/95 backdrop-blur-xl shadow-2xl border border-white/40 overflow-hidden flex flex-col">
                <Suspense
                  fallback={
                    <div className="w-full h-full bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-slate-500">
                      <div className="w-8 h-8 rounded-full border-2 border-[#0b192c] border-t-transparent animate-spin mb-3" />
                      <span className="text-xs font-mono">Initializing AXIA Assistant...</span>
                    </div>
                  }
                >
                  <ChatPanel
                    ref={chatRef}
                    onClose={handleClose}
                    isFloating={true}
                    className="rounded-[24px] border-0 shadow-none"
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantLauncher;
