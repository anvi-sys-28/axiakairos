import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { getServiceBySlug, caseStudiesData } from '../data/services';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug || '');

  // 1. Friendly 404 if unknown slug
  if (!service) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Header onCtaClick={() => (window.location.href = '/#contact')} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-32">
          <span className="text-xs font-mono uppercase tracking-widest text-[#c2a675] mb-3">
            ERROR 404
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0b192c] dark:text-white tracking-tight mb-4">
            Service Not Found
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mb-8">
            The service capability you requested may have moved or does not exist. Browse our complete suite of enterprise services.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center px-7 py-3 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to All Services</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Related case studies
  const serviceCaseStudies = service.caseStudySlugs
    .map((s) => caseStudiesData[s])
    .filter(Boolean);

  const canonicalUrl = `https://axiakairos.com/services/${service.slug}`;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      
      {/* SEO & Structured Data */}
      <SEO
        title={service.seo.title}
        description={service.seo.description}
        canonicalUrl={canonicalUrl}
        ogImage={service.intro.image || '/l.webp'}
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
                name: 'Services',
                item: 'https://axiakairos.com/services',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: service.title,
                item: canonicalUrl,
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.shortDescription,
            provider: {
              '@type': 'Organization',
              name: 'Axia Kairos Consulting Inc.',
              url: 'https://axiakairos.com',
            },
            serviceType: service.title,
            url: canonicalUrl,
          },
        ]}
      />

      {/* Header (with integrated SunMoonThemeToggle) */}
      <Header onCtaClick={() => (window.location.href = '#request-service')} />

      <main className="w-full flex-1 flex flex-col pt-24 sm:pt-28">
        
        {/* Section 1: Hero Header */}
        <section className="relative w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#09111e] dark:via-[#060c16] dark:to-[#05080e] border-b border-slate-200/70 dark:border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            
            {/* Back to Services Link */}
            <Link
              to="/services"
              className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-[#6784a3] hover:text-[#0b192c] dark:hover:text-white transition-colors mb-6 group select-none"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to Services</span>
            </Link>

            {/* H1 Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0b192c] dark:text-white tracking-tight leading-[1.08] max-w-4xl">
              {service.title}
            </h1>

            {/* Tagline */}
            <p className="mt-4 sm:mt-5 text-lg sm:text-xl lg:text-2xl font-light text-[#6784a3] dark:text-slate-300 max-w-3xl leading-relaxed">
              {service.hero.tagline}
            </p>

          </div>
        </section>

        {/* Section 2: Introduction (Two-Column on Desktop) */}
        {service.intro.paragraphs.length > 0 && (
          <section className="w-full py-14 sm:py-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Text Left */}
              <div className="lg:col-span-7 flex flex-col space-y-5">
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#c2a675] font-semibold">
                  OVERVIEW
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0b192c] dark:text-white tracking-tight">
                  Driving Transformation Through Purpose-Built Execution
                </h2>
                {service.intro.paragraphs.map((para, i) => (
                  <p key={i} className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              {/* Illustration Right */}
              <div className="lg:col-span-5 flex justify-center">
                {service.intro.image ? (
                  <div className="w-full max-w-[480px] p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden flex items-center justify-center">
                    <img
                      src={service.intro.image}
                      alt={`${service.title} Architecture Overview`}
                      loading="lazy"
                      className="w-full h-auto max-h-[360px] object-contain drop-shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-slate-100 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/15 flex items-center justify-center text-slate-400 text-sm">
                    {service.title} Overview
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* Section 3: "Why <Service> Matters" (Lead + Pain-Point Cards Grid) */}
        {service.whyItMatters.items.length > 0 && (
          <section className="w-full py-16 sm:py-20 bg-slate-50 dark:bg-[#070e1a] border-y border-slate-200/80 dark:border-white/10">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
              
              <div className="max-w-3xl mb-12">
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#c2a675] font-semibold">
                  STRATEGIC IMPERATIVE
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b192c] dark:text-white tracking-tight mt-1">
                  Why {service.title} Matters
                </h2>
                <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {service.whyItMatters.lead}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.whyItMatters.items.map((item, idx) => {
                  const num = (idx + 1).toString().padStart(2, '0');
                  return (
                    <div
                      key={idx}
                      className="p-6 sm:p-7 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold tracking-widest text-[#6784a3]">
                          {num}
                        </span>
                        <div className="w-6 h-[1px] bg-slate-300 dark:bg-white/15" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0b192c] dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>
        )}

        {/* Section 4: "Our <Service> Service Portfolio" */}
        {service.portfolio.items.length > 0 && (
          <section className="w-full py-16 sm:py-24 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            
            <div className="max-w-3xl mb-14">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#c2a675] font-semibold">
                END-TO-END CAPABILITIES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b192c] dark:text-white tracking-tight mt-1">
                Our {service.title} Portfolio
              </h2>
              <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {service.portfolio.lead}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {service.portfolio.items.map((card, idx) => (
                <div
                  key={idx}
                  className="group relative p-7 sm:p-8 rounded-2xl bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-white/10 shadow-sm hover:border-axia-slate hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                      {card.icon ? (
                        <img src={card.icon} alt="" className="w-6 h-6 object-contain" />
                      ) : (
                        <div className="w-3 h-3 bg-axia-slate rounded-sm" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#0b192c] dark:text-white leading-snug mb-3">
                      {card.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      {card.text}
                    </p>
                  </div>

                  {/* Bullet list with small blue square markers */}
                  {card.bullets.length > 0 && (
                    <ul className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-white/10" aria-label={`${card.title} deliverables`}>
                      {card.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-snug">
                          {/* Small blue square marker */}
                          <span className="w-1.5 h-1.5 bg-[#6784a3] shrink-0 mt-1.5 mr-2.5 rounded-none" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

          </section>
        )}

        {/* Section 5: "Our Delivery Methodology" */}
        {service.methodology.steps.length > 0 && (
          <section className="w-full py-16 sm:py-20 bg-slate-50 dark:bg-[#070e1a] border-t border-slate-200/80 dark:border-white/10">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
              
              <div className="max-w-3xl mb-12">
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#c2a675] font-semibold">
                  PROVEN EXECUTION
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0b192c] dark:text-white tracking-tight mt-1">
                  Our Delivery Methodology
                </h2>
                {service.methodology.lead && (
                  <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                    {service.methodology.lead}
                  </p>
                )}
              </div>

              {/* Horizontal Timeline on Desktop / Vertical on Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {service.methodology.steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  return (
                    <div
                      key={idx}
                      className="relative p-6 sm:p-7 rounded-xl bg-white dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Step number badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-xs font-bold font-mono">
                            0{stepNum}
                          </span>
                          <span className="text-xs font-mono uppercase tracking-widest text-[#6784a3]">
                            Phase {stepNum}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#0b192c] dark:text-white mb-2 leading-snug">
                          {step.title}
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>
        )}

        {/* Section 6: Related Case Studies */}
        {serviceCaseStudies.length > 0 && (
          <section className="w-full py-16 sm:py-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c2a675] font-semibold">
                  IMPACT IN ACTION
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0b192c] dark:text-white tracking-tight mt-1">
                  Related Case Studies
                </h2>
              </div>
              <a
                href="/#case-studies"
                className="inline-flex items-center text-sm font-medium text-[#0b192c] dark:text-white hover:text-axia-slate transition-colors"
              >
                <span>Explore all case studies</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {serviceCaseStudies.slice(0, 3).map((cs) => (
                <div
                  key={cs.slug}
                  className="flex flex-col bg-[#f8f9fb] dark:bg-[#0c1626] rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm"
                >
                  {cs.image && (
                    <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                      <img
                        src={cs.image}
                        alt={cs.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#0b192c] dark:text-white leading-snug mb-2.5">
                        {cs.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {cs.description}
                      </p>
                    </div>
                    {cs.quote && (
                      <p className="mt-4 pt-4 border-t border-slate-200/60 dark:border-white/10 text-xs italic text-slate-500 dark:text-slate-400">
                        {cs.quote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 7: "Request Service" Interactive Form */}
        <section className="w-full py-16 sm:py-24 bg-slate-50 dark:bg-[#070e1a] border-t border-slate-200/80 dark:border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
            <ServiceRequestForm initialServiceSlug={service.slug} />
          </div>
        </section>

        {/* Section 8: Closing Contact Block */}
        <section className="w-full py-14 sm:py-16 bg-[#0b192c] text-white">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Have a query or project in mind?
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Reach out to our executive advisory team to explore bespoke engagement models.
              </p>
            </div>
            <a
              href="/#contact"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-[#0b192c] hover:bg-slate-100 font-semibold text-sm transition-all shadow-md shrink-0"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </section>

      </main>

      {/* Section 9: Shared Footer */}
      <Footer />

    </div>
  );
}

export default ServiceDetailPage;
