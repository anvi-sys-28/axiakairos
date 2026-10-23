"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export interface ElasticReelItem {
  id: string;
  title: string;
  tag: string;
  image: string;
  fallbackImage?: string;
  icon: React.ReactNode;
  shortDescription?: string;
  metric?: string;
  metricLabel?: string;
}

export interface ElasticReelProps {
  items: ElasticReelItem[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
}

export function ElasticReel({
  items,
  activeIndex,
  onActiveChange,
  autoplay = true,
  autoplayInterval = 5000,
  className = "",
}: ElasticReelProps) {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSliceRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the reel so the active slice stays in visible range
  useEffect(() => {
    if (activeSliceRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeSliceRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (
        elementRect.left < containerRect.left ||
        elementRect.right > containerRect.right
      ) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  // Autoplay ticker with pause on hover
  useEffect(() => {
    if (!autoplay || isPaused) return;

    const timer = setInterval(() => {
      onActiveChange((activeIndex + 1) % items.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, isPaused, activeIndex, items.length, autoplayInterval, onActiveChange]);

  const handlePrev = useCallback(() => {
    onActiveChange((activeIndex - 1 + items.length) % items.length);
  }, [activeIndex, items.length, onActiveChange]);

  const handleNext = useCallback(() => {
    onActiveChange((activeIndex + 1) % items.length);
  }, [activeIndex, items.length, onActiveChange]);

  return (
    <div
      className={`relative w-full select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Industries Elastic Reel Showcase"
    >
      {/* Dock Container */}
      <div
        ref={containerRef}
        className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-3 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={item.id}
              ref={isActive ? activeSliceRef : undefined}
              onClick={() => onActiveChange(index)}
              layout
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 28,
                mass: 0.8,
              }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group shrink-0 transition-shadow duration-300 ${
                isActive
                  ? "w-[300px] sm:w-[380px] md:w-[420px] lg:w-[440px] xl:w-[460px] h-[460px] sm:h-[500px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-[#c2a675]/40"
                  : "w-[64px] sm:w-[72px] lg:w-[80px] h-[460px] sm:h-[500px] hover:w-[76px] sm:hover:w-[86px] lg:hover:w-[96px] bg-[#0c1421] ring-1 ring-white/10 hover:ring-white/25"
              }`}
            >
              {/* Photo Background */}
              <motion.img
                src={item.image}
                alt={item.title}
                width={460}
                height={500}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  if (item.fallbackImage) {
                    (e.target as HTMLImageElement).src = item.fallbackImage;
                  }
                }}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                  isActive
                    ? "scale-105 group-hover:scale-110"
                    : "scale-100 opacity-60 group-hover:opacity-85"
                }`}
              />

              {/* Gradient Shading & Vignettes */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive
                    ? "bg-gradient-to-t from-black/95 via-black/40 to-black/20"
                    : "bg-black/60 group-hover:bg-black/40"
                }`}
              />

              {/* Active Slice Content Overlay */}
              <AnimatePresence>
                {isActive ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between z-10"
                  >
                    {/* Top Row: Category Pill & Pulse */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#c2a675]/40 text-[#c2a675] font-mono text-[11px] sm:text-[12px] tracking-wider uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{item.tag}</span>
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                    </div>

                    {/* Bottom Content: Title & Summary */}
                    <div className="space-y-2.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
                          {item.icon}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                          {item.title}
                        </h3>
                      </div>

                      {item.shortDescription && (
                        <p className="text-slate-300 text-[13px] sm:text-[13.5px] line-clamp-2 leading-relaxed">
                          {item.shortDescription}
                        </p>
                      )}

                      {/* Animated Autoplay Countdown Progress Line */}
                      {autoplay && !isPaused && (
                        <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden mt-3">
                          <motion.div
                            key={`progress-${item.id}-${activeIndex}`}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: autoplayInterval / 1000,
                              ease: "linear",
                            }}
                            className="h-full bg-gradient-to-r from-[#c2a675] to-[#f4d48a]"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* Inactive Slice Vertical State */
                  <div className="absolute inset-0 py-6 flex flex-col items-center justify-between z-10 pointer-events-none">
                    {/* Top Slice Icon */}
                    <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:scale-110 transition-all">
                      {item.icon}
                    </div>

                    {/* Vertical Monospaced Industry Title */}
                    <div
                      className="font-mono text-[12px] tracking-[0.2em] text-slate-400 group-hover:text-white uppercase whitespace-nowrap transition-colors"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {item.title}
                    </div>

                    {/* Bottom Step Indicator */}
                    <span className="font-mono text-[11px] text-slate-400 group-hover:text-[#c2a675] transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Dock Controls Bar */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="font-mono text-[12px] text-slate-400 tracking-wider">
          <span className="text-white font-bold">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>{" "}
          / {String(items.length).padStart(2, "0")} DOMAINS
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous industry"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next industry"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ElasticReel;
