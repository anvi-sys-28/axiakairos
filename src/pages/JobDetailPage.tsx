import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { JobApplicationForm } from '../components/JobApplicationForm';
import { getJobBySlug, getSimilarJobs } from '../data/jobs';

function formatPublishDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const job = slug ? getJobBySlug(slug) : undefined;

  // Unknown slug or closed job -> Friendly fallback
  if (!job || job.status !== 'open') {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col">
        <SEO
          title="Position No Longer Open | Axia Kairos Careers"
          description="The requested position is currently no longer open. Explore other active opportunities on our Careers page."
        />
        <Header onCtaClick={() => navigate('/contact')} />
        <main className="flex-1 flex items-center justify-center px-4 py-32">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                POSITION STATUS
              </span>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                This position is no longer open
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Thank you for your interest in Axia Kairos. This particular role is currently closed, but our team is actively hiring for other positions.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Careers</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Similar open roles (up to 3 other roles)
  const similarRoles = getSimilarJobs(job.slug, 3);

  // Construct JSON-LD for JobPosting
  const jsonLdData: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary,
    datePosted: job.publishedOn.split('T')[0],
    employmentType: job.employmentType === 'Full Time' ? 'FULL_TIME' : job.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Axia Kairos',
      sameAs: 'https://axiakairos.com',
      logo: 'https://axiakairos.com/wp-content/uploads/2024/07/Axia-Kairos-Logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: job.location.includes('Canada') ? 'CA' : 'IN',
        addressRegion: job.location,
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: job.location,
    },
  };

  if (job.validThrough) {
    jsonLdData.validThrough = job.validThrough;
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500/20 overflow-x-clip transition-colors duration-300">
      <SEO
        title={`${job.title} | Axia Kairos Careers`}
        description={job.summary}
        canonicalUrl={`https://axiakairos.com/careers/${job.slug}`}
        jsonLd={[
          jsonLdData,
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
                name: 'Careers',
                item: 'https://axiakairos.com/careers',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: job.title,
                item: `https://axiakairos.com/careers/${job.slug}`,
              },
            ],
          },
        ]}
      />

      {/* Header */}
      <Header onCtaClick={() => navigate('/contact')} />

      <main className="w-full flex-1 pt-28 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation Link */}
          <div className="mb-8">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Careers</span>
            </Link>
          </div>

          {/* Job Header & Meta */}
          <div className="pb-10 border-b border-slate-200/80 dark:border-white/10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>{job.department}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {job.title}
            </h1>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 pt-2 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{job.employmentType}</span>
              </div>
              {job.experience && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>{job.experience}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Published {formatPublishDate(job.publishedOn)}</span>
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid: Details Left, Sticky Apply Panel Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-12 items-start">
            {/* Left Column: Job Description & Sections */}
            <div className="lg:col-span-7 space-y-10 text-left">
              {job.sections.map((section, idx) => (
                <section key={idx} className="space-y-4">
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-white/10 pb-3">
                    {section.heading}
                  </h2>

                  {/* Paragraphs */}
                  {section.paragraphs && section.paragraphs.length > 0 && (
                    <div className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                      {section.paragraphs.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>
                  )}

                  {/* Bullets */}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-3 pt-1">
                      {section.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-light"
                        >
                          <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-1 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* Hiring Ethics & Benefits Callout */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-semibold">
                  <Shield className="w-4 h-4 text-cyan-500" />
                  <span>Equal Opportunity &amp; Career Growth</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Axia Kairos is committed to building an inclusive workplace that welcomes diverse perspectives. We offer competitive compensation packages, continuous skill certification sponsorship, and cross-border mobility across our global practices.
                </p>
              </div>
            </div>

            {/* Right Column: Sticky Apply Panel */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <JobApplicationForm job={job} />
            </div>
          </div>

          {/* Similar Roles Section */}
          {similarRoles.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-200/80 dark:border-white/10 space-y-8">
              <div className="space-y-2 text-left">
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
                  OTHER OPENINGS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Similar Roles You Might Like
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarRoles.map((simJob) => (
                  <article
                    key={simJob.slug}
                    className="rounded-2xl p-6 bg-slate-50/50 dark:bg-[#0c1424]/60 border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium">
                        {simJob.department}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        <Link to={`/careers/${simJob.slug}`}>{simJob.title}</Link>
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
                        <span>{simJob.location}</span>
                        <span>&bull;</span>
                        <span>{simJob.employmentType}</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/5">
                      <Link
                        to={`/careers/${simJob.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                      >
                        <span>View Role</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default JobDetailPage;
