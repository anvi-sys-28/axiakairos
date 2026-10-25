import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, Filter, Calendar, Tag } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import {
  caseStudies,
  caseStudiesIndexHero,
  caseStudiesIndexSeo,
  caseStudyIndustries,
  type CaseStudyIndustry,
} from '../data/caseStudies';

export function CaseStudiesIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeIndustryParam = searchParams.get('industry') || 'All';
  const [searchQuery, setSearchQuery] = useState('');

  const activeIndustry: CaseStudyIndustry = (caseStudyIndustries as readonly string[]).includes(activeIndustryParam)
    ? (activeIndustryParam as CaseStudyIndustry)
    : 'All';

  const handleSelectIndustry = (industry: CaseStudyIndustry) => {
    if (industry === 'All') {
      searchParams.delete('industry');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ industry });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    searchParams.delete('industry');
    setSearchParams(searchParams);
  };

  // Filter case studies by activeIndustry and search query
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((cs) => {
      // Industry filter
      const matchesIndustry = activeIndustry === 'All' || cs.industry === activeIndustry;
      if (!matchesIndustry) return false;

      // Text query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        cs.title.toLowerCase().includes(q) ||
        cs.summary.toLowerCase().includes(q) ||
        cs.industry.toLowerCase().includes(q) ||
        cs.technologies.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [activeIndustry, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      
      {/* SEO Metadata */}
      <SEO
        title={caseStudiesIndexSeo.title}
        description={caseStudiesIndexSeo.description}
        canonicalUrl="https://axiakairos.com/case-studies"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: caseStudiesIndexSeo.title,
            description: caseStudiesIndexSeo.description,
            url: 'https://axiakairos.com/case-studies',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Axia Kairos Enterprise Case Studies',
            itemListElement: caseStudies.map((cs, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: cs.title,
              url: `https://axiakairos.com/case-studies/${cs.slug}`,
            })),
          },
        ]}
      />

      {/* 1. Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col">

        {/* Page Hero with Theme-Aware Background */}
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
              PROVEN ENTERPRISE IMPACT
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b192c] dark:text-white tracking-tight leading-tight max-w-3xl">
              {caseStudiesIndexHero.title}
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {caseStudiesIndexHero.intro}
            </p>

            {/* Live Search Bar */}
            <div className="w-full max-w-xl mt-8 sm:mt-10 relative">
              <div className="relative flex items-center w-full h-[52px] sm:h-[56px] bg-white/95 dark:bg-[#0c1626]/75 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] border border-slate-200/90 dark:border-white/15 px-5 sm:px-6 transition-all focus-within:ring-2 focus-within:ring-axia-slate focus-within:border-axia-slate">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories by keyword, client challenge, or technology..."
                  aria-label="Search case studies"
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

            {/* Industry Filter Chips */}
            <div className="w-full max-w-5xl mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <div className="hidden sm:flex items-center text-xs font-mono uppercase text-slate-400 mr-2 tracking-wider">
                <Filter className="w-3.5 h-3.5 mr-1" />
                Industry:
              </div>
              {caseStudyIndustries.map((industry) => {
                const isActive = activeIndustry === industry;
                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => handleSelectIndustry(industry)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] shadow-sm font-semibold'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>

          </div>
        </section>

        {/* Editorial Case Studies Section */}
        <section className="w-full py-16 sm:py-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16" aria-label="Case Studies List">
          
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-200/80 dark:border-white/10">
            <span className="text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
              Showing {filteredCaseStudies.length} of {caseStudies.length} Case Studies {activeIndustry !== 'All' && `in ${activeIndustry}`}
            </span>
            {(activeIndustry !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-mono uppercase tracking-wider text-[#c2a675] hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {filteredCaseStudies.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center bg-slate-50 dark:bg-[#0c1626]/40 rounded-2xl border border-dashed border-slate-300 dark:border-white/15 px-6">
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-2">
                No case studies match your active filter criteria.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                Try selecting a different industry or clearing your search term to browse all enterprise transformations.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {filteredCaseStudies.map((cs, idx) => {
                // Alternating editorial layout on desktop: even image left, odd image right
                const isEven = idx % 2 === 0;

                return (
                  <article
                    key={cs.slug}
                    className="group relative bg-white dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch`}>
                      
                      {/* Image Block */}
                      <div className="w-full lg:w-1/2 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        <img
                          src={cs.image}
                          alt={cs.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                      </div>

                      {/* Content Block */}
                      <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between">
                        <div>
                          
                          {/* Metadata row: Industry + Date */}
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-semibold tracking-wider uppercase text-[11px]">
                              <Tag className="w-3 h-3 mr-1 text-[#c2a675]" />
                              {cs.industry}
                            </span>
                            <span className="inline-flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {cs.publishedOn}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-[#0b192c] dark:text-white leading-snug tracking-tight mb-4 group-hover:text-axia-slate transition-colors">
                            <Link to={`/case-studies/${cs.slug}`} className="hover:underline">
                              {cs.title}
                            </Link>
                          </h2>

                          {/* Summary */}
                          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-3">
                            {cs.summary}
                          </p>

                          {/* Pull Quote */}
                          {cs.pullQuote && (
                            <blockquote className="border-l-2 border-[#c2a675] pl-4 py-1 mb-6 text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 bg-slate-50/70 dark:bg-white/[0.03] rounded-r">
                              &ldquo;{cs.pullQuote}&rdquo;
                            </blockquote>
                          )}

                          {/* Key Technologies Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-8">
                            {cs.technologies.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-slate-400"
                              >
                                {tech}
                              </span>
                            ))}
                            {cs.technologies.length > 4 && (
                              <span className="px-2 py-0.5 text-[11px] font-mono text-slate-400 self-center">
                                +{cs.technologies.length - 4} more
                              </span>
                            )}
                          </div>

                        </div>

                        {/* Card Footer: View More Link */}
                        <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                          <Link
                            to={`/case-studies/${cs.slug}`}
                            className="inline-flex items-center text-sm font-semibold text-[#0b192c] dark:text-white group-hover:text-[#c2a675] transition-colors"
                          >
                            <span>Read Full Case Study</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>

                          {cs.results.items[0]?.metric && (
                            <div className="text-right">
                              <span className="text-xl sm:text-2xl font-serif font-bold text-[#c2a675] tracking-tight">
                                {cs.results.items[0].metric}
                              </span>
                              <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                {cs.results.items[0].title}
                              </span>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </section>

        {/* Shared Closing CTA Band */}
        <section className="w-full py-16 sm:py-20 bg-[#0b192c] text-white relative overflow-hidden border-t border-slate-800">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#c2a675] uppercase font-semibold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#c2a675]" />
                ENTERPRISE PARTNERSHIP
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Ready to drive measurable impact? Let&rsquo;s talk.
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
                Partner with Axia Kairos to bridge strategic vision and mission-critical execution with verified enterprise outcomes.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-white text-[#0b192c] hover:bg-slate-100 font-semibold text-sm transition-all shadow-md active:scale-95 shrink-0"
            >
              <span>Connect with Our Advisors</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>

      </main>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}

export default CaseStudiesIndexPage;
