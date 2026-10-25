import { useState, useEffect } from 'react';
import { siteContent as defaultSiteContent } from '@/content/site';
import { aboutData as defaultAboutData } from '@/data/about';
import { contactData as defaultContactData } from '@/data/contact';
import { approachData as defaultApproachData } from '@/data/approach';
import { industries as defaultIndustries, type Industry } from '@/data/industries';
import { legalData as defaultLegalData } from '@/data/legal';
import { products as defaultProducts, type Product } from '@/data/products';
import { servicesData as defaultServicesData, type Service } from '@/data/services';
import { caseStudies as defaultCaseStudies, type CaseStudyItem } from '@/data/caseStudies';
import { blogs as defaultBlogs, type BlogPost } from '@/data/blogs';
import { jobs as defaultJobs, type Job } from '@/data/jobs';

export const CMS_STORAGE_KEY = 'axia_cms_content_v1';
export const CMS_UPDATE_EVENT = 'axia-cms-update';

export interface CMSData {
  documentId: string;
  lastPublished: string;
  status: 'draft' | 'published';
  homePage: {
    heroSection: {
      header1: string;
      header2: string;
      description: string;
      heroImage: string;
      heroImageAltText: string;
      eyebrow: string;
      searchPlaceholder: string;
      subtext1: string;
      subtext2: string;
      verticalLabels: string[];
    };
    servicesOverview: {
      heading: string;
      tagline: string;
    };
    trustedByHeading: string;
  };
  navbar: {
    brand: string;
    trademark: string;
    sub: string;
    ctaLabel: string;
    ctaHref: string;
    navLinks: Array<{ label: string; href: string }>;
  };
  footer: {
    copyright: string;
    tagline: string;
    email: string;
    phone: string;
    columns: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
  };
  aboutUsPage: typeof defaultAboutData;
  contactPage: typeof defaultContactData;
  ourApproachPage: typeof defaultApproachData;
  industryPage: Industry[];
  privacyPolicyPage: typeof defaultLegalData.privacyPolicy;
  termsAndConditionPage: typeof defaultLegalData.termsAndConditions;
  productPage: Product[];
  robot: {
    name: string;
    avatarUrl: string;
    status: 'online' | 'offline';
    welcomeMessage: string;
    systemPrompt: string;
    quickReplies: string[];
  };
  llm: {
    model: string;
    provider?: 'openai' | 'anthropic';
    temperature: number;
    maxTokens: number;
    searchEnabled: boolean;
    groundednessThreshold: number;
  };
  redirect: Array<{ from: string; to: string; permanent: boolean }>;
  sitemap: Array<{ url: string; priority: number; changefreq: string }>;
  users: Array<{ id: string; username: string; role: string; email: string; active: boolean }>;
  services: Service[];
  caseStudies: CaseStudyItem[];
  blogs: BlogPost[];
  careers: Job[];
}

export const getDefaultCMSData = (): CMSData => ({
  documentId: 'w6nq1d9lvh2ps3opmnoa1tjr',
  lastPublished: new Date().toISOString(),
  status: 'published',
  homePage: {
    heroSection: {
      header1: defaultSiteContent.hero.slides[0]?.headlineLine1 || 'Strategy that',
      header2: defaultSiteContent.hero.slides[0]?.headlineLine2 || 'moves you forward.',
      description:
        'Axia Kairos is a global consulting partner specializing in enterprise transformation, cloud modernization, data engineering, automation, and intelligent technologies. We help organizations simplify complexity, modernize operations, and build lasting competitive advantage.',
      heroImage: defaultSiteContent.hero.slides[0]?.image || '/assets/hero.webp',
      heroImageAltText: 'HeroImage',
      eyebrow: defaultSiteContent.hero.slides[0]?.eyebrow || 'BUSINESS · TECHNOLOGY · PEOPLE',
      searchPlaceholder: defaultSiteContent.hero.slides[0]?.searchPlaceholder || 'Search for a service...',
      subtext1: defaultSiteContent.hero.slides[0]?.subtextLine1 || 'We help organisations navigate complexity,',
      subtext2: defaultSiteContent.hero.slides[0]?.subtextLine2 || 'make confident decisions and build lasting progress.',
      verticalLabels: defaultSiteContent.hero.slides[0]?.verticalLabels || ['INSIGHT', 'PEOPLE', 'TECHNOLOGY', 'IMPACT'],
    },
    servicesOverview: {
      heading: 'Specialized Transformation for Mission-Critical Sectors',
      tagline: 'Deep domain expertise across 12 regulated and fast-evolving global industries.',
    },
    trustedByHeading: defaultSiteContent.trustedBy.heading,
  },
  navbar: {
    brand: defaultSiteContent.header.logo.brand,
    trademark: defaultSiteContent.header.logo.trademark,
    sub: defaultSiteContent.header.logo.sub,
    ctaLabel: defaultSiteContent.header.cta.label,
    ctaHref: defaultSiteContent.header.cta.href,
    navLinks: defaultSiteContent.header.navLinks,
  },
  footer: {
    copyright: '© 2026 AXIA KAIROS LLC. All rights reserved.',
    tagline: 'Insight that shapes tomorrow. Execution that defines excellence.',
    email: 'contact@axiakairos.com',
    phone: '+1 (800) 321-4321',
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Our Approach', href: '/#approach' },
          { label: 'Careers', href: '/careers' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Services',
        links: [
          { label: 'Consulting & Strategy', href: '/services#consulting' },
          { label: 'Technology Solutions', href: '/services#technology' },
          { label: 'People & Transformation', href: '/services#transformation' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy-policy' },
          { label: 'Terms of Service', href: '/terms-and-conditions' },
        ],
      },
    ],
  },
  aboutUsPage: defaultAboutData,
  contactPage: defaultContactData,
  ourApproachPage: defaultApproachData,
  industryPage: defaultIndustries,
  privacyPolicyPage: defaultLegalData.privacyPolicy,
  termsAndConditionPage: defaultLegalData.termsAndConditions,
  productPage: defaultProducts,
  robot: {
    name: 'AXIA Assistant',
    avatarUrl: '/c.webp',
    status: 'online',
    welcomeMessage: "Hi, I'm AXIA Assistant. Ask me about our services, case studies, industries, careers or how we work with clients.",
    systemPrompt: 'You are the official AXIA KAIROS AI Assistant...',
    quickReplies: [
      'Tell me about SAP services',
      'Show case studies',
      'How do you work with clients?',
      'Explore careers at AXIA',
    ],
  },
  llm: {
    model: 'gpt-4o-mini',
    provider: 'openai',
    temperature: 0.2,
    maxTokens: 1024,
    searchEnabled: true,
    groundednessThreshold: 0.85,
  },
  redirect: [
    { from: '/contact-us', to: '/contact', permanent: true },
    { from: '/about-us', to: '/about', permanent: true },
    { from: '/jobs', to: '/careers', permanent: true },
  ],
  sitemap: [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/about', priority: 0.9, changefreq: 'monthly' },
    { url: '/services', priority: 0.9, changefreq: 'weekly' },
    { url: '/case-studies', priority: 0.8, changefreq: 'weekly' },
    { url: '/careers', priority: 0.8, changefreq: 'daily' },
    { url: '/blogs', priority: 0.8, changefreq: 'daily' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
  ],
  users: [
    { id: 'usr-1', username: 'admin', role: 'Super Administrator', email: 'admin@axiakairos.com', active: true },
    { id: 'usr-2', username: 'editor', role: 'Content Editor', email: 'editor@axiakairos.com', active: true },
  ],
  services: defaultServicesData,
  caseStudies: defaultCaseStudies,
  blogs: defaultBlogs,
  careers: defaultJobs,
});

/**
 * Loads current CMS data from localStorage, falling back to default code definitions
 */
export function loadCMSData(): CMSData {
  if (typeof window === 'undefined') return getDefaultCMSData();

  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return getDefaultCMSData();

    const parsed = JSON.parse(raw);
    const defaults = getDefaultCMSData();
    return {
      ...defaults,
      ...parsed,
      homePage: {
        ...defaults.homePage,
        ...(parsed.homePage || {}),
        heroSection: {
          ...defaults.homePage.heroSection,
          ...(parsed.homePage?.heroSection || {}),
        },
      },
      navbar: {
        ...defaults.navbar,
        ...(parsed.navbar || {}),
      },
      footer: {
        ...defaults.footer,
        ...(parsed.footer || {}),
      },
      robot: {
        ...defaults.robot,
        ...(parsed.robot || {}),
      },
      llm: {
        ...defaults.llm,
        ...(parsed.llm || {}),
      },
    };
  } catch (err) {
    console.error('Failed to parse CMS data from localStorage:', err);
    return getDefaultCMSData();
  }
}

/**
 * Saves and publishes data to localStorage, dispatching a window event so all components react
 */
export function saveCMSData(data: CMSData): void {
  if (typeof window === 'undefined') return;
  const payload = {
    ...data,
    lastPublished: new Date().toISOString(),
    status: 'published' as const,
  };
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: payload }));
}

/**
 * Resets CMS data to original defaults
 */
export function resetCMSData(): CMSData {
  if (typeof window === 'undefined') return getDefaultCMSData();
  localStorage.removeItem(CMS_STORAGE_KEY);
  const defaults = getDefaultCMSData();
  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: defaults }));
  return defaults;
}

/**
 * Exports all CMS data as a downloadable JSON file
 */
export function exportCMSData(): void {
  const data = loadCMSData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `axiakairos-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Imports CMS data from a JSON string and publishes it
 */
export function importCMSData(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    saveCMSData(parsed);
    return true;
  } catch {
    return false;
  }
}

/**
 * React Hook to subscribe to CMS data changes across the entire app
 */
export function useCMS(): CMSData {
  const [data, setData] = useState<CMSData>(loadCMSData);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setData(e.detail);
      }
    };
    window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
  }, []);

  return data;
}

/**
 * Sync published CMS data from Railway backend to local browser state
 */
export async function syncCMSFromServer(): Promise<CMSData | null> {
  if (typeof window === 'undefined') return null;
  try {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '';
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/content`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.homePage) {
        saveCMSData(json.data);
        return json.data;
      }
    }
  } catch (e) {
    // Graceful offline fallback
  }
  return null;
}
