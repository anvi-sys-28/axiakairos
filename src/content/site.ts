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

export const siteContent = {
  header: {
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
  },

  hero: {
    slides: [
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
        // TODO: Client copy for slide 2 placeholder
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
        // TODO: Client copy for slide 3 placeholder
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
    ] as HeroSlide[],
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
