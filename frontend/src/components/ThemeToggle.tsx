import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = ""
}) => {
  return (
    <aside
      aria-label="Theme switcher"
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 select-none ${className}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
        title={theme === 'dark' ? "Switch to light theme" : "Switch to dark theme"}
        className="group relative w-[52px] h-[70px] bg-[#3a3e48] hover:bg-[#454a56] active:scale-95 transition-all duration-200 rounded-l-[26px] rounded-r-none flex items-center justify-center shadow-[-4px_4px_24px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c518] border-y border-l border-white/10"
      >
        {/* Subtle left border glow */}
        <div 
          className="absolute inset-y-2.5 left-0 w-[2px] bg-white/20 rounded-full group-hover:bg-[#f5c518]/60 transition-colors" 
          aria-hidden="true" 
        />

        {/* Icon matching screenshot: Golden sun icon with radial rays */}
        {theme === 'dark' ? (
          <Sun 
            className="w-6 h-6 text-[#f5c518] group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(245,197,24,0.55)]" 
            strokeWidth={2.4}
            aria-hidden="true"
          />
        ) : (
          <Moon 
            className="w-5 h-5 text-[#f5c518] group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(245,197,24,0.4)]" 
            strokeWidth={2.2}
            aria-hidden="true"
          />
        )}
      </button>
    </aside>
  );
};
