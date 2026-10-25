import React from 'react';
import { ArrowRight } from 'lucide-react';
import { siteContent, type ServiceCardItem } from '../content/site';

interface ServiceCardsProps {
  onCardClick?: (service: ServiceCardItem) => void;
  className?: string;
  currentSlideIndex?: number;
  onSlideChange?: (index: number) => void;
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({ 
  onCardClick, 
  className = "",
  currentSlideIndex = 0,
  onSlideChange,
}) => {
  const { services } = siteContent;
  const activeIndex = Math.abs(currentSlideIndex) % services.length;
  const currentService = services[activeIndex] || services[0];

  return (
    <div 
      className={`w-full max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-16 ${className}`}
      aria-label="Core Services"
    >
      {/* 1. Desktop & Tablet: 3-Column Translucent Dark Navy Glass Grid */}
      <div className="hidden md:grid grid-cols-3 rounded-2xl overflow-hidden backdrop-blur-xl bg-[#0c1a2d]/65 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.4)] divide-x divide-white/10">
        {services.map((service) => (
          <div
            key={service.number}
            onClick={() => onCardClick?.(service)}
            tabIndex={0}
            role="button"
            aria-label={`${service.number} ${service.title}: ${service.descriptionLine1} ${service.descriptionLine2}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCardClick?.(service);
              }
            }}
            className="group relative p-5 sm:p-5.5 lg:p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:bg-[#152740]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {/* Top row: Number and horizontal accent line */}
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-[13px] font-mono tracking-wider text-slate-300/90 font-medium">
                {service.number}
              </span>
              <div className="w-8 h-[1px] bg-slate-400/50 group-hover:w-12 group-hover:bg-white/70 transition-all duration-300" aria-hidden="true" />
            </div>

            {/* Middle: Title */}
            <div className="mb-4">
              <h2 className="text-[19px] sm:text-[20px] font-semibold text-white tracking-tight leading-snug">
                {service.title}
              </h2>
            </div>

            {/* Bottom row: Two-line description + Circular Outlined Arrow Button */}
            <div className="flex items-end justify-between mt-auto pt-1">
              <div className="text-[13.5px] leading-[1.35] text-slate-300/80 font-normal pr-4">
                <p>{service.descriptionLine1}</p>
                <p>{service.descriptionLine2}</p>
              </div>

              {/* Circular Outlined Button that fills white on hover */}
              <div
                className="w-9 h-9 rounded-full border border-white/35 flex items-center justify-center shrink-0 text-white/90 group-hover:border-white group-hover:bg-white group-hover:text-[#0b192c] transition-all duration-300 shadow-sm"
                aria-hidden="true"
              >
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Mobile Phone: Single Showcase Card matching media_1792479078212.png */}
      <div className="block md:hidden w-full">
        <div
          onClick={() => onCardClick?.(currentService)}
          className="relative w-full rounded-xl overflow-hidden backdrop-blur-xl bg-[#0b172a]/90 border border-white/20 shadow-[0_18px_45px_rgba(0,0,0,0.4)] cursor-pointer select-none"
        >
          {/* Right Skyscraper Image (full height of card) */}
          <div className="absolute inset-y-0 right-0 w-[55%] pointer-events-none overflow-hidden">
            <img
              src="/assets/card_sunset.webp"
              width={750}
              height={500}
              loading="lazy"
              decoding="async"
              alt={currentService.title}
              className="w-full h-full object-cover object-right"
            />
            {/* Smooth gradient blend into the card's dark body */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#0b172a] via-[#0b172a]/70 to-transparent" 
              aria-hidden="true"
            />
          </div>

          {/* Card Content & Bottom Controls Overlay */}
          <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between min-h-[135px]">
            {/* Top / Middle Details */}
            <div className="max-w-[62%]">
              {/* Number and horizontal line */}
              <div className="flex items-center space-x-2.5 mb-1.5">
                <span className="text-[12px] font-mono font-medium text-slate-300 tracking-wider">
                  {currentService.number}
                </span>
                <div className="w-7 h-[1px] bg-slate-400/60" aria-hidden="true" />
              </div>

              {/* Title */}
              <h2 className="text-[18px] font-bold text-white tracking-tight leading-tight mb-1">
                {currentService.title}
              </h2>

              {/* Two-Line Description */}
              <div className="text-[12px] text-slate-300/85 leading-snug">
                <p>{currentService.descriptionLine1}</p>
                <p>{currentService.descriptionLine2}</p>
              </div>
            </div>

            {/* Bottom Controls: 3 Progress Bars + Counter */}
            <div className="flex items-center justify-between pt-2.5">
              {/* 3 Progress Bars */}
              <div className="flex items-center space-x-1.5" role="tablist" aria-label="Service carousel">
                {services.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSlideChange) onSlideChange(idx);
                    }}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-10 bg-white'
                        : 'w-7 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Counter (e.g. 01 / 03) */}
              <span className="text-[11.5px] font-mono font-medium text-slate-200 tracking-wider drop-shadow-sm">
                {`${currentService.number} / 0${services.length}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
