import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Cpu, TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { getCaseStudy, caseStudies, type CaseStudyItem } from '../data/caseStudies';

export function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const caseStudy = getCaseStudy(slug || '');

  // 1. Friendly 404 if unknown slug
  if (!caseStudy) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Header onCtaClick={() => (window.location.href = '/contact')} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-32">
          <span className="text-xs font-mono uppercase tracking-widest text-[#c2a675] mb-3">
            ERROR 404
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#0b192c] dark:text-white tracking-tight mb-4">
            Case Study Not Found
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mb-8">
            The enterprise transformation story you requested may have moved or does not exist. Browse our complete library of client outcomes.
          </p>
          <Link
            to="/case-studies"
            className="inline-flex items-center px-7 py-3 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to All Case Studies</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Recommendations: 2-3 case studies from same industry first, then other newest
  const recommendations: CaseStudyItem[] = caseStudies
    .filter((cs) => cs.slug !== caseStudy.slug)
    .sort((a, b) => {
      const aSame = a.industry === caseStudy.industry ? 1 : 0;
      const bSame = b.industry === caseStudy.industry ? 1 : 0;
      return bSame - aSame;
    })
    .slice(0, 3);

  const canonicalUrl = `https://axiakairos.com/case-studies/${caseStudy.slug}`;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      
      {/* SEO & Structured Data */}
      <SEO
        title={caseStudy.seo.title}
        description={caseStudy.seo.description}
        canonicalUrl={canonicalUrl}
        ogImage={caseStudy.image}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://axiakairos.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Case Studies',
                item: 'https://axiakairos.com/case-studies',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: caseStudy.title,
                item: canonicalUrl,
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: caseStudy.title,
            description: caseStudy.summary,
            image: [caseStudy.image],
            datePublished: caseStudy.publishedOn,
            author: {
              '@type': 'Organization',
              name: 'Axia Kairos Consulting Inc.',
              url: 'https://axiakairos.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Axia Kairos Consulting Inc.',
              url: 'https://axiakairos.com',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
          },
        ]}
      />

      {/* Header */}
      <Header onCtaClick={() => (window.location.href = '#lets-connect')} />

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col pt-24 sm:pt-28">

        {/* Top Breadcrumb & Hero Header */}
        <section className="w-full py-8 sm:py-12 bg-gradient-to-b from-slate-50 to-white dark:from-[#09111e] dark:to-[#05080e] border-b border-slate-200/70 dark:border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            
            {/* Back Link */}
            <div className="mb-6">
              <Link
                to="/case-studies"
                className="inline-flex items-center text-xs font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 hover:text-[#0b192c] dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                <span>All Case Studies</span>
              </Link>
            </div>

            {/* Small uppercase mono label: Industry + Published Date */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#c2a675] font-semibold">
                {caseStudy.industry}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {caseStudy.publishedOn}
              </span>
            </div>

            {/* Title (Serif, Elegant) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#0b192c] dark:text-white leading-[1.15] tracking-tight max-w-5xl">
              {caseStudy.title}
            </h1>

            {/* Pull Quote / Summary Badge if present */}
            {caseStudy.pullQuote && (
              <p className="mt-6 text-base sm:text-lg italic text-slate-600 dark:text-slate-300 border-l-2 border-[#c2a675] pl-4 max-w-4xl">
                &ldquo;{caseStudy.pullQuote}&rdquo;
              </p>
            )}

          </div>
        </section>

        {/* Section 1: Two-column Hero / Introduction */}
        <section className="w-full py-12 sm:py-16 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 border-b border-slate-200/70 dark:border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Editorial Introduction */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="text-xs font-mono tracking-widest uppercase text-[#c2a675] font-semibold mb-3">
                EXECUTIVE OVERVIEW
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0b192c] dark:text-white tracking-tight mb-6">
                Introduction
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {caseStudy.introduction.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Image with subtle frame & caption */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  className="w-full h-auto object-cover object-center"
                />
                <div className="p-3 bg-slate-50 dark:bg-[#0c1626] border-t border-slate-200/60 dark:border-white/10 text-center">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Client Transformation Architecture · {caseStudy.industry}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Business Challenge */}
        <section className="w-full py-14 sm:py-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 border-b border-slate-200/70 dark:border-white/10">
          <div className="max-w-4xl">
            <span className="text-xs font-mono tracking-widest uppercase text-[#c2a675] font-semibold mb-2 block">
              OPERATIONAL FRICTION
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0b192c] dark:text-white tracking-tight mb-4">
              Business Challenge
            </h2>

            {caseStudy.businessChallenge.lead && (
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                {caseStudy.businessChallenge.lead}
              </p>
            )}

            {/* Specific Challenge Tick List */}
            <div className="bg-slate-50 dark:bg-[#0c1626] rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">
                Key Challenges Addressed
              </h3>
              <ul className="space-y-4">
                {caseStudy.businessChallenge.points.map((pt, i) => (
                  <li key={i} className="flex items-start space-x-3.5">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold">!</span>
                    </div>
                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-normal">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* Section 3: Solution Implemented */}
        <section className="w-full py-14 sm:py-20 bg-slate-50/50 dark:bg-[#070d17]/50 border-b border-slate-200/70 dark:border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono tracking-widest uppercase text-[#c2a675] font-semibold mb-2 block">
                STRATEGIC ROADMAP
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0b192c] dark:text-white tracking-tight mb-4">
                Solution Implemented
              </h2>
              {caseStudy.solution.lead && (
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {caseStudy.solution.lead}
                </p>
              )}
            </div>

            {/* Grid of Solution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudy.solution.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-[#0b192c] dark:text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0b192c] dark:text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Section 4: Technologies & Services Used */}
        <section className="w-full py-12 sm:py-16 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 border-b border-slate-200/70 dark:border-white/10">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-[#c2a675] font-semibold mb-3">
              <Cpu className="w-4 h-4 text-[#c2a675]" />
              <span>STACK & CAPABILITIES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0b192c] dark:text-white tracking-tight mb-6">
              Technologies & Services Used
            </h2>

            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {caseStudy.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 font-medium shadow-sm hover:border-[#c2a675]/50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c2a675] mr-2.5" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Results & Impact */}
        <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50 dark:from-[#05080e] dark:to-[#08101e] border-b border-slate-200/70 dark:border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono tracking-widest uppercase text-[#c2a675] font-semibold mb-2 block flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#c2a675]" />
                QUANTIFIED VALUE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0b192c] dark:text-white tracking-tight mb-4">
                Results & Impact
              </h2>
              {caseStudy.results.lead && (
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {caseStudy.results.lead}
                </p>
              )}
            </div>

            {/* Grid of Results Cards (Metric rendered in 48px serif italic with accent) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudy.results.items.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all"
                >
                  <div>
                    {res.metric ? (
                      <div className="mb-4">
                        <span className="text-4xl sm:text-5xl font-serif font-extrabold text-[#c2a675] italic tracking-tight">
                          {res.metric}
                        </span>
                        <div className="w-12 h-0.5 bg-[#c2a675]/60 mt-2" />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <ShieldCheck className="w-7 h-7 text-[#c2a675]" />
                      </div>
                    )}

                    <h3 className="text-base sm:text-lg font-bold text-[#0b192c] dark:text-white mb-2 leading-snug">
                      {res.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {res.text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Section 6: Interactive "Have a similar requirement? Let's Connect" Form */}
        <section className="w-full py-16 sm:py-24 bg-slate-50 dark:bg-[#070e1a] border-b border-slate-200/80 dark:border-white/10" id="lets-connect">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            <ServiceRequestForm
              source={`Case Study: ${caseStudy.title}`}
              badge="COLLABORATE"
              title="Have a similar requirement? Let's Connect"
              subtitle="Connect directly with an Axia Kairos principal consultant to discuss how we can tailor a similar transformation for your enterprise."
            />
          </div>
        </section>

        {/* Section 7: More Case Studies Recommendation Row */}
        {recommendations.length > 0 && (
          <section className="w-full py-16 sm:py-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16" aria-label="Recommended Case Studies">
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#c2a675] font-semibold mb-1 block">
                  EXPLORE FURTHER
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0b192c] dark:text-white">
                  More Case Studies
                </h2>
              </div>
              <Link
                to="/case-studies"
                className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#0b192c] dark:text-white hover:text-[#c2a675] transition-colors"
              >
                <span>View All ({caseStudies.length})</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {recommendations.map((rec) => (
                <article
                  key={rec.slug}
                  className="group bg-white dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={rec.image}
                        alt={rec.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-[11px] font-mono uppercase text-[#c2a675] font-semibold mb-2">
                        <span>{rec.industry}</span>
                      </div>
                      <h3 className="text-base font-bold font-serif text-[#0b192c] dark:text-white leading-snug group-hover:text-axia-slate transition-colors mb-3 line-clamp-2">
                        <Link to={`/case-studies/${rec.slug}`}>
                          {rec.title}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {rec.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/case-studies/${rec.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-[#0b192c] dark:text-white group-hover:text-[#c2a675] transition-colors"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

          </section>
        )}

      </main>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}

export default CaseStudyDetailPage;
