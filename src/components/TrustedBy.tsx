import React from 'react';
import { siteContent } from '../content/site';
import { SliderControls } from './SliderControls';

interface TrustedByProps {
  currentSlide: number;
  totalSlides: number;
  progress?: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const BrandLogo: React.FC<{ logo: { name: string; src: string; alt: string } }> = ({ logo }) => {
  return (
    <img 
      src={logo.src} 
      alt={logo.alt} 
      width={90}
      height={24}
      loading="lazy"
      decoding="async"
      className="h-5 sm:h-6 w-auto object-contain select-none pointer-events-none opacity-85 hover:opacity-100 dark:invert dark:brightness-200 transition-opacity" 
    />
  );
};

export const TrustedBy: React.FC<TrustedByProps> = ({
  currentSlide,
  totalSlides,
  progress = 0,
  onPrevSlide,
  onNextSlide,
}) => {
  const { heading, logos } = siteContent.trustedBy;

  return (
    <footer 
      aria-label="Trusted by global organisations" 
      className="w-full bg-white dark:bg-[#070b12] border-t border-slate-200/80 dark:border-white/10 min-h-[76px] sm:h-[78px] py-2 sm:py-0 flex items-center relative z-20 shrink-0 transition-colors duration-300"
    >
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-10 lg:px-14 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-6">
        
        {/* Mobile View: Eyebrow + Visible Next/Prev Controls (Top Row) & Live Scrolling Logos (Bottom Row) */}
        <div className="flex md:hidden flex-col w-full py-1 space-y-2">
          {/* Top Row: Eyebrow label on left, SliderControls with Next button on right */}
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-[10px] font-semibold tracking-[0.22em] text-slate-500 dark:text-slate-400 uppercase select-none">
              {heading}
            </span>
            <SliderControls
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              progress={progress}
              onPrev={onPrevSlide}
              onNext={onNextSlide}
            />
          </div>

          {/* Bottom Row: Live Scrolling Logos Ticker */}
          <div 
            className="relative overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]"
            title="Scrolling partner brands"
          >
            <div className="animate-ticker-left flex items-center select-none py-0.5 group cursor-grab">
              {/* Set 1 of Logos */}
              <div className="flex items-center space-x-6 pr-6 shrink-0">
                {logos.map((logo) => (
                  <React.Fragment key={`mob-set1-${logo.name}`}>
                    <div className="flex items-center justify-center h-6 shrink-0">
                      <BrandLogo logo={logo} />
                    </div>
                    <div className="h-4 w-[1px] bg-slate-300/80 dark:bg-white/20 shrink-0" aria-hidden="true" />
                  </React.Fragment>
                ))}
              </div>

              {/* Set 2 of Logos (creates seamless infinite loop) */}
              <div className="flex items-center space-x-6 pr-6 shrink-0" aria-hidden="true">
                {logos.map((logo) => (
                  <React.Fragment key={`mob-set2-${logo.name}`}>
                    <div className="flex items-center justify-center h-6 shrink-0">
                      <BrandLogo logo={logo} />
                    </div>
                    <div className="h-4 w-[1px] bg-slate-300/80 dark:bg-white/20 shrink-0" aria-hidden="true" />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop & Tablet: Eyebrow + Live Infinite Scrolling Logos Ticker */}
        <div className="hidden md:flex flex-row items-center gap-6 min-w-0 flex-1 w-full overflow-hidden">
          {/* Eyebrow Label */}
          <div className="shrink-0 text-[10.5px] font-semibold tracking-[0.24em] text-slate-500 dark:text-slate-400 uppercase select-none whitespace-nowrap">
            {heading}
          </div>

          {/* Continuous Right-to-Left Infinite Scrolling Marquee */}
          <div 
            className="relative overflow-hidden flex-1 w-full [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-24px),transparent)]"
            title="Hover to pause brand ticker"
          >
            <div className="animate-ticker-left flex items-center select-none py-1 group cursor-grab">
              {/* Set 1 of Logos */}
              <div className="flex items-center space-x-8 xl:space-x-10 pr-8 xl:pr-10 shrink-0">
                {logos.map((logo) => (
                  <React.Fragment key={`desk-set1-${logo.name}`}>
                    <div className="flex items-center justify-center h-6 sm:h-7 shrink-0">
                      <BrandLogo logo={logo} />
                    </div>
                    <div 
                      className="h-4 sm:h-5 w-[1px] bg-slate-300/80 dark:bg-white/15 shrink-0 select-none" 
                      aria-hidden="true" 
                    />
                  </React.Fragment>
                ))}
              </div>

              {/* Set 2 of Logos (creates seamless infinite loop) */}
              <div className="flex items-center space-x-8 xl:space-x-10 pr-8 xl:pr-10 shrink-0" aria-hidden="true">
                {logos.map((logo) => (
                  <React.Fragment key={`desk-set2-${logo.name}`}>
                    <div className="flex items-center justify-center h-6 sm:h-7 shrink-0">
                      <BrandLogo logo={logo} />
                    </div>
                    <div 
                      className="h-4 sm:h-5 w-[1px] bg-slate-300/80 dark:bg-white/15 shrink-0 select-none" 
                      aria-hidden="true" 
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Far Right Slider Controls for Desktop & Tablet */}
        <div className="hidden md:block shrink-0 self-center pl-4">
          <SliderControls
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            progress={progress}
            onPrev={onPrevSlide}
            onNext={onNextSlide}
          />
        </div>
      </div>
    </footer>
  );
};
