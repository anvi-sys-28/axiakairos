import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '../assets/hero.webp';

/**
 * Asset-Based Preloader Configuration
 * Finishes when critical assets (fonts + hero image) are ready, with max 3s fallback.
 */
export const PRELOADER_CONFIG = {
  brandPart1: "AXIA",
  brandPart2: "KAIROS",
  trademark: "",
  tagline: "Strategy that moves you forward.",
  accentColor: "#c2a675",
  backgroundColor: "#05080e",
  minDisplayTimeMs: 700, // Small minimum display so brand name doesn't flash jarringly
  maxTimeoutMs: 3000, // Maximum failsafe timeout fallback
  sessionStorageKey: "axia_preloader_seen",
};

export const Preloader: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.location.pathname.startsWith("/admin")) return false;
    try {
      return !sessionStorage.getItem(PRELOADER_CONFIG.sessionStorageKey);
    } catch {
      return false;
    }
  });

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!shouldRender) {
      if (typeof window !== "undefined") {
        (window as any).__PRELOADER_DONE__ = true;
        window.dispatchEvent(new Event("axia:preloader_done"));
      }
      return;
    }

    // Check prefers-reduced-motion
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setIsExiting(true);
      try {
        sessionStorage.setItem(PRELOADER_CONFIG.sessionStorageKey, "true");
      } catch {}
      return;
    }

    // Lock page scroll while preloader is active
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let hasExited = false;
    const exitPreloader = () => {
      if (hasExited) return;
      hasExited = true;
      setIsExiting(true);
      try {
        sessionStorage.setItem(PRELOADER_CONFIG.sessionStorageKey, "true");
      } catch {}
    };

    // Failsafe timer (maximum 3 seconds fallback)
    const failsafeTimer = setTimeout(exitPreloader, PRELOADER_CONFIG.maxTimeoutMs);

    // Asset-based readiness: document.fonts.ready + hero image decode + min display time
    const minTimePromise = new Promise((resolve) =>
      setTimeout(resolve, PRELOADER_CONFIG.minDisplayTimeMs)
    );

    const fontsPromise =
      document.fonts && document.fonts.ready
        ? document.fonts.ready
        : Promise.resolve();

    const heroImagePromise = new Promise<void>((resolve) => {
      const isMobile = window.innerWidth < 768;
      const img = new Image();
      img.src = isMobile ? "/mb.webp" : heroImage;
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });

    Promise.all([minTimePromise, fontsPromise, heroImagePromise]).then(() => {
      exitPreloader();
    });

    return () => {
      clearTimeout(failsafeTimer);
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [shouldRender]);

  const handleAnimationComplete = () => {
    if (isExiting) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      setShouldRender(false);
      if (typeof window !== "undefined") {
        (window as any).__PRELOADER_DONE__ = true;
        window.dispatchEvent(new Event("axia:preloader_done"));
      }
    }
  };

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {!isExiting && (
        <motion.div
          key="axia-preloader"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.65,
              ease: [0.77, 0, 0.175, 1], // Smooth vertical curtain lift
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

          {/* Central Logo Container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            <div className="overflow-hidden py-1 mb-1">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.65,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center tracking-tight"
              >
                <span className="text-white font-extrabold text-[clamp(32px,5.5vw,56px)] tracking-[-0.03em] leading-none">
                  {PRELOADER_CONFIG.brandPart1}
                </span>
                {PRELOADER_CONFIG.trademark ? (
                  <span className="text-[#c2a675] font-light text-[clamp(14px,2.2vw,22px)] self-start ml-0.5 -mt-1 font-mono">
                    {PRELOADER_CONFIG.trademark}
                  </span>
                ) : null}
                <span
                  className="font-medium text-[clamp(28px,5vw,50px)] tracking-[0.14em] ml-3 leading-none"
                  style={{ color: PRELOADER_CONFIG.accentColor }}
                >
                  {PRELOADER_CONFIG.brandPart2}
                </span>
              </motion.div>
            </div>

            {/* Drawing Accent Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-[1.5px] w-48 sm:w-64 max-w-[80vw] origin-center my-3"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${PRELOADER_CONFIG.accentColor} 50%, transparent 100%)`,
              }}
            />

            {/* Tagline */}
            <div className="overflow-hidden py-0.5">
              <motion.p
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                  ease: "easeOut",
                }}
                className="font-mono text-[11px] sm:text-[12px] tracking-[0.25em] uppercase text-slate-400 text-center"
              >
                {PRELOADER_CONFIG.tagline}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Preloader;
