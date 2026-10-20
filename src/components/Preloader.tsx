import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Customizable Preloader Configuration
 * Edit text, colors, and timing values here.
 */
export const PRELOADER_CONFIG = {
  brandPart1: "AXIA",
  brandPart2: "KAIROS",
  trademark: "®",
  tagline: "Strategy that moves you forward.",
  accentColor: "#c2a675", // Elegant Kairos gold accent
  backgroundColor: "#05080e", // Deep near-black executive ground
  minDurationMs: 3000, // Wait 3 seconds before transitioning to hero section landing page
  failsafeTimeoutMs: 6000, // Maximum timeout before force-exiting
  sessionStorageKey: "axia_preloader_seen",
};

export const Preloader: React.FC = () => {
  // Check session storage immediately so repeat navigations do not flash
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !sessionStorage.getItem(PRELOADER_CONFIG.sessionStorageKey);
    } catch {
      return false;
    }
  });

  const [isExiting, setIsExiting] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (!shouldRender) return;

    // Check prefers-reduced-motion
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setPrefersReduced(true);
      const timer = setTimeout(() => {
        setIsExiting(true);
        try {
          sessionStorage.setItem(PRELOADER_CONFIG.sessionStorageKey, "true");
        } catch {}
      }, 500);
      return () => clearTimeout(timer);
    }

    // Lock page scroll while preloader is active
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let minTimeElapsed = false;
    let windowLoaded = document.readyState === "complete";

    const attemptExit = () => {
      if (minTimeElapsed && windowLoaded) {
        setIsExiting(true);
        try {
          sessionStorage.setItem(PRELOADER_CONFIG.sessionStorageKey, "true");
        } catch {}
      }
    };

    // 1. Min animation duration timer
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      attemptExit();
    }, PRELOADER_CONFIG.minDurationMs);

    // 2. Window load listener
    const handleLoad = () => {
      windowLoaded = true;
      attemptExit();
    };

    if (!windowLoaded) {
      window.addEventListener("load", handleLoad, { once: true });
    }

    // 3. Failsafe timer (6 seconds maximum)
    const failsafeTimer = setTimeout(() => {
      setIsExiting(true);
      try {
        sessionStorage.setItem(PRELOADER_CONFIG.sessionStorageKey, "true");
      } catch {}
    }, PRELOADER_CONFIG.failsafeTimeoutMs);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(failsafeTimer);
      window.removeEventListener("load", handleLoad);
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [shouldRender]);

  const handleAnimationComplete = () => {
    if (isExiting) {
      // Restore scroll
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // Unmount from DOM completely
      setShouldRender(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {!isExiting ? (
        <motion.div
          key="axia-preloader"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.85,
              ease: [0.77, 0, 0.175, 1], // Smooth dramatic vertical curtain lift
            },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ backgroundColor: PRELOADER_CONFIG.backgroundColor }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Subtle ambient luxury backdrop glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(circle at 50% 48%, rgba(194, 166, 117, 0.15) 0%, rgba(11, 25, 44, 0.4) 45%, transparent 75%)`,
            }}
            aria-hidden="true"
          />

          {/* Main Brand & Tagline Stage */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
            {/* 1. Masked Word Slide-Up for AXIA KAIROS */}
            <div className="overflow-hidden py-1 mb-2">
              <motion.div
                initial={prefersReduced ? { opacity: 0 } : { y: 65, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: prefersReduced ? 0.3 : 1.05,
                  delay: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center tracking-tight"
              >
                <span className="text-white font-extrabold text-[clamp(32px,5.5vw,56px)] tracking-[-0.03em] leading-none">
                  {PRELOADER_CONFIG.brandPart1}
                </span>
                <span className="text-[#c2a675] font-light text-[clamp(14px,2.2vw,22px)] self-start ml-0.5 -mt-1 font-mono">
                  {PRELOADER_CONFIG.trademark}
                </span>
                <span
                  className="font-medium text-[clamp(28px,5vw,50px)] tracking-[0.14em] ml-3 leading-none"
                  style={{ color: PRELOADER_CONFIG.accentColor }}
                >
                  {PRELOADER_CONFIG.brandPart2}
                </span>
              </motion.div>
            </div>

            {/* 2. Drawing Accent Line */}
            <div className="w-full max-w-[280px] sm:max-w-[340px] h-[1.5px] bg-white/10 relative overflow-hidden my-3">
              <motion.div
                initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: prefersReduced ? 0.2 : 0.9,
                  delay: prefersReduced ? 0.1 : 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 origin-center"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${PRELOADER_CONFIG.accentColor} 50%, transparent 100%)`,
                }}
              />
            </div>

            {/* 3. Masked Slide-Up Tagline */}
            <div className="overflow-hidden mt-1">
              <motion.p
                initial={prefersReduced ? { opacity: 0 } : { y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 0.85 }}
                transition={{
                  duration: prefersReduced ? 0.3 : 0.85,
                  delay: prefersReduced ? 0.2 : 1.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-slate-300 text-[clamp(12px,1.4vw,15px)] font-normal tracking-[0.24em] uppercase font-sans"
              >
                {PRELOADER_CONFIG.tagline}
              </motion.p>
            </div>
          </div>

          {/* Minimal Corporate Progress indicator dot */}
          <div className="absolute bottom-10 inset-x-0 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: PRELOADER_CONFIG.accentColor }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Preloader;
