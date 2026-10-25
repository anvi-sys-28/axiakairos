import React from 'react';

/**
 * An original line-art SVG illustration for the Careers Hero section.
 * Reflects Axia Kairos's architectural, technical, and forward-looking aesthetic
 * with interconnected nodes, talent trajectories, and system geometry.
 */
export const CareersHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-square max-w-[500px] mx-auto select-none ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 540 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          <linearGradient id="career-grid-grad" x1="0" y1="0" x2="540" y2="540" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="0.5" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="career-line-accent" x1="100" y1="440" x2="440" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0b192c" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="1" />
          </linearGradient>
          <pattern id="dot-matrix" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-slate-300 dark:fill-white/10" />
          </pattern>
        </defs>

        {/* Subtle dot matrix background */}
        <rect x="60" y="60" width="420" height="420" rx="24" fill="url(#dot-matrix)" opacity="0.6" />

        {/* Hairline concentric orbits */}
        <circle cx="270" cy="270" r="210" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="270" cy="270" r="150" className="stroke-slate-300 dark:stroke-white/15" strokeWidth="1" />
        <circle cx="270" cy="270" r="90" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" strokeDasharray="3 4" />

        {/* Dynamic Coordinate Axes & Grids */}
        <line x1="60" y1="270" x2="480" y2="270" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" />
        <line x1="270" y1="60" x2="270" y2="480" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" />

        {/* Isometric Path of Ascent / Growth Line */}
        <path
          d="M 100 420 L 210 330 L 280 370 L 400 180 L 450 140"
          stroke="url(#career-line-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Projected Architectural Planes */}
        <polygon
          points="210,330 280,370 280,430 210,390"
          className="fill-cyan-500/5 stroke-cyan-500/30"
          strokeWidth="1"
        />
        <polygon
          points="280,370 400,180 400,240 280,430"
          className="fill-blue-500/5 stroke-blue-500/30"
          strokeWidth="1"
        />

        {/* Career Landmark Nodes */}
        {/* Node 1: Origin */}
        <g transform="translate(100, 420)">
          <circle cx="0" cy="0" r="16" className="fill-white dark:fill-[#0c1424] stroke-slate-300 dark:stroke-white/20" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="5" className="fill-cyan-600 dark:fill-cyan-400" />
        </g>

        {/* Node 2: Mentorship & Delivery */}
        <g transform="translate(210, 330)">
          <circle cx="0" cy="0" r="18" className="fill-white dark:fill-[#0c1424] stroke-cyan-500/50" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" className="fill-cyan-500" />
          <line x1="0" y1="-18" x2="0" y2="-36" className="stroke-cyan-500/50" strokeWidth="1" strokeDasharray="2 2" />
          {/* Tag */}
          <rect x="-42" y="-58" width="84" height="20" rx="4" className="fill-white/95 dark:fill-[#0f172a]/95 stroke-slate-200 dark:stroke-white/15 shadow-sm" strokeWidth="1" />
          <text x="0" y="-44" textAnchor="middle" className="text-[10px] font-mono font-medium fill-slate-700 dark:fill-slate-200 tracking-wider">COLLABORATE</text>
        </g>

        {/* Node 3: Deep Mastery */}
        <g transform="translate(280, 370)">
          <circle cx="0" cy="0" r="14" className="fill-white dark:fill-[#0c1424] stroke-slate-300 dark:stroke-white/20" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" className="fill-blue-600 dark:fill-blue-400" />
        </g>

        {/* Node 4: Technical Leadership */}
        <g transform="translate(400, 180)">
          <circle cx="0" cy="0" r="22" className="fill-white dark:fill-[#0c1424] stroke-cyan-500" strokeWidth="2" />
          <circle cx="0" cy="0" r="8" className="fill-cyan-500 animate-pulse" />
          <line x1="22" y1="0" x2="45" y2="0" className="stroke-cyan-500/60" strokeWidth="1" strokeDasharray="2 2" />
          {/* Floating Pill Tag */}
          <rect x="48" y="-12" width="76" height="24" rx="12" className="fill-white/95 dark:fill-[#0f172a]/95 stroke-cyan-500/40 shadow-sm" strokeWidth="1" />
          <text x="86" y="4" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-cyan-600 dark:fill-cyan-400 tracking-wider">LEADERSHIP</text>
        </g>

        {/* Node 5: Enterprise Apex */}
        <g transform="translate(450, 140)">
          <circle cx="0" cy="0" r="10" className="fill-cyan-400 dark:fill-cyan-300" />
          <circle cx="0" cy="0" r="18" className="stroke-cyan-400/40" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>

        {/* Floating Enterprise Cards */}
        {/* Card 1: SAP Ecosystem */}
        <g transform="translate(70, 140)">
          <rect width="130" height="52" rx="8" className="fill-white/90 dark:fill-[#0b1528]/90 stroke-slate-200 dark:stroke-white/10 shadow-lg" strokeWidth="1" />
          <circle cx="20" cy="26" r="6" className="fill-cyan-500/20 stroke-cyan-500" strokeWidth="1.5" />
          <text x="36" y="22" className="text-[10px] font-mono uppercase tracking-wider fill-slate-500 dark:fill-slate-400">PRACTICE</text>
          <text x="36" y="38" className="text-xs font-serif font-bold fill-slate-900 dark:fill-white">SAP S/4HANA</text>
        </g>

        {/* Card 2: Global Impact */}
        <g transform="translate(320, 390)">
          <rect width="145" height="52" rx="8" className="fill-white/90 dark:fill-[#0b1528]/90 stroke-slate-200 dark:stroke-white/10 shadow-lg" strokeWidth="1" />
          <circle cx="20" cy="26" r="6" className="fill-blue-500/20 stroke-blue-500" strokeWidth="1.5" />
          <text x="36" y="22" className="text-[10px] font-mono uppercase tracking-wider fill-slate-500 dark:fill-slate-400">FOOTPRINT</text>
          <text x="36" y="38" className="text-xs font-serif font-bold fill-slate-900 dark:fill-white">India · Canada · US</text>
        </g>
      </svg>
    </div>
  );
};

/**
 * An original line-art SVG illustration for Campus Engagement.
 * Represents academic learning bridging into high-velocity enterprise technology.
 */
export const CampusEngagementIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[4/3] max-w-[460px] mx-auto select-none ${className}`}>
      <div className="absolute inset-0 bg-radial from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-xl pointer-events-none" />
      <svg
        viewBox="0 0 460 345"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          <linearGradient id="campus-bridge-grad" x1="60" y1="260" x2="400" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="0.6" stopColor="#0284c7" stopOpacity="0.9" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Subtle grid background */}
        <line x1="40" y1="280" x2="420" y2="280" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" />
        <line x1="40" y1="220" x2="420" y2="220" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="40" y1="160" x2="420" y2="160" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" strokeDasharray="2 4" />

        {/* Bridge Curve: University to Enterprise */}
        <path
          d="M 80 260 C 160 260, 220 180, 290 140 C 340 110, 360 90, 390 80"
          stroke="url(#campus-bridge-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Bridge Vertical Struts */}
        <line x1="130" y1="250" x2="130" y2="280" className="stroke-cyan-500/30" strokeWidth="1" />
        <line x1="180" y1="210" x2="180" y2="280" className="stroke-cyan-500/30" strokeWidth="1" />
        <line x1="230" y1="170" x2="230" y2="280" className="stroke-cyan-500/30" strokeWidth="1" />
        <line x1="280" y1="145" x2="280" y2="280" className="stroke-cyan-500/30" strokeWidth="1" />
        <line x1="335" y1="108" x2="335" y2="280" className="stroke-cyan-500/30" strokeWidth="1" />

        {/* Left Side: Academic / Talent Hub */}
        <g transform="translate(80, 260)">
          <rect x="-35" y="-30" width="70" height="40" rx="8" className="fill-white dark:fill-[#0c1424] stroke-slate-300 dark:stroke-white/20 shadow-sm" strokeWidth="1" />
          <circle cx="0" cy="-10" r="8" className="fill-blue-500/20 stroke-blue-500" strokeWidth="1.5" />
          {/* Mortarboard icon lines */}
          <polygon points="-7,-10 0,-14 7,-10 0,-6" className="fill-blue-500" />
          <text x="0" y="24" textAnchor="middle" className="text-[9px] font-mono font-medium fill-slate-500 dark:fill-slate-400">ACADEMIA</text>
        </g>

        {/* Midpoint: Internship & Workshop Hub */}
        <g transform="translate(230, 170)">
          <circle cx="0" cy="0" r="16" className="fill-white dark:fill-[#0c1424] stroke-cyan-500" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="6" className="fill-cyan-500" />
          {/* Tag */}
          <rect x="-48" y="-38" width="96" height="20" rx="4" className="fill-white/95 dark:fill-[#0b1528]/95 stroke-slate-200 dark:stroke-white/15 shadow-sm" strokeWidth="1" />
          <text x="0" y="-24" textAnchor="middle" className="text-[9px] font-mono font-semibold fill-cyan-600 dark:fill-cyan-400 tracking-wider">INTERNSHIP DRIVE</text>
        </g>

        {/* Right Side: Enterprise Career Destination */}
        <g transform="translate(390, 80)">
          {/* Modern Enterprise Tower Lockup */}
          <rect x="-24" y="-30" width="48" height="60" rx="6" className="fill-white dark:fill-[#0c1424] stroke-cyan-500/60 shadow-md" strokeWidth="1.5" />
          <line x1="-14" y1="-15" x2="14" y2="-15" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" />
          <line x1="-14" y1="-3" x2="14" y2="-3" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" />
          <line x1="-14" y1="9" x2="14" y2="9" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1" />
          <circle cx="0" cy="-40" r="5" className="fill-cyan-500" />
          <circle cx="0" cy="-40" r="10" className="stroke-cyan-500/40" strokeWidth="1" strokeDasharray="2 2" />
          <text x="0" y="44" textAnchor="middle" className="text-[9px] font-mono font-medium fill-slate-500 dark:fill-slate-400">ENTERPRISE</text>
        </g>
      </svg>
    </div>
  );
};
