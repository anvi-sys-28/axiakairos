import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowUpRight
} from 'lucide-react';
import defaultPoster from '../assets/hero.webp';
import { DiamondBackdrop } from './ui/diamond-backdrop';

export interface StickyFeatureMetric {
  value: string;
  label: string;
}

export interface StickyFeatureCapability {
  id: string;
  icon?: React.ReactNode;
  tag?: string;
  title: string;
  description: string;
}

export interface StickyMediaSectionProps {
  id?: string;
  categoryTag?: string;
  title?: string;
  description?: string;
  descriptionSecondary?: string;
  videoUrl?: string;
  posterUrl?: string;
  badgeText?: string;
  fleetTag?: string;
  marqueeItems?: string[];
  metrics?: StickyFeatureMetric[];
  capabilities?: StickyFeatureCapability[];
  ctaHeadline?: string;
  ctaSubtext?: string;
  ctaButtonText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const StickyMediaSection: React.FC<StickyMediaSectionProps> = ({
  id = "about-axia",
  categoryTag = "About Axia Kairos",
  title = "Global IT Transformation Partner",
  description = "Axia Kairos is a global management consulting firm helping organizations achieve enterprise modernization through SAP, cloud, data transformation, and more.",
  descriptionSecondary = "With expertise across industries and markets, we simplify complexity, enhance performance, and deliver measurable outcomes, enabling clients to move from transformation vision to execution seamlessly.",
  videoUrl = "https://cdn.coverr.co/videos/coverr-cargo-ship-arriving-at-port-9268/1080p.mp4",
  posterUrl = "/assets/card_sunset.webp",
  badgeText = "ABOUT AXIA KAIROS",
  fleetTag = "ENTERPRISE TRANSFORMATION · GLOBAL ADVISORY",
  marqueeItems = [
    "SAP S/4HANA MIGRATION & ADVISORY",
    "CLOUD PLATFORM MODERNIZATION",
    "ENTERPRISE AI & AUTOMATION",
    "DATA ENGINEERING & ANALYTICS",
    "CYBER SECURITY & GOVERNANCE",
    "24/7 MANAGED IT SERVICES",
    "STRATEGIC MANAGEMENT CONSULTING",
  ],
  metrics = [
    { value: "15+", label: "YEARS EXCELLENCE" },
    { value: "250+", label: "ENTERPRISE CLIENTS" },
    { value: "99.8%", label: "DELIVERY SUCCESS" },
    { value: "40+", label: "GLOBAL MARKETS" },
  ],
  capabilities = [
    {
      id: "sap-cloud",
      tag: "ENTERPRISE ERP & CLOUD",
      title: "SAP S/4HANA & Cloud Modernization",
      description: "End-to-end advisory, migration, and implementation accelerating legacy transition to modern hyperscaler and SAP BTP environments."
    },
    {
      id: "ai-automation",
      tag: "INTELLIGENT WORKFLOWS",
      title: "Enterprise AI & Business Automation",
      description: "Deploying secure enterprise agentic workflows, conversational intelligence, and automated decision orchestration across operations."
    },
    {
      id: "data-analytics",
      tag: "DECISION ARCHITECTURE",
      title: "Data Engineering & Real-Time Analytics",
      description: "Unified modern data platforms, governance frameworks, and executive intelligence dashboards driving predictive business agility."
    },
    {
      id: "cyber-security",
      tag: "RESILIENCE & GOVERNANCE",
      title: "Cyber Security & Managed IT Services",
      description: "Proactive 24/7 infrastructure monitoring, zero-trust architectures, and SOC oversight keeping enterprise systems resilient."
    }
  ],
  ctaHeadline = "Ready to move from transformation vision to execution?",
  ctaSubtext = "Consult directly with our enterprise leadership to evaluate your architecture and accelerate your technology roadmap.",
  ctaButtonText = "About Us",
  onCtaClick,
  className = ""
}) => {
  const shouldReduceMotion = useReducedMotion();
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Performance Optimization: IntersectionObserver with 350px rootMargin
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        rootMargin: '350px 0px',
        threshold: 0.1
      }
    );

    const currentElem = mediaContainerRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
      observer.disconnect();
    };
  }, []);

  // Control playback based on intersection visibility (no autoplay on mobile)
  useEffect(() => {
    if (!videoRef.current) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      setIsPlaying(false);
      return;
    }

    if (inView) {
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browser autoplay policy might block unmuted play
            setIsPlaying(false);
          });
        }
      }
    } else {
      videoRef.current.pause();
    }
  }, [inView, isPlaying]);

  // Handle Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  // Handle Mute / Unmute Toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick();
    }
  };

  return (
    <section
      id={id}
      aria-label="About Axia Kairos"
      className={`w-full bg-slate-50 dark:bg-[#05080e] text-[#0b192c] dark:text-white py-16 sm:py-20 lg:py-24 border-t border-slate-200 dark:border-white/10 relative z-10 transition-colors duration-300 ${className}`}
    >
      {/* Reusable decorative diamond backdrop matching site theme tokens */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <DiamondBackdrop variant="about" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        
        {/* 12-Column CSS Grid - columns stretch to full height so sticky tracks across entire right-side scroll */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 relative items-start">
          
          {/* ========================================================
              LEFT COLUMN (lg:col-span-7): Fixed / Sticky while right scrolls
              ======================================================== */}
          <div className="lg:col-span-7 relative self-stretch">
            {/* Sticky Wrapper: Pins at top-24 while right column scrolls */}
            <div className="lg:sticky lg:top-24 z-20">
              <div
                ref={mediaContainerRef}
                className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-[#080d16] shadow-xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 h-[360px] sm:h-[440px] lg:h-[clamp(420px,calc(100vh-140px),550px)]"
              >
                {/* HTML5 Video Player with Lazy Streaming & Poster Fallback */}
                <video
                  ref={videoRef}
                  poster={posterUrl || defaultPoster}
                  muted={isMuted}
                  loop
                  playsInline
                  preload="none"
                  onLoadedData={() => setVideoLoaded(true)}
                  onError={() => setVideoError(true)}
                  className={`w-full h-full object-cover transition-opacity duration-700 ${
                    videoLoaded && !videoError ? 'opacity-100' : 'opacity-95'
                  }`}
                >
                  {inView && !videoError && (
                    <source src={videoUrl} type="video/mp4" />
                  )}
                  Your browser does not support the video tag.
                </video>

                {/* Cinematic Vignette & Ambient Gradient Overlays */}
                <div 
                  className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/25 to-black/30"
                  aria-hidden="true" 
                />
                <div 
                  className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-50"
                  aria-hidden="true" 
                />

                {/* Floating Showreel Badge: Positioned at top-[52%] right-6 -translate-y-1/2 */}
                <div className="absolute top-[52%] right-6 -translate-y-1/2 z-30 select-none">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Play showreel highlight"
                    className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] sm:text-[12px] tracking-wider uppercase shadow-xl hover:bg-black/90 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200 group/badge"
                  >
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                    <span className="text-white/90 font-medium">{badgeText}</span>
                  </button>
                </div>

                {/* Bottom Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-30 flex items-center justify-between pointer-events-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  
                  {/* Left side: Fleet / Brand Tag with Clean Dot Indicator */}
                  <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/85 text-[11px] sm:text-[12px] font-mono tracking-wider uppercase select-none">
                    <span className="w-2 h-2 rounded-full bg-[#c2a675] shrink-0" />
                    <span className="truncate max-w-[190px] sm:max-w-none">{fleetTag}</span>
                  </div>

                  {/* Right side: Frosted Round Buttons for Play/Pause and Mute/Unmute */}
                  <div className="flex items-center space-x-2 sm:space-x-2.5">
                    {/* Play / Pause Button */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/85 hover:border-white/40 active:scale-90 transition-all duration-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-white/80" aria-hidden="true" />
                      ) : (
                        <Play className="w-4 h-4 fill-white/80 ml-0.5" aria-hidden="true" />
                      )}
                    </button>

                    {/* Mute / Unmute Button */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/85 hover:border-white/40 active:scale-90 transition-all duration-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white/90" aria-hidden="true" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white/90" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN (lg:col-span-5): Scrolling Content
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col space-y-12 sm:space-y-16">
            
            {/* ----------------------------------------------------
                BLOCK 1: Initial Viewport Lockup (Matches Height of Left Video)
                ---------------------------------------------------- */}
            <div className="flex flex-col justify-between min-h-[360px] sm:min-h-[440px] lg:h-[clamp(420px,calc(100vh-140px),550px)] pt-1 pb-1">
              
              <div className="flex flex-col space-y-4">
                {/* Uppercase Category / Eyebrow Tag */}
                <div className="font-medium text-[#c2a675] tracking-[0.16em] text-[12px] sm:text-[13px] select-none flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#c2a675] inline-block shadow-[0_0_8px_rgba(194,166,117,0.7)]" />
                  <span>{categoryTag}</span>
                </div>

                {/* Editorial Headline */}
                <h2 className="text-3xl sm:text-4xl xl:text-[40px] font-bold text-[#0b192c] dark:text-white tracking-tight leading-[1.12]">
                  {title}
                </h2>

                {/* Descriptive Paragraphs directly matching user reference */}
                <div className="space-y-3.5 pt-1">
                  <p className="text-slate-600 dark:text-slate-300 text-[14.5px] sm:text-[15.5px] leading-relaxed">
                    {description}
                  </p>
                  {descriptionSecondary && (
                    <p className="text-slate-500 dark:text-slate-400 text-[14px] sm:text-[14.5px] leading-relaxed">
                      {descriptionSecondary}
                    </p>
                  )}
                </div>

                {/* Golden About Us Pill Button matching attached image */}
                <div className="pt-2">
                  <Link
                    to="/about"
                    onClick={handleButtonClick}
                    className="inline-flex items-center justify-center px-8 py-2.5 rounded-full bg-gradient-to-r from-[#fae092] via-[#e5b955] to-[#c29637] text-[#05080e] font-semibold text-[14px] shadow-[0_4px_22px_rgba(229,185,85,0.38)] hover:shadow-[0_4px_30px_rgba(229,185,85,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 select-none cursor-pointer"
                  >
                    {ctaButtonText}
                  </Link>
                </div>
              </div>

              {/* Infinite Monochromatic Marquee / Ticker */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 group select-none overflow-hidden relative">
                {/* Left/Right Subtle Gradient Mask for Marquee */}
                <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-slate-50 dark:from-[#05080e] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-slate-50 dark:from-[#05080e] to-transparent z-10 pointer-events-none" />

                <div className="animate-ticker-left flex items-center space-x-6 text-[11px] sm:text-[12px] font-mono tracking-[0.16em] uppercase text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {/* First set */}
                  {marqueeItems.map((item, idx) => (
                    <span key={`ticker-1-${idx}`} className="hover:text-[#0b192c] dark:hover:text-white transition-colors cursor-default">
                      {item}
                    </span>
                  ))}
                  {/* Duplicated set for seamless loop */}
                  {marqueeItems.map((item, idx) => (
                    <span key={`ticker-2-${idx}`} className="hover:text-[#0b192c] dark:hover:text-white transition-colors cursor-default" aria-hidden="true">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                BLOCK 2: Scrolling Section 1: KPI / Metrics Grid
                ---------------------------------------------------- */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200 dark:divide-white/10 border-y border-slate-200 dark:border-white/10 py-5 text-center bg-white dark:bg-[#0c1421] shadow-sm dark:shadow-none rounded-xl">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="px-3 sm:px-4 py-2 flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0b192c] dark:text-white tracking-tight">
                      {metric.value}
                    </div>
                    <div className="font-mono text-slate-500 dark:text-slate-400 tracking-[0.2em] text-[10px] sm:text-[11px] uppercase mt-1">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ----------------------------------------------------
                BLOCK 3: Scrolling Section 2: Core Capability / Feature Cards
                ---------------------------------------------------- */}
            <div className="flex flex-col space-y-4">
              <div className="font-mono text-[#c2a675] tracking-[0.2em] text-[11px] uppercase select-none mb-1 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c2a675]" />
                <span>CORE ENTERPRISE CAPABILITIES</span>
              </div>

              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : index * 0.08 }}
                  className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#0a0d14] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-md dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      {capability.tag && (
                        <span className="font-mono text-[10.5px] tracking-[0.18em] text-[#c2a675] uppercase font-medium">
                          {capability.tag}
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-semibold select-none">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#0b192c] dark:text-white tracking-tight leading-snug group-hover:text-[#c2a675] dark:group-hover:text-white transition-colors">
                      {capability.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-[13.5px] sm:text-[14px] leading-relaxed">
                      {capability.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ----------------------------------------------------
                BLOCK 4: Scrolling Section 3: Call-to-Action Bar
                ---------------------------------------------------- */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#0c1421] border border-slate-200 dark:border-white/15 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
            >
              <div className="flex flex-col space-y-1.5 max-w-[340px]">
                <h4 className="text-[18px] sm:text-[19px] font-bold text-[#0b192c] dark:text-white tracking-tight leading-snug">
                  {ctaHeadline}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-[13px] sm:text-[13.5px] leading-relaxed">
                  {ctaSubtext}
                </p>
              </div>

              {/* High-Contrast Action Button with ArrowUpRight */}
              <Link
                to="/about"
                onClick={handleButtonClick}
                className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#fae092] via-[#e5b955] to-[#c29637] text-[#05080e] font-semibold text-[14px] tracking-wide shadow-[0_4px_22px_rgba(229,185,85,0.38)] hover:shadow-[0_4px_30px_rgba(229,185,85,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shrink-0 select-none group/btn cursor-pointer"
              >
                <span>{ctaButtonText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};
