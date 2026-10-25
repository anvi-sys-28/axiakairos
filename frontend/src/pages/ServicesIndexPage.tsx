import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { servicesData, servicesIndexHero, servicesIndexSeo, caseStudiesData } from '../data/services';

export function ServicesIndexPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Filter 12 services live by title and shortDescription
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return servicesData;
    return servicesData.filter(
      (s) => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Featured 3 case studies for the bottom strip
  const featuredCaseStudies = useMemo(() => {
    return Object.values(caseStudiesData).slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      
      {/* SEO metadata */}
      <SEO
        title={servicesIndexSeo.title}
        description={servicesIndexSeo.description}
        canonicalUrl="https://axiakairos.com/services"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: servicesIndexSeo.title,
            description: servicesIndexSeo.description,
            url: 'https://axiakairos.com/services',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Axia Kairos Enterprise Services',
            itemListElement: servicesData.map((s, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: s.title,
              url: `https://axiakairos.com/services/${s.slug}`,
            })),
          },
        ]}
      />

      {/* 1. Header (with integrated SunMoonThemeToggle) */}
      <Header />

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col">
        
        {/* Page Hero with Theme-Aware Background Images */}
        <section className="relative w-full pt-32 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-24 overflow-hidden flex flex-col items-center justify-center">
          
          {/* Background Images */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
            {/* Light Theme Background: sb.webp */}
            <img
              src="/sb.webp"
              alt=""
              className="w-full h-full object-cover object-center dark:hidden"
              aria-hidden="true"
            />
            {/* Dark Theme Background: dsb.webp */}
            <img
              src="/dsb.webp"
              alt=""
              className="w-full h-full object-cover object-center hidden dark:block"
              aria-hidden="true"
            />
            {/* Bottom seamless blend into content section */}
            <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-white dark:from-[#05080e] via-white/40 dark:via-[#05080e]/40 to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col items-center text-center">
            
            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.25em] uppercase text-[#c2a675] font-mono mb-3 sm:mb-4">
              ENTERPRISE CAPABILITIES
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b192c] dark:text-white tracking-tight leading-tight max-w-3xl">
              {servicesIndexHero.title}
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {servicesIndexHero.intro}
            </p>

            {/* Live Search & Filter Bar */}
            <div className="w-full max-w-xl mt-8 sm:mt-10 relative">
              <div className="relative flex items-center w-full h-[52px] sm:h-[56px] bg-white/95 dark:bg-[#0c1626]/75 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] border border-slate-200/90 dark:border-white/15 px-5 sm:px-6 transition-all focus-within:ring-2 focus-within:ring-axia-slate focus-within:border-axia-slate">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by service name or technology..."
                  aria-label="Filter services"
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs uppercase font-mono tracking-wider text-slate-400 hover:text-slate-700 dark:hover:text-white ml-2 py-1 px-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 12 Service Cards Grid */}
        <section className="w-full py-12 sm:py-16 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16" aria-label="Services List">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-white/10">
            <span className="text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
              SHOWING {filteredServices.length} OF {servicesData.length} SERVICES
            </span>
          </div>

          {filteredServices.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">
                No services match your search query &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 rounded-full border border-slate-300 dark:border-white/20 text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Reset Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredServices.map((service, index) => {
                const formattedNum = (index + 1).toString().padStart(2, '0');
                return (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-2xl bg-[#f8f9fb] dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 hover:border-axia-slate hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,25,44,0.08)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-300"
                  >
                    <div>
                      {/* Number and Line */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 group-hover:text-axia-slate transition-colors">
                          {formattedNum}
                        </span>
                        <div className="w-8 h-[1px] bg-slate-300 dark:bg-white/15 group-hover:w-12 group-hover:bg-axia-slate transition-all duration-300" />
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold text-[#0b192c] dark:text-white tracking-tight leading-snug mb-3 group-hover:text-axia-slate dark:group-hover:text-[#8cb3db] transition-colors">
                        {service.title}
                      </h2>

                      {/* Short Description */}
                      <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                        {service.shortDescription}
                      </p>
                    </div>

                    {/* Learn More Action */}
                    <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0b192c] dark:text-white group-hover:text-axia-slate dark:group-hover:text-[#8cb3db] transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </section>

        {/* Featured Case Studies Strip */}
        <section className="w-full py-16 sm:py-20 bg-slate-50 dark:bg-[#070d18] border-t border-slate-200/80 dark:border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c2a675] font-semibold">
                  PROVEN CLIENT IMPACT
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0b192c] dark:text-white tracking-tight mt-1">
                  Featured Case Studies
                </h3>
              </div>
              <a
                href="/#case-studies"
                className="inline-flex items-center text-sm font-medium text-[#0b192c] dark:text-white hover:text-axia-slate transition-colors"
              >
                <span>View More Case Studies</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {featuredCaseStudies.map((cs) => (
                <div
                  key={cs.slug}
                  className="flex flex-col bg-white dark:bg-[#0c1626] rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
                >
                  {cs.image && (
                    <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                      <img
                        src={cs.image}
                        alt={cs.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#0b192c] dark:text-white leading-snug mb-2.5">
                        {cs.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {cs.description}
                      </p>
                    </div>
                    {cs.quote && (
                      <p className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10 text-xs italic text-slate-500 dark:text-slate-400">
                        {cs.quote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Closing CTA Band */}
        <section className="w-full py-16 sm:py-20 bg-[#0b192c] text-white relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#c2a675] uppercase font-semibold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#c2a675]" />
                ACCELERATE YOUR ENTERPRISE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Ready to transform your operations with confidence?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
                Partner with Axia Kairos to bridge strategic vision and mission-critical execution.
              </p>
            </div>

            <a
              href="/#contact"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-white text-[#0b192c] hover:bg-slate-100 font-semibold text-sm transition-all shadow-md active:scale-95 shrink-0"
            >
              <span>Talk to Us</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </section>

      </main>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}

export default ServicesIndexPage;
