import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustedBy } from './components/TrustedBy';
import { StickyMediaSection } from './components/StickyMediaSection';
import { Footer } from './components/Footer';
import { SEO } from './components/SEO';
import { siteContent } from './content/site';

const SLIDE_DURATION_MS = 6000;

export function App() {
  // Slide & synchronized filling line progress state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const totalSlides = siteContent.hero.slides.length;

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  // Synchronized auto-advancing slides every 6000ms in lockstep with CSS progress line
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((curr) => (curr + 1) % totalSlides);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [currentSlideIndex, totalSlides]);

  const handleSearch = (query: string) => {
    console.log('[Axia Kairos Search submitted]:', query);
  };

  const navigate = useNavigate();

  const handleTalkToUs = () => {
    navigate('/contact');
  };

  const handleQuote = () => {
    console.log('[Axia Kairos Get a Quote clicked]');
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-axia-navy dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 overflow-x-clip transition-colors duration-300">
      <SEO
        title="AXIA® KAIROS — Strategy that moves you forward."
        description="Axia Kairos Advisory & Technology Group — Strategy that moves you forward. Cloud Platform Modernization, SAP S/4HANA Migrations, AI & Managed Services."
        canonicalUrl="https://axiakairos.com/"
        ogImage="/l.webp"
      />
      {/* 1. Header (with integrated SunMoonThemeToggle & animated StrokeText) */}
      <Header onCtaClick={handleTalkToUs} />

      {/* 2. Main Page Content */}
      <main className="w-full flex flex-col items-start">
        {/* Section 1: Hero Showcase & Service Cards */}
        <div className="w-full min-h-[100dvh] sm:min-h-[640px] lg:min-h-[680px] xl:min-h-screen flex flex-col justify-between">
          <Hero
            currentSlideIndex={currentSlideIndex}
            onSlideChange={handleSlideChange}
            onSearch={handleSearch}
          />

          {/* Section 1 Footer: Live Trusted-By Strip with Synchronized Filling Line */}
          <TrustedBy
            currentSlide={currentSlideIndex + 1}
            totalSlides={totalSlides}
            progress={0}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>

        {/* Section 2: Sticky Left Media, Scrolling Right Content Feature Section */}
        <StickyMediaSection onCtaClick={handleQuote} />
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

export default App;
