import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { siteContent } from '../content/site';
import StrokeText from './ui/StrokeText';
import { AnimatedThemeToggle } from './ui/animated-theme-toggle';

interface HeaderProps {
  onCtaClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCtaClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logo, navLinks, cta } = siteContent.header;

  const isHome = location.pathname === '/';

  // Listen to scroll so the top header subtly transitions background when scrolling past hero
  useEffect(() => {
    let ticking = false;
    let lastScrolled = typeof window !== 'undefined' && window.scrollY > 20;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY > 20;
          if (current !== lastScrolled) {
            setIsScrolled(current);
            lastScrolled = current;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Track visited pages so the company name logo animation only plays once when visiting a page for the first time
  const [shouldAnimateLogo, setShouldAnimateLogo] = useState(() => {
    try {
      const visited: string[] = JSON.parse(sessionStorage.getItem('axia_animated_pages') || '[]');
      return !visited.includes(location.pathname);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const visited: string[] = JSON.parse(sessionStorage.getItem('axia_animated_pages') || '[]');
      if (!visited.includes(location.pathname)) {
        setShouldAnimateLogo(true);
        sessionStorage.setItem('axia_animated_pages', JSON.stringify([...visited, location.pathname]));
      } else {
        setShouldAnimateLogo(false);
      }
    } catch {
      setShouldAnimateLogo(false);
    }
  }, [location.pathname]);

  // Hero background follows standard light/dark theme classes across all pages
  const isDarkHero = false;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.replace('/#', '#');
      if (isHome) {
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = hash;
        }
      }
    }
  };

  const handleCta = () => {
    setMobileMenuOpen(false);
    if (onCtaClick) {
      onCtaClick();
    } else {
      navigate('/contact');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full select-none transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#070e1b]/90 backdrop-blur-md border-b border-slate-200/60 dark:border-white/10 shadow-sm'
          : 'bg-gradient-to-b from-white/20 to-transparent dark:from-[#05080e]/30 dark:to-transparent border-b border-transparent'
      }`}
      aria-label="Site Header"
    >
      {/* Standard Full-width Header Container - Visible across all sections without turning into a floating pill */}
      <div className={`max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between transition-all duration-200 ${
        isScrolled ? 'py-3.5 sm:py-4' : 'pt-5 sm:pt-6 pb-2'
      }`}>
        {/* Left: Brand Logo (AXIA / KAIROS) with animated StrokeText */}
        <Link 
          to="/" 
          className="flex flex-col group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-axia-slate rounded-sm shrink-0"
          aria-label="AXIA KAIROS Home"
        >
          <div className="flex flex-col transition-transform duration-200 origin-left scale-100">
            <div className="flex items-start">
              <div className={isDarkHero ? "text-white transition-colors" : "text-[#0b192c] dark:text-white transition-colors"}>
                <StrokeText
                  text={logo.brand}
                  strokeColor="#c2a675"
                  fillColor="currentColor"
                  strokeWidth={1.4}
                  drawDuration={1.3}
                  fillDelay={0.15}
                  stagger={0.05}
                  ease="power2.out"
                  trigger={shouldAnimateLogo ? 'mount' : 'none'}
                  fillMode="wipe"
                  wipeFrom="left"
                  fontSize={24}
                  fontWeight={800}
                  fontFamily="inherit"
                  letterSpacing={-0.5}
                  hoverRedraw={false}
                />
              </div>
              {logo.trademark ? (
                <span
                  className={`font-bold ml-0.5 -mt-0.5 transition-colors text-[10.5px] sm:text-[11px] ${
                    isDarkHero ? 'text-slate-300' : 'text-[#0b192c] dark:text-slate-300'
                  }`}
                >
                  {logo.trademark}
                </span>
              ) : null}
            </div>
            <div className={`leading-tight ml-2.5 sm:ml-3 -mt-0.5 transition-colors ${
              isDarkHero ? 'text-slate-400' : 'text-[#6784a3] dark:text-slate-400'
            }`}>
              <StrokeText
                text={logo.sub}
                strokeColor="#c2a675"
                fillColor="currentColor"
                strokeWidth={1.2}
                drawDuration={1.1}
                fillDelay={0.25}
                stagger={0.04}
                ease="power2.out"
                trigger={shouldAnimateLogo ? 'mount' : 'none'}
                fillMode="wipe"
                wipeFrom="left"
                fontSize={12}
                fontWeight={700}
                fontFamily="inherit"
                letterSpacing={2.2}
                hoverRedraw={false}
              />
            </div>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav 
          aria-label="Main Navigation" 
          className="hidden lg:flex items-center pl-6 xl:pl-12 space-x-7 xl:space-x-10"
        >
          {navLinks.map((link) => {
            const isInternal = link.href.startsWith('/') && !link.href.startsWith('/#');
            const isActive = isInternal && (
              location.pathname === link.href || 
              (link.href === '/services' && location.pathname.startsWith('/services'))
            );

            const linkClasses = `text-[14.5px] font-medium transition-colors duration-200 relative py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-axia-slate rounded ${
              isActive
                ? (isDarkHero ? 'text-white font-semibold' : 'text-[#0b192c] dark:text-white font-semibold')
                : (isDarkHero ? 'text-white/85 hover:text-[#c2a675]' : 'text-[#0b192c]/90 hover:text-[#6784a3] dark:text-white/85 dark:hover:text-[#6784a3]')
            }`;

            return isInternal ? (
              <Link
                key={link.label}
                to={link.href}
                className={linkClasses}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#c2a675] rounded-full" />
                )}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={linkClasses}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Theme Toggle, Vertical Divider & "Talk to Us →" Pill Button */}
        <div className="hidden lg:flex items-center shrink-0">
          {/* Animated Solar/Moon Theme Toggle */}
          <AnimatedThemeToggle
            className={`mr-3.5 rounded-full h-9 w-9 p-0 flex items-center justify-center transition-colors duration-200 ${
              isDarkHero
                ? 'border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white'
                : 'border-slate-300/80 dark:border-white/20 text-[#0b192c] dark:text-white bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/60 dark:hover:bg-white/15'
            }`}
          />

          {/* Subtle 1px Vertical Divider */}
          <div 
            className={`h-5 w-[1px] transition-colors ${
              isDarkHero ? 'bg-white/20' : 'bg-slate-300/80 dark:bg-white/20'
            } mr-5 xl:mr-6`} 
            aria-hidden="true" 
          />

          {/* Talk to Us Button */}
          <button
            type="button"
            onClick={handleCta}
            className={`group relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shadow-sm shrink-0 whitespace-nowrap px-5 py-2 text-[14px] ${
              isDarkHero
                ? 'border border-white/40 text-white bg-transparent hover:bg-white hover:text-[#0b192c] hover:border-white focus-visible:ring-white'
                : 'border border-slate-200 dark:border-white/30 text-[#0b192c] dark:text-white bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white dark:hover:text-[#0b192c] hover:border-slate-300 dark:hover:border-white focus-visible:ring-slate-400 dark:focus-visible:ring-white'
            }`}
            aria-label="Talk to Us"
          >
            <span>{cta.label}</span>
            <ArrowRight 
              className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" 
              aria-hidden="true" 
            />
          </button>
        </div>

        {/* Mobile/Tablet Controls (Theme Toggle + Hamburger) */}
        <div className="lg:hidden flex items-center space-x-2">
          <AnimatedThemeToggle
            className={`rounded-full h-[38px] w-[38px] p-0 flex items-center justify-center transition-colors shadow-sm ${
              isDarkHero
                ? 'border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white'
                : 'border-slate-300/80 dark:border-white/20 text-[#0b192c] dark:text-white bg-white/70 dark:bg-black/30 backdrop-blur-md hover:bg-white/90 dark:hover:bg-white/15'
            }`}
          />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-[38px] w-[38px] rounded-lg bg-[#071325] dark:bg-[#071325] text-white flex items-center justify-center border border-[#071325] dark:border-white/20 shadow-sm hover:bg-[#0c1c36] focus:outline-none focus:ring-2 focus:ring-axia-slate transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 stroke-[2.2]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden fixed inset-x-0 ${isScrolled ? 'top-[60px] sm:top-[66px]' : 'top-[68px] sm:top-[74px]'} bg-white/95 dark:bg-[#0c1626]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-xl px-6 py-6 z-50 flex flex-col space-y-4 animate-in slide-in-from-top duration-200`}>
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isInternal = link.href.startsWith('/') && !link.href.startsWith('/#');
              return isInternal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[16px] font-medium text-[#0b192c] dark:text-white hover:text-[#6784a3] py-2 border-b border-slate-100 dark:border-white/10"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-[16px] font-medium text-[#0b192c] dark:text-white hover:text-[#6784a3] py-2 border-b border-slate-100 dark:border-white/10"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCta}
              className="w-full flex items-center justify-center space-x-2 rounded-full border border-slate-200 dark:border-white/20 px-5 py-3 text-[15px] font-medium text-[#0b192c] dark:text-white bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white dark:hover:text-[#0b192c] shadow-sm transition-all"
            >
              <span>{cta.label}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
