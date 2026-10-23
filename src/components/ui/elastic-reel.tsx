"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";

export interface ElasticReelItem {
  id: string;
  title: string;
  tag: string;
  image: string;
  fallbackImage?: string;
  icon?: React.ReactNode;
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
  const [manualPause, setManualPause] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Auto-scroll the container so the active slice is smoothly brought into full view
  // Positioned with comfortable padding so NO box or text is EVER cut off on the left!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const frameId = requestAnimationFrame(() => {
      if (typeof window === "undefined") return;

      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;
      const inactiveWidth = isMobile ? 56 : (isTablet ? 68 : 74);
      const gap = isMobile ? 10 : 14;
      const sliceStep = inactiveWidth + gap;

      // Position the active slice cleanly at the start with full padding
      const targetScroll = activeIndex * sliceStep;

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [activeIndex]);

  // Autoplay ticker (pauses on hover or manual pause)
  useEffect(() => {
    if (!autoplay || isPaused || manualPause) return;

    const timer = setInterval(() => {
      onActiveChange((activeIndex + 1) % items.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, isPaused, manualPause, activeIndex, items.length, autoplayInterval, onActiveChange]);

  const handlePrev = useCallback(() => {
    onActiveChange((activeIndex - 1 + items.length) % items.length);
  }, [activeIndex, items.length, onActiveChange]);

  const handleNext = useCallback(() => {
    onActiveChange((activeIndex + 1) % items.length);
  }, [activeIndex, items.length, onActiveChange]);

  const toggleManualPause = useCallback(() => {
    setManualPause((prev) => !prev);
  }, []);

  // Map vertical mouse wheel to horizontal dock scrolling
  const handleWheel = (e: React.WheelEvent) => {
    const container = containerRef.current;
    if (container && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      container.scrollLeft += e.deltaY * 0.8;
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - container.offsetLeft);
    setScrollStart(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    containerRef.current.scrollLeft = scrollStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Hover expansion handler
  const handleSliceHover = (index: number) => {
    if (index !== activeIndex && !isDragging) {
      onActiveChange(index);
    }
  };

  return (
    <div
      className={`relative w-full select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsDragging(false);
      }}
      role="region"
      aria-label="Industries Elastic Reel Showcase"
    >
      {/* Dock Container */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-3.5 px-4 sm:px-6 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={item.id}
              ref={(el) => (sliceRefs.current[index] = el)}
              onClick={() => {
                if (!hasDragged) {
                  onActiveChange(index);
                }
              }}
              onMouseEnter={() => handleSliceHover(index)}
              layout
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 26,
                mass: 0.85,
              }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group shrink-0 transition-all duration-300 ${
                isActive
                  ? "w-[290px] sm:w-[360px] md:w-[400px] lg:w-[420px] xl:w-[450px] h-[460px] sm:h-[490px] lg:h-[510px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-2 ring-[#c2a675] z-10"
                  : "w-[56px] sm:w-[68px] lg:w-[74px] h-[460px] sm:h-[490px] lg:h-[510px] hover:w-[72px] sm:hover:w-[84px] lg:hover:w-[92px] bg-[#0c1421] ring-1 ring-white/10 hover:ring-white/30"
              }`}
            >
              {/* Photo Background */}
              <img
                src={item.image}
                alt={item.title}
                width={450}
                height={510}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  if (item.fallbackImage) {
                    (e.target as HTMLImageElement).src = item.fallbackImage;
                  }
                }}
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ${
                  isActive
                    ? "scale-105 group-hover:scale-110"
                    : "scale-100 opacity-60 group-hover:opacity-85"
                }`}
              />

              {/* Gradient Shading & Vignette Overlays */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                  isActive
                    ? "bg-gradient-to-t from-black/95 via-black/45 to-black/25"
                    : "bg-black/65 group-hover:bg-black/45"
                }`}
              />

              {/* Active Slice Content Overlay */}
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.div
                    key={`active-content-${item.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between z-10 pointer-events-none"
                  >
                    {/* Top Row: Category Pill & Active Status Pulse */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#c2a675]/50 text-[#c2a675] font-mono text-[11px] sm:text-[12px] tracking-wider uppercase shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c2a675] inline-block shadow-[0_0_6px_#c2a675]" />
                        <span>{item.tag}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                        <span className="text-[10px] font-mono tracking-wider text-emerald-300 uppercase">
                          ACTIVE
                        </span>
                      </div>
                    </div>

                    {/* Bottom Content: Title & Summary */}
                    <div className="space-y-2.5">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
                        {item.title}
                      </h3>

                      {item.shortDescription && (
                        <p className="text-slate-200 text-[13px] sm:text-[13.5px] line-clamp-2 leading-relaxed drop-shadow-sm">
                          {item.shortDescription}
                        </p>
                      )}

                      {/* Animated Autoplay Countdown Progress Line */}
                      {autoplay && !isPaused && !manualPause && (
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-3">
                          <motion.div
                            key={`progress-${item.id}-${activeIndex}`}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: autoplayInterval / 1000,
                              ease: "linear",
                            }}
                            className="h-full bg-gradient-to-r from-[#c2a675] to-[#fae092]"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* Inactive Slice Vertical State */
                  <div className="absolute inset-0 py-6 flex flex-col items-center justify-between z-10 pointer-events-none">
                    {/* Top Step Indicator */}
                    <span className="font-mono text-[11px] font-bold tracking-widest text-[#c2a675] opacity-80 group-hover:opacity-100 transition-opacity">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Vertical Category Tag (Fits cleanly within 500px height without clipping) */}
                    <div
                      className="font-mono text-[11px] tracking-[0.18em] text-slate-300 group-hover:text-white uppercase whitespace-nowrap transition-colors"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {item.tag || item.title}
                    </div>

                    {/* Bottom Accent Dot */}
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-[#c2a675] transition-colors" />
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Dock Controls Bar */}
      <div className="flex items-center justify-between mt-4 px-2 select-none">
        <div className="flex items-center space-x-3 font-mono text-[12px] text-slate-500 dark:text-slate-400 tracking-wider">
          <span>
            <span className="text-[#0b192c] dark:text-white font-bold text-sm">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(items.length).padStart(2, "0")} DOMAINS
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            {isPaused || manualPause ? "PAUSED ON HOVER" : "AUTOPLAYING"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={toggleManualPause}
            aria-label={manualPause ? "Resume autoplay" : "Pause autoplay"}
            title={manualPause ? "Resume autoplay" : "Pause autoplay"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/80 dark:bg-[#0c1421] hover:bg-slate-300 dark:hover:bg-white/15 border border-slate-300 dark:border-white/15 flex items-center justify-center text-slate-700 dark:text-white active:scale-90 transition-all cursor-pointer shadow-sm"
          >
            {manualPause ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Previous Slice Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous industry"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/80 dark:bg-[#0c1421] hover:bg-slate-300 dark:hover:bg-white/15 border border-slate-300 dark:border-white/15 flex items-center justify-center text-slate-700 dark:text-white active:scale-90 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Next Slice Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next industry"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200/80 dark:bg-[#0c1421] hover:bg-slate-300 dark:hover:bg-white/15 border border-slate-300 dark:border-white/15 flex items-center justify-center text-slate-700 dark:text-white active:scale-90 transition-all cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElasticReel;
