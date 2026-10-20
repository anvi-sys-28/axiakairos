import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import DuotoneTeamRoster from '../components/ui/duotone-team-roster';

export function AboutPage() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] dark:bg-[#05080e] text-[#0b192c] dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 overflow-x-clip transition-colors duration-300">
      <SEO
        title="About Axia Kairos — Strategic Leadership & Enterprise Transformation"
        description="Meet the minds behind Axia Kairos. Strategic consultants, digital architects, and transformation leaders empowering global enterprises."
        canonicalUrl="https://axiakairos.com/about"
        ogImage="/l.webp"
      />
      {/* 1. Header (with integrated AnimatedThemeToggle) */}
      <Header />

      {/* 2. About Us Page First Section: Duotone Team Roster */}
      <main className="w-full flex-1 flex flex-col">
        <DuotoneTeamRoster
          eyebrow="LEADERSHIP · EXPERTISE · VALUES"
          title="The&#10;minds"
          intro="Strategic consultants, digital architects, and transformation leaders empowering global enterprises to navigate complexity."
          cta={{ label: "Join the team", href: "/#careers" }}
          secondaryCta={{ label: "Our Approach →", href: "/#services" }}
          preset={isDark ? "axiaDark" : "axiaLight"}
          height="100vh"
          showPhotos={false}
        />
      </main>

      {/* Shared Ticket Stub Footer */}
      <Footer />
    </div>
  );
}

export default AboutPage;
