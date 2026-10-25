import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { siteContent, type HeroSlide } from '../content/site';
import { SearchBar } from './SearchBar';
import { ServiceCards } from './ServiceCards';

interface HeroProps {
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  onSearch?: (query: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentSlideIndex,
  onSlideChange,
  onSearch,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { slides } = siteContent.hero;
  const currentSlide: HeroSlide = slides[currentSlideIndex] || slides[0];
  const shouldReduceMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <section
      aria-label="Axia Kairos Showcase"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative w-full flex-1 flex flex-col justify-between overflow-hidden bg-slate-900 select-none pt-20 sm:pt-24 lg:pt-24 pb-0"
    >
      {/* 1. Static Full-bleed Background Image: /mb.webp on mobile, 1st slide image on desktop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Mobile Viewport: /mb.webp */}
        <img
          src="/mb.webp"
          alt="Axia Kairos Luxury Penthouse Skyline"
          width={750}
          height={1334}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-top block md:hidden"
        />
        {/* Desktop & Tablet: 1st slide image */}
        <img
          src={slides[0].image}
          alt="Axia Kairos Executive Space"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-right hidden md:block filter brightness-[0.98] dark:brightness-[0.88]"
        />
      </div>

      {/* 2. Soft translucent gradient wash for desktop text readability */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none hidden md:block dark:hidden"
        style={{
          background: 'linear-gradient(to right, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.40) 24%, rgba(255, 255, 255, 0.10) 38%, transparent 50%)'
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 z-10 pointer-events-none hidden md:dark:block"
        style={{
          background: 'linear-gradient(to right, rgba(6, 12, 22, 0.78) 0%, rgba(6, 12, 22, 0.48) 24%, rgba(6, 12, 22, 0.12) 38%, transparent 50%)'
        }}
        aria-hidden="true"
      />
      {/* Subtle dark mode overlay for mobile text contrast */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none hidden dark:block md:hidden bg-black/35"
        aria-hidden="true"
      />


      {/* Main Content Area: Headline, Search, Subtext, Right Labels */}
      <div className="relative z-30 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex-1 flex flex-col justify-center my-auto pt-2 pb-2">
        <div className="flex items-center justify-between w-full">
          
          {/* Left Text Block */}
          <div className="max-w-[780px] flex flex-col items-start select-text w-full">
            
            {/* Eyebrow: BUSINESS · TECHNOLOGY · PEOPLE */}
            <motion.div
              key={`eyebrow-${currentSlide.id}`}
              initial={hasMounted ? { opacity: 0, y: shouldReduceMotion ? 0 : 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[12px] sm:text-[12.5px] font-bold tracking-[0.24em] text-[#33465e] dark:text-slate-300 uppercase mb-2.5 select-none transition-colors"
            >
              {currentSlide.eyebrow}
            </motion.div>

            {/* H1: Two Proportionally Balanced Lines */}
            <motion.h1
              key={`h1-${currentSlide.id}`}
              initial={hasMounted ? { opacity: 0, y: shouldReduceMotion ? 0 : 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: hasMounted ? 0.05 : 0 }}
              className="font-bold tracking-tightHeadline leading-[1.08] text-[40px] min-[375px]:text-[44px] sm:text-[50px] md:text-[54px] lg:text-[58px] xl:text-[64px] max-w-[310px] min-[390px]:max-w-[340px] sm:max-w-none"
            >
              <span className="block text-[#091728] dark:text-white font-extrabold transition-colors">
                {currentSlide.headlineLine1}
              </span>
              <span className="block text-[#3f5f84] dark:text-[#9bc2ed] font-semibold md:font-normal transition-colors">
                {currentSlide.headlineLine2}
              </span>
            </motion.h1>

            {/* Search Bar (~555px wide, ~54-60px tall, soft drop shadow) - Stably mounted without slide key to prevent blinking */}
            <div className="w-full mt-5 sm:mt-6 select-none relative z-40 max-w-[555px]">
              <SearchBar
                placeholder="Search for a service..."
                onSearch={onSearch}
              />
            </div>

            {/* Two-Line Subtext Under Search */}
            <motion.div
              key={`subtext-${currentSlide.id}`}
              initial={hasMounted ? { opacity: 0, y: shouldReduceMotion ? 0 : 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: hasMounted ? 0.15 : 0 }}
              className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.48] sm:leading-[1.5] text-[#1c2e44] dark:text-slate-100 font-medium max-w-[360px] sm:max-w-[560px] transition-colors drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            >
              <p>{currentSlide.subtextLine1}</p>
              <p>{currentSlide.subtextLine2}</p>
            </motion.div>
          </div>

          {/* Right Edge: Vertical Stack of Small Spaced Uppercase Labels */}
          <div className="hidden lg:flex flex-col items-start pl-8 pr-4 select-none self-center mb-4">
            <div className="flex flex-col space-y-2.5 text-left">
              {currentSlide.verticalLabels.map((label) => (
                <span
                  key={label}
                  className="text-[11.5px] font-semibold tracking-[0.25em] text-[#f2efe9] uppercase drop-shadow-sm opacity-90"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Short Gold Horizontal Line Below Labels */}
            <div 
              className="w-8 h-[2px] bg-[#c2a675] mt-4 shadow-sm" 
              aria-hidden="true" 
            />
          </div>
        </div>
      </div>

      {/* 4. Bottom Service Cards */}
      <div className="relative z-20 pb-3 sm:pb-1 lg:pb-1.5 w-full">
        <ServiceCards
          currentSlideIndex={currentSlideIndex}
          onSlideChange={onSlideChange}
        />
      </div>
    </section>
  );
};
