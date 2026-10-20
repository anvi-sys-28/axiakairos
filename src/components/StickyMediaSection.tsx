import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowUpRight, 
  ShieldCheck, 
  Boxes, 
  Globe, 
  Sparkles,
  Ship
} from 'lucide-react';
import defaultPoster from '../assets/video-poster.jpg';

export interface StickyFeatureMetric {
  value: string;
  label: string;
}

export interface StickyFeatureCapability {
  id: string;
  icon: React.ReactNode;
  tag?: string;
  title: string;
  description: string;
}

export interface StickyMediaSectionProps {
  id?: string;
  categoryTag?: string;
  title?: string;
  description?: string;
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
  id = "global-operations",
  categoryTag = "GLOBAL LOGISTICS & COLD-CHAIN INFRASTRUCTURE",
  title = "From Our Own Farms to Global Markets — Fresh Produce, Packed for Export.",
  description = "Bridging agricultural origins with tier-one global distributors. Our integrated cold-chain corridors preserve peak freshness from post-harvest packing through customs pre-clearance to terminal dispatch.",
  videoUrl = "https://cdn.coverr.co/videos/coverr-cargo-ship-arriving-at-port-9268/1080p.mp4",
  posterUrl = defaultPoster,
  badgeText = "SHOWREEL 25/26 ▶",
  fleetTag = "GLOBAL REEFER FLEET · LIVE TELEMETRY",
  marqueeItems = [
    "✦ 100% TRACEABLE SUPPLY CHAIN",
    "✦ DEDICATED REEFER COLD-CHAIN",
    "✦ GLOBALG.A.P. & FDA CERTIFIED",
    "✦ DIRECT-FROM-FARM CONSOLIDATION",
    "✦ AUTOMATED PRE-CLEARANCE CUSTOMS",
    "✦ -0.5°C TO +4°C INTEGRITY",
    "✦ TIER-1 MARITIME BERTHING",
  ],
  metrics = [
    { value: "65+", label: "COUNTRIES SERVED" },
    { value: "14,800+", label: "METRIC TONS / YR" },
    { value: "12+ Yrs", label: "PROVEN RELIABILITY" },
    { value: "99.4%", label: "ON-TIME COLD DISPATCH" },
  ],
  capabilities = [
    {
      id: "cold-chain",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      tag: "PRECISION TELEMETRY",
      title: "Atmospheric & Cold-Chain Telemetry",
      description: "Continuous real-time temperature, ethylene, and humidity telemetry from intake sheds to international destination berths."
    },
    {
      id: "traceability",
      icon: <Globe className="w-5 h-5 text-sky-400" />,
      tag: "COMPLIANCE & AUDIT",
      title: "End-to-End Digital Provenance",
      description: "Digital QR-verified chain-of-custody documentation compliant with EU Phytosanitary, USDA, and GlobalG.A.P. standards."
    },
    {
      id: "consolidation",
      icon: <Boxes className="w-5 h-5 text-amber-400" />,
      tag: "AUTOMATED PROCESSING",
      title: "High-Speed Optical Grading & Packing",
      description: "Six-hour farm-to-pack turnaround featuring optical blemish detection, automated sizing, and modified-atmosphere packaging."
    },
    {
      id: "multimodal",
      icon: <Ship className="w-5 h-5 text-indigo-400" />,
      tag: "PRIORITY LOGISTICS",
      title: "Guaranteed Berthing & Multimodal Express",
      description: "Pre-allocated reefer slots on priority sea routes and expedited charter air-bridges for sensitive seasonal harvests."
    }
  ],
  ctaHeadline = "Ready to scale your global agricultural export route?",
  ctaSubtext = "Consult directly with our logistics architecture team to design an expedited corridor for your produce.",
  ctaButtonText = "Get a Quote",
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

  // Control playback based on intersection visibility
  useEffect(() => {
    if (!videoRef.current) return;

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

  return (
    <section
      id={id}
      aria-label="Sticky media features"
      className={`w-full bg-[#05080e] text-white py-16 sm:py-20 lg:py-24 border-t border-white/10 relative z-10 ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* 12-Column CSS Grid - columns stretch to full height so sticky tracks across entire right-side scroll */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 relative">
          
          {/* ========================================================
              LEFT COLUMN (lg:col-span-7): Stretches to full section height
              ======================================================== */}
          <div className="lg:col-span-7 relative">
            {/* Sticky Wrapper: Pins at top-24 while right column scrolls */}
            <div className="lg:sticky lg:top-24 z-20">
              <div
                ref={mediaContainerRef}
                className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#080d16] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group transition-all duration-300 hover:border-white/20 h-[360px] sm:h-[440px] lg:h-[clamp(420px,calc(100vh-140px),550px)]"
              >
              {/* HTML5 Video Player with Lazy Streaming & Poster Fallback */}
              <video
                ref={videoRef}
                poster={posterUrl}
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
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-black/30"
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
                  <span className="text-white/90 font-medium">{badgeText}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </button>
              </div>

              {/* Bottom Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-30 flex items-center justify-between pointer-events-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                
                {/* Left side: Fleet / Brand Tag with Icon */}
                <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/85 text-[11px] sm:text-[12px] font-mono tracking-wider uppercase select-none">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
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
            <div className="flex flex-col justify-between min-h-[360px] sm:min-h-[440px] lg:h-[clamp(420px,calc(100vh-140px),550px)] pt-2 pb-1">
              
              <div className="flex flex-col space-y-4">
                {/* Uppercase Mono Sub-header / Label */}
                <div className="font-mono text-slate-400 tracking-[0.2em] text-[11px] sm:text-[12px] uppercase select-none flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-axia-slate inline-block" />
                  <span>{categoryTag}</span>
                </div>

                {/* Editorial Headline */}
                <h2 className="text-2xl sm:text-3xl xl:text-[34px] font-bold text-white tracking-tight leading-[1.18]">
                  {title}
                </h2>

                {/* Descriptive Paragraph */}
                <p className="text-slate-400 text-[14.5px] sm:text-[15.5px] leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Infinite Monochromatic Marquee / Ticker */}
              <div className="mt-6 pt-4 border-t border-white/10 group select-none overflow-hidden relative">
                {/* Left/Right Subtle Gradient Mask for Marquee */}
                <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#05080e] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#05080e] to-transparent z-10 pointer-events-none" />

                <div className="animate-ticker-left flex items-center space-x-6 text-[11px] sm:text-[12px] font-mono tracking-[0.16em] uppercase text-slate-400 whitespace-nowrap">
                  {/* First set */}
                  {marqueeItems.map((item, idx) => (
                    <span key={`ticker-1-${idx}`} className="hover:text-white transition-colors cursor-default">
                      {item}
                    </span>
                  ))}
                  {/* Duplicated set for seamless loop */}
                  {marqueeItems.map((item, idx) => (
                    <span key={`ticker-2-${idx}`} className="hover:text-white transition-colors cursor-default" aria-hidden="true">
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
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-y border-white/10 py-5 text-center bg-white/[0.02] rounded-xl">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="px-3 sm:px-4 py-2 flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {metric.value}
                    </div>
                    <div className="font-mono text-slate-400 tracking-[0.2em] text-[10px] sm:text-[11px] uppercase mt-1">
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
              <div className="font-mono text-slate-400 tracking-[0.2em] text-[11px] uppercase select-none mb-1">
                CORE OPERATIONAL CAPABILITIES
              </div>

              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : index * 0.08 }}
                  className="rounded-2xl p-5 sm:p-6 bg-[#0a0d14] border border-white/10 hover:border-white/30 transition-all duration-300 shadow-md hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon Badge */}
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:scale-105 transition-all duration-300 shrink-0">
                      {capability.icon}
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      {capability.tag && (
                        <span className="font-mono text-[10.5px] tracking-[0.18em] text-slate-400 uppercase">
                          {capability.tag}
                        </span>
                      )}
                      <h3 className="text-[17px] sm:text-[18px] font-semibold text-white tracking-tight leading-snug group-hover:text-white transition-colors">
                        {capability.title}
                      </h3>
                      <p className="text-slate-400 text-[13.5px] sm:text-[14px] leading-relaxed">
                        {capability.description}
                      </p>
                    </div>
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
              className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
            >
              <div className="flex flex-col space-y-1.5 max-w-[340px]">
                <h4 className="text-[18px] sm:text-[19px] font-bold text-white tracking-tight leading-snug">
                  {ctaHeadline}
                </h4>
                <p className="text-slate-400 text-[13px] sm:text-[13.5px] leading-relaxed">
                  {ctaSubtext}
                </p>
              </div>

              {/* High-Contrast Action Button with ArrowUpRight */}
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex items-center space-x-2.5 px-5 sm:px-6 py-3 rounded-full bg-white text-[#05080e] font-semibold text-[14px] tracking-wide hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] active:scale-95 transition-all duration-200 shrink-0 select-none group/btn"
              >
                <span>{ctaButtonText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};
