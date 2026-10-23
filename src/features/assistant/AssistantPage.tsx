import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, FileText, Users, ArrowRight } from 'lucide-react';
import { ChatPanel, type ChatPanelRef } from './ChatPanel';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const chatRef = useRef<ChatPanelRef>(null);

  const handleAction = (type: 'services' | 'insights' | 'handoff') => {
    if (type === 'services') {
      chatRef.current?.sendMessage('What services do you offer?');
    } else if (type === 'insights') {
      chatRef.current?.sendMessage('Show me your case studies and insights');
    } else if (type === 'handoff') {
      chatRef.current?.openHandoff('Direct inquiry from Assistant page');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-[#070e1b] relative overflow-hidden select-none font-sans">
      {/* Background Graphic & Optional Photo Fallback */}
      {/* TODO: Client to provide background photo at /public/assets/chatbot/bg.jpg */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 filter blur-sm pointer-events-none transition-opacity duration-700"
        style={{
          backgroundImage: "url('/assets/chatbot/bg.jpg')",
          backgroundBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-[#050B14] via-[#0E1B33]/90 to-[#081226] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Ambient Glow Circles */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#8FB2F2]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Two-Panel Card Container */}
      <div className="relative z-10 w-full max-w-[1180px] h-[92vh] max-h-[780px] min-h-[580px] rounded-[32px] shadow-[0_35px_100px_rgba(0,0,0,0.7)] border border-white/20 overflow-hidden flex flex-col lg:flex-row bg-[#070e1b]">
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
          <Link to="/" className="flex flex-col select-none mb-6 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB2F2] rounded-sm inline-block w-fit">
            <div className="flex items-start">
              <span className="font-sans font-black text-[27px] xl:text-[29px] tracking-tight text-white leading-none group-hover:text-blue-200 transition-colors">
                AXIA
              </span>
              
            </div>
            <span className="font-sans font-bold text-[19px] xl:text-[21px] tracking-[0.06em] text-[#afcaea] mt-1 leading-none">
              KAIROS
            </span>
          </Link>

          {/* Eyebrow */}
          <div className="mb-3.5">
            <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#73849e]">
              YOUR AI ASSISTANT
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[38px] xl:text-[44px] font-sans font-extrabold tracking-tight leading-[1.08] text-white">
            Ask AXIA.
            <span className="block text-[#96B9EE] mt-0.5">
              Get clear<br />answers.
            </span>
          </h1>

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
            <ChatPanel
              ref={chatRef}
              isFloating={false}
              onClose={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
              className="rounded-[24px] h-full border-0 shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
