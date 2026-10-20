import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderControlsProps {
  currentSlide: number; // 1-based (1, 2, 3)
  totalSlides: number;
  progress?: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export const SliderControls: React.FC<SliderControlsProps> = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  className = ""
}) => {
  const formattedCurrent = currentSlide.toString().padStart(2, '0');
  const formattedTotal = totalSlides.toString().padStart(2, '0');

  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-4 select-none shrink-0 ${className}`} aria-label="Hero carousel controls">
      {/* Filling Progress Line (Synchronized with Hero slide transitions) */}
      <div 
        className="w-8 sm:w-16 h-[3px] bg-slate-300 dark:bg-slate-700/80 rounded-full overflow-hidden relative cursor-pointer shrink-0"
        aria-hidden="true"
        title="Next slide"
        onClick={onNext}
      >
        <div 
          key={currentSlide}
          className="h-full bg-[#0b192c] dark:bg-white rounded-full animate-progress-fill"
        />
      </div>

      {/* Slide Counter: "01 / 03" */}
      <span className="text-[12px] sm:text-[13px] font-mono font-medium text-slate-800 dark:text-slate-200 tracking-wider whitespace-nowrap shrink-0">
        {formattedCurrent} <span className="text-slate-400 dark:text-slate-500">/</span> {formattedTotal}
      </span>

      {/* Navigation Chevron Buttons matching screenshot 2 */}
      <div className="flex items-center space-x-1.5 ml-1">
        {/* Prev Button with rounded square border as in screenshot 2 */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous slide"
          className="w-7 h-7 rounded-lg border border-[#475569]/70 dark:border-slate-500/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-axia-slate"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          aria-label="Next slide"
          className="w-7 h-7 rounded-lg border border-[#475569]/70 dark:border-slate-500/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-axia-slate"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
