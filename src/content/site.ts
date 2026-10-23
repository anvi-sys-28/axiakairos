import heroImage from '../assets/hero.webp';
import heroSlide2Image from '../assets/hero-slide-2.webp';
import heroSlide3Image from '../assets/hero-slide-3.webp';

import microsoftLogo from '../assets/logos/microsoft.svg';
import sapLogo from '../assets/logos/sap.svg';
import deloitteLogo from '../assets/logos/deloitte.svg';
import pwcLogo from '../assets/logos/pwc.svg';
import hsbcLogo from '../assets/logos/hsbc.svg';
import kpmgLogo from '../assets/logos/kpmg.svg';
import accentureLogo from '../assets/logos/accenture.svg';

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceCardItem {
  number: string;
  title: string;
  descriptionLine1: string;
  descriptionLine2: string;
  href: string;
}

export interface TrustedLogoItem {
  name: string;
  src: string;
  alt: string;
}

export interface HeroSlide {
  id: number;
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  subtextLine1: string;
  subtextLine2: string;
  searchPlaceholder: string;
  verticalLabels: string[];
  image: string;
  isPlaceholder?: boolean;
}

const defaultHeader = {
  logo: {
    brand: "AXIA",
    trademark: "",
    sub: "KAIROS"
  },
  navLinks: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Careers", href: "/careers" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],
  cta: {
    label: "Talk to Us",
    href: "/contact"
  }
};

const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "BUSINESS · TECHNOLOGY · PEOPLE",
    headlineLine1: "Strategy that",
    headlineLine2: "moves you forward.",
    searchPlaceholder: "Search for a service...",
    subtextLine1: "We help organisations navigate complexity,",
    subtextLine2: "make confident decisions and build lasting progress.",
    verticalLabels: ["INSIGHT", "PEOPLE", "TECHNOLOGY", "IMPACT"],
    image: heroImage,
  },
  {
    id: 2,
    eyebrow: "TRANSFORMATION · ARCHITECTURE · VALUE",
    headlineLine1: "Insight that",
    headlineLine2: "shapes tomorrow.",
    searchPlaceholder: "Search capabilities & insights...",
    subtextLine1: "Pioneering sustainable digital foundations,",
    subtextLine2: "accelerating enterprise agility across markets.",
    verticalLabels: ["VISION", "VELOCITY", "RESILIENCE", "GROWTH"],
    image: heroSlide2Image,
    isPlaceholder: true,
  },
  {
    id: 3,
    eyebrow: "INNOVATION · SYSTEMS · PURPOSE",
    headlineLine1: "Execution that",
    headlineLine2: "defines excellence.",
    searchPlaceholder: "Explore our global cases...",
    subtextLine1: "Connecting strategic vision with delivery,",
    subtextLine2: "empowering teams to lead industry disruption.",
    verticalLabels: ["DISCOVER", "INTEGRATE", "EVOLVE", "LEAD"],
    image: heroSlide3Image,
    isPlaceholder: true,
  }
];

export const siteContent = {
  get header() {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('axia_cms_content_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.navbar) {
            return {
              logo: {
                brand: parsed.navbar.brand || defaultHeader.logo.brand,
                trademark: parsed.navbar.trademark !== undefined ? parsed.navbar.trademark : defaultHeader.logo.trademark,
                sub: parsed.navbar.sub || defaultHeader.logo.sub
              },
              navLinks: parsed.navbar.navLinks || defaultHeader.navLinks,
              cta: {
                label: parsed.navbar.ctaLabel || defaultHeader.cta.label,
                href: parsed.navbar.ctaHref || defaultHeader.cta.href
              }
            };
          }
        }
      } catch {}
    }
    return defaultHeader;
  },

  get hero() {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('axia_cms_content_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.homePage?.heroSection) {
            const h = parsed.homePage.heroSection;
            return {
              slides: [
                {
                  id: 1,
                  eyebrow: h.eyebrow || defaultSlides[0].eyebrow,
                  headlineLine1: h.header1 || defaultSlides[0].headlineLine1,
                  headlineLine2: h.header2 || defaultSlides[0].headlineLine2,
                  searchPlaceholder: h.searchPlaceholder || defaultSlides[0].searchPlaceholder,
                  subtextLine1: h.subtext1 || defaultSlides[0].subtextLine1,
                  subtextLine2: h.subtext2 || defaultSlides[0].subtextLine2,
                  verticalLabels: h.verticalLabels || defaultSlides[0].verticalLabels,
                  image: h.heroImage || defaultSlides[0].image,
                },
                ...defaultSlides.slice(1)
              ]
            };
          }
        }
      } catch {}
    }
    return { slides: defaultSlides };
  },

  services: [
    {
      number: "01",
      title: "Consulting & Strategy",
      descriptionLine1: "Turn ambition into",
      descriptionLine2: "measurable outcomes.",
      href: "#consulting"
    },
    {
      number: "02",
      title: "Technology Solutions",
      descriptionLine1: "Modernise, integrate",
      descriptionLine2: "and scale with confidence.",
      href: "#technology"
    },
    {
      number: "03",
      title: "People & Transformation",
      descriptionLine1: "Enable change that",
      descriptionLine2: "lasts.",
      href: "#transformation"
    }
  ] as ServiceCardItem[],

  trustedBy: {
    heading: "TRUSTED BY GLOBAL ORGANISATIONS",
    logos: [
      { name: "Microsoft", src: microsoftLogo, alt: "Microsoft" },
      { name: "SAP", src: sapLogo, alt: "SAP" },
      { name: "Deloitte", src: deloitteLogo, alt: "Deloitte" },
      { name: "PwC", src: pwcLogo, alt: "PwC" },
      { name: "HSBC", src: hsbcLogo, alt: "HSBC" },
      { name: "KPMG", src: kpmgLogo, alt: "KPMG" },
      { name: "Accenture", src: accentureLogo, alt: "Accenture" },
    ] as TrustedLogoItem[]
  }
};
