import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Check,
  Copy,
  Linkedin,
  Twitter,
  Sparkles,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { getBlogPost, blogs, type BlogPost, type Block } from '../data/blogs';

// Safe formatted inline text helper without dangerouslySetInnerHTML
function renderFormattedText(text: string): React.ReactNode {
  // Support **bold** text inline
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0b192c] dark:text-white mt-12 mb-4 tracking-tight first:mt-0">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#0b192c] dark:text-white mt-8 mb-3 tracking-tight">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
          {renderFormattedText(block.text)}
        </p>
      );
    case 'ul':
      return (
        <ul className="list-disc pl-6 sm:pl-8 space-y-2.5 mb-8 text-slate-700 dark:text-slate-300 text-base sm:text-lg marker:text-[#c2a675]">
          {block.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderFormattedText(item)}
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="list-decimal pl-6 sm:pl-8 space-y-2.5 mb-8 text-slate-700 dark:text-slate-300 text-base sm:text-lg marker:text-[#c2a675] font-medium">
          {block.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed font-normal">
              {renderFormattedText(item)}
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className="border-l-4 border-[#c2a675] pl-6 py-2 my-8 italic text-lg sm:text-xl text-slate-800 dark:text-slate-200 bg-slate-50/80 dark:bg-white/[0.03] rounded-r-xl">
          &ldquo;{block.text}&rdquo;
        </blockquote>
      );
    case 'image':
      return (
        <figure className="my-8 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-lg">
          <img src={block.src} alt={block.alt || ''} className="w-full h-auto object-cover" />
          {block.caption && (
            <figcaption className="p-3 text-center text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0c1626]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug || '');
  const [copied, setCopied] = useState(false);

  // 1. Friendly 404 if post not found
  if (!post) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Header onCtaClick={() => (window.location.href = '/contact')} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-32">
          <span className="text-xs font-mono uppercase tracking-widest text-[#c2a675] mb-3">
            ERROR 404
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#0b192c] dark:text-white tracking-tight mb-4">
            Article Not Found
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mb-8">
            The article you requested could not be found. Explore our complete collection of insights on digital strategy and enterprise transformation.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center px-7 py-3 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to All Blogs</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Related posts: 3 other posts (newest first, excluding this one)
  const relatedPosts: BlogPost[] = blogs
    .filter((b) => b.slug !== post.slug)
    .slice(0, 3);

  const canonicalUrl = `https://axiakairos.com/blogs/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(canonicalUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      
      {/* SEO & Structured Data */}
      <SEO
        title={post.seo.title}
        description={post.seo.description}
        canonicalUrl={canonicalUrl}
        ogImage={post.coverImage}
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
                name: 'Blogs',
                item: 'https://axiakairos.com/blogs',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: canonicalUrl,
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            image: [post.coverImage],
            datePublished: post.date,
            author: {
              '@type': 'Organization',
              name: 'Axia Kairos',
              url: 'https://axiakairos.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Axia Kairos',
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
      <Header />

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col pt-24 sm:pt-28">

        {/* Top Breadcrumb & Article Header */}
        <header className="w-full py-8 sm:py-12 bg-gradient-to-b from-slate-50 to-white dark:from-[#09111e] dark:to-[#05080e] border-b border-slate-200/70 dark:border-white/10">
          <div className="max-w-4xl mx-auto px-6 sm:px-10">
            
            {/* Back to Blogs */}
            <div className="mb-6">
              <Link
                to="/blogs"
                className="inline-flex items-center text-xs font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 hover:text-[#0b192c] dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                <span>Back to Blogs</span>
              </Link>
            </div>

            {/* Date & Reading Time */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-4">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {post.formattedDate}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center text-[#c2a675] font-semibold">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {post.readingTimeMinutes} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#0b192c] dark:text-white leading-[1.18] tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt Lead */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {post.excerpt}
            </p>

          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="max-w-4xl mx-auto w-full px-6 sm:px-10 -mt-2 pt-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-white/10 aspect-[16/9] bg-slate-100 dark:bg-slate-800">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Share Bar Row */}
        <div className="max-w-4xl mx-auto w-full px-6 sm:px-10 py-6 border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider">
            <Share2 className="w-3.5 h-3.5 text-[#c2a675]" />
            <span>Share Article:</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#0077b5] hover:border-[#0077b5]/40 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy link to clipboard"
              className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Article Body Content (Measure ~70ch / max-w-3xl) */}
        <article className="w-full max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
          {post.body.map((block, idx) => (
            <RenderBlock key={idx} block={block} />
          ))}
        </article>

        {/* Section: Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="w-full py-16 sm:py-20 bg-slate-50/70 dark:bg-[#070e1a]/70 border-t border-slate-200/80 dark:border-white/10" aria-label="Related Articles">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-white/10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#c2a675] font-semibold mb-1 block">
                    RECOMMENDED READING
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0b192c] dark:text-white">
                    Related Articles
                  </h2>
                </div>
                <Link
                  to="/blogs"
                  className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#0b192c] dark:text-white hover:text-[#c2a675] transition-colors"
                >
                  <span>Explore All Blogs</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((rel: BlogPost) => (
                  <article
                    key={rel.slug}
                    className="group flex flex-col justify-between bg-white dark:bg-[#0c1626] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    <div>
                      <Link to={`/blogs/${rel.slug}`} className="block relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={rel.coverImage}
                          alt={rel.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div className="p-6">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
                          <span>{rel.formattedDate}</span>
                          <span className="text-[#c2a675] font-semibold">{rel.readingTimeMinutes} min read</span>
                        </div>
                        <h3 className="text-base font-bold font-serif text-[#0b192c] dark:text-white leading-snug group-hover:text-axia-slate transition-colors mb-2.5 line-clamp-2">
                          <Link to={`/blogs/${rel.slug}`}>
                            {rel.title}
                          </Link>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <Link
                        to={`/blogs/${rel.slug}`}
                        className="inline-flex items-center text-xs font-mono uppercase font-semibold text-[#0b192c] dark:text-white group-hover:text-[#c2a675] transition-colors"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

            </div>
          </section>
        )}

        {/* CTA Band to /contact */}
        <section className="w-full py-16 sm:py-20 bg-[#0b192c] text-white relative overflow-hidden border-t border-slate-800">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#c2a675] uppercase font-semibold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#c2a675]" />
                PARTNER WITH AXIA KAIROS
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Turn strategic insights into enterprise outcomes.
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
                Connect directly with our senior consulting partners to explore how modern digital foundations accelerate performance.
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

export default BlogPostDetailPage;
