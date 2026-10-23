import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Factory,
  Landmark,
  Plane,
  ShoppingCart,
  GraduationCap,
  Building2,
  Zap,
  Heart,
  CreditCard,
  Fuel,
  Pill,
  Radio,
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { ElasticReel, type ElasticReelItem } from './ui/elastic-reel';

export interface IndustryData extends ElasticReelItem {
  headline: string;
  longDescription: string;
  focusAreas: string[];
  impactMetric: {
    value: string;
    label: string;
  };
  caseStudySlug?: string;
}

export const INDUSTRIES_DATA: IndustryData[] = [
  {
    id: "automotive-manufacturing",
    title: "Automotive & Manufacturing",
    tag: "SMART FACTORY & IOT",
    headline: "Intelligent Manufacturing & Connected Automotive Ecosystems",
    longDescription:
      "Accelerating smart factory initiatives, Industry 4.0 automation, connected vehicle telemetry, and resilient supply chain logistics through SAP S/4HANA Manufacturing, predictive maintenance, and edge IoT analytics.",
    shortDescription:
      "Industry 4.0 automation, connected vehicle telemetry, and predictive maintenance ERP.",
    focusAreas: [
      "SAP Digital Manufacturing & Shop-Floor Execution",
      "Predictive Maintenance & Computer Vision QA",
      "Resilient Multi-Tier Automotive Supply Chain"
    ],
    impactMetric: {
      value: "38%",
      label: "Reduction in unplanned machine downtime"
    },
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Factory className="w-5 h-5 text-[#c2a675]" />,
    caseStudySlug: "manufacturing-automation-sap-btp"
  },
  {
    id: "bfsi",
    title: "Banking, Financial Services, & Insurance",
    tag: "CORE BANKING & RISK",
    headline: "Resilient Financial Architectures & Zero-Downtime Modernization",
    longDescription:
      "Modernizing core banking ledgers, automated compliance reporting, AI fraud intelligence, and seamless digital customer experiences with mission-critical security and zero-downtime database migration.",
    shortDescription:
      "Core banking modernization, real-time fraud intelligence, and automated compliance.",
    focusAreas: [
      "Core Banking Cloud & Ledger Modernization",
      "Real-Time Fraud Prevention & AML Pipelines",
      "Basel III & Regulatory Compliance Automation"
    ],
    impactMetric: {
      value: "99.999%",
      label: "Platform uptime across transactional ledgers"
    },
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Landmark className="w-5 h-5 text-sky-400" />,
    caseStudySlug: "sap-s4hana-migration-bfsi"
  },
  {
    id: "aviation-aerospace",
    title: "Aviation & Aerospace",
    tag: "FLEET & MRO LOGISTICS",
    headline: "Mission-Critical Aviation Operations & Defense-Grade Traceability",
    longDescription:
      "Optimizing complex fleet maintenance scheduling (MRO), air cargo telemetry, passenger journey digital orchestration, and multi-tier component traceability with defense-grade compliance.",
    shortDescription:
      "Fleet maintenance (MRO), air cargo telemetry, and digitized passenger journeys.",
    focusAreas: [
      "Aviation MRO Scheduling & Component Tracking",
      "Air Cargo Telemetry & Turnaround Optimization",
      "Unified Passenger Data & Digital Loyalty Platforms"
    ],
    impactMetric: {
      value: "28%",
      label: "Faster aircraft turnaround & MRO dispatch"
    },
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Plane className="w-5 h-5 text-indigo-400" />,
    caseStudySlug: "logistics-sap-automation-integration"
  },
  {
    id: "ecommerce-retail",
    title: "E-commerce & Retail",
    tag: "OMNICHANNEL COMMERCE",
    headline: "High-Throughput Omnichannel Fulfillment & Headless Retail",
    longDescription:
      "Scaling high-throughput omnichannel commerce hubs, headless storefronts, dynamic pricing microservices, and AI-driven personalization engines that convert digital shoppers into brand advocates.",
    shortDescription:
      "Omnichannel commerce hubs, headless storefronts, and automated inventory fulfillment.",
    focusAreas: [
      "Headless Storefronts & Microservice Architectures",
      "Dynamic Pricing & Automated Inventory Fulfillment",
      "Predictive Customer Personalization & Churn Prevention"
    ],
    impactMetric: {
      value: "3.2x",
      label: "Peak holiday checkout velocity & scale"
    },
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <ShoppingCart className="w-5 h-5 text-emerald-400" />,
    caseStudySlug: "cloud-modernization-retail"
  },
  {
    id: "education-learning",
    title: "Education & Learning",
    tag: "EDTECH & INSTITUTIONAL",
    headline: "Next-Gen Higher Education Portals & Adaptive Learning Platforms",
    longDescription:
      "Empowering global universities and corporate training academies with high-concurrency cloud LMS architectures, predictive student analytics, and seamless administrative automation.",
    shortDescription:
      "Cloud LMS architectures, student retention analytics, and administrative automation.",
    focusAreas: [
      "Scalable Cloud LMS & Virtual Campus Infrastructure",
      "Predictive Student Retention & Graduation Modeling",
      "Unified Student Information System (SIS) Modernization"
    ],
    impactMetric: {
      value: "500k+",
      label: "Concurrent active learners supported globally"
    },
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <GraduationCap className="w-5 h-5 text-amber-400" />
  },
  {
    id: "egovernance-public-sector",
    title: "E-Governance & Public Sector",
    tag: "CIVIC TECH & SOVEREIGNTY",
    headline: "Citizen-Centric Digital Gateways & Sovereign Cloud Operations",
    longDescription:
      "Delivering frictionless citizen service portals, inter-agency data exchange backbones, automated benefits distribution, and audit-proof sovereign cloud infrastructure.",
    shortDescription:
      "Citizen service portals, inter-agency data sharing, and sovereign cloud deployments.",
    focusAreas: [
      "Unified Citizen Service Gateways & Mobile IDs",
      "Sovereign Multi-Cloud & Zero-Trust Governance",
      "Automated Public Welfare & Grants Distribution"
    ],
    impactMetric: {
      value: "100%",
      label: "Compliance with sovereign security frameworks"
    },
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Building2 className="w-5 h-5 text-cyan-400" />,
    caseStudySlug: "public-sector-data-analytics-automation"
  },
  {
    id: "energy-utilities",
    title: "Energy & Utilities",
    tag: "CLEAN GRID & ASSETS",
    headline: "Smart Grid Intelligence & Renewable Transition Operations",
    longDescription:
      "Enabling smart grid telemetry, renewable asset condition monitoring, high-frequency utility meter billing, and regulatory carbon footprint tracking for forward-thinking power providers.",
    shortDescription:
      "Smart grid telemetry, renewable asset management, and high-frequency utility billing.",
    focusAreas: [
      "Smart Meter & Grid Telemetry Orchestration",
      "Renewable Asset Lifecycle & Field Service Automation",
      "SAP Utilities (IS-U) & S/4HANA Modernization"
    ],
    impactMetric: {
      value: "42%",
      label: "Faster outage localization & grid restoration"
    },
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    caseStudySlug: "sap-s-4-hana-migration-and-data-governance-modernization-for-a-global-energy-and-utilities-enterprise"
  },
  {
    id: "healthcare-life-sciences",
    title: "Healthcare & Life Sciences",
    tag: "CLINICAL & PATIENT DATA",
    headline: "FHIR-Compliant Healthcare Interoperability & Clinical Intelligence",
    longDescription:
      "Transforming clinical care delivery with HIPAA/HL7 FHIR compliant interoperability backbones, clinical data lakes, electronic health record (EHR) modernizations, and hospital operational efficiency.",
    shortDescription:
      "HIPAA/FHIR interoperability, clinical data lakes, and hospital operational analytics.",
    focusAreas: [
      "FHIR / HL7 Interoperability & Data Pipelines",
      "Clinical Trials Analytics & Research Lakes",
      "Healthcare Enterprise ERP & Supply Assurance"
    ],
    impactMetric: {
      value: "99.9%",
      label: "Clinical record integration accuracy & privacy"
    },
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Heart className="w-5 h-5 text-rose-400" />,
    caseStudySlug: "healthcare-data-integration-sap-btp"
  },
  {
    id: "lending-fintech",
    title: "Lending & FinTech",
    tag: "ALGORITHMIC UNDERWRITING",
    headline: "High-Speed Alternative Credit Underwriting & Open Banking",
    longDescription:
      "Powering algorithmic credit decisioning engines, instant digital KYC onboarding, open banking API integrations, and real-time fraud mitigation for high-growth neo-lenders and digital banks.",
    shortDescription:
      "Algorithmic credit decisioning, instant KYC onboarding, and open banking APIs.",
    focusAreas: [
      "Sub-Minute Loan Underwriting & Scoring Pipelines",
      "Open Banking PSD2 / Open API Gateways",
      "Instant KYC, AML & Sanctions Screening"
    ],
    impactMetric: {
      value: "<45s",
      label: "Automated underwriting turnaround time"
    },
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <CreditCard className="w-5 h-5 text-teal-400" />
  },
  {
    id: "oil-gas",
    title: "Oil & Gas",
    tag: "UPSTREAM & DOWNSTREAM",
    headline: "Predictive Asset Integrity & Upstream Energy Digitization",
    longDescription:
      "Delivering precision upstream IoT telemetry, automated refinery logistics, predictive pipeline integrity diagnostics, and digital health, safety & environment (HSE) governance.",
    shortDescription:
      "Upstream IoT telemetry, refinery process automation, and digital HSE governance.",
    focusAreas: [
      "Upstream Well Telemetry & Remote Monitoring",
      "Refinery Process Automation & Asset Integrity",
      "Digital HSE Compliance & Incident Prevention"
    ],
    impactMetric: {
      value: "26%",
      label: "Reduction in field asset maintenance OPEX"
    },
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Fuel className="w-5 h-5 text-orange-400" />
  },
  {
    id: "pharma-biotech",
    title: "Pharmaceuticals & Biotechnology",
    tag: "GXP & CLINICAL TRIALS",
    headline: "GxP Validated Life Science Data & Precision Cold Chain Traceability",
    longDescription:
      "Architecting FDA 21 CFR Part 11 validated quality architectures, serialized pharmaceutical track-and-trace systems, and clinical trial data platforms accelerating therapies from lab to market.",
    shortDescription:
      "GxP validation, serialized track-and-trace, and clinical data compliance.",
    focusAreas: [
      "FDA 21 CFR Part 11 & GxP Quality Systems",
      "Global Serialization & Track-and-Trace Compliance",
      "Clinical Trial Analytics & Drug Pipeline Lakes"
    ],
    impactMetric: {
      value: "100%",
      label: "GxP and FDA regulatory audit validation"
    },
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Pill className="w-5 h-5 text-purple-400" />,
    caseStudySlug: "pharma-data-compliance-automation"
  },
  {
    id: "telecom-media",
    title: "Telecommunications & Media",
    tag: "5G & LOW-LATENCY STREAMING",
    headline: "5G Network Automation & Low-Latency Digital Media Ecosystems",
    longDescription:
      "Building carrier-grade 5G network slicing orchestration, automated OSS/BSS subscriber platforms, multi-CDN media delivery backbones, and predictive customer churn prevention models.",
    shortDescription:
      "5G network automation, OSS/BSS billing modernization, and low-latency streaming CDN.",
    focusAreas: [
      "5G Core & Network Slicing Orchestration",
      "Modern OSS/BSS Subscriber Billing Transformation",
      "Low-Latency Content Distribution & Media Lakes"
    ],
    impactMetric: {
      value: "10M+",
      label: "Concurrent streaming subscribers sustained"
    },
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "/assets/card_sunset.webp",
    icon: <Radio className="w-5 h-5 text-blue-400" />,
    caseStudySlug: "cloud-modernization-telecom"
  }
];

export function IndustriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndustry = INDUSTRIES_DATA[activeIndex];
  const navigate = useNavigate();

  const handleConsultation = () => {
    navigate('/contact');
  };

  return (
    <section
      id="industries-we-serve"
      aria-label="Industries We Serve"
      className="w-full bg-[#f8f9fb] dark:bg-[#05080e] text-[#0b192c] dark:text-white py-20 sm:py-24 lg:py-28 scroll-mt-28 border-t border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative ambient background glows - CSS radial gradients for 60fps rendering without blur-filter GPU rasterization */}
      <div 
        className="absolute top-0 right-1/4 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(194, 166, 117, 0.05) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-0 left-10 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 font-mono text-[#c2a675] tracking-[0.2em] text-[11px] sm:text-[12px] uppercase mb-3 select-none">
              <span className="w-2 h-2 rounded-full bg-[#c2a675] inline-block shadow-[0_0_8px_rgba(194,166,117,0.7)]" />
              <span>INDUSTRIES WE SERVE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0b192c] dark:text-white tracking-tight leading-[1.12]">
              Specialized Transformation for Mission-Critical Sectors
            </h2>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-[14.5px] sm:text-[15.5px] max-w-md leading-relaxed">
            Deep domain expertise across 12 regulated and fast-evolving global industries. We deliver purpose-engineered technology architectures that drive measurable enterprise impact.
          </p>
        </div>

        {/* Two-Column Grid: Left (Synced Descriptions) & Right (Elastic Reel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
          
          {/* ========================================================
              LEFT COLUMN (lg:col-span-5): Synchronized Industry Detail
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-center min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndustry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col space-y-6"
              >
                {/* Hexagon Domain Badge & Eyebrow */}
                <div className="flex items-center space-x-4">
                  {/* Hexagon Shape wrapper matching reference image */}
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-100 dark:text-[#141e2a] drop-shadow-md">
                      <polygon
                        points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                        fill="currentColor"
                        stroke="#c2a675"
                        strokeWidth="2.5"
                        strokeOpacity="0.7"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-slate-800 dark:text-white">
                      {activeIndustry.icon}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-mono text-[#c2a675] tracking-[0.18em] text-[11px] uppercase">
                      {activeIndustry.tag}
                    </span>
                    <span className="font-bold text-[#0b192c] dark:text-white text-[17px] sm:text-[18px]">
                      {activeIndustry.title}
                    </span>
                  </div>
                </div>

                {/* Main Headline */}
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0b192c] dark:text-white tracking-tight leading-snug">
                  {activeIndustry.headline}
                </h3>

                {/* Long Form Tailored Description */}
                <p className="text-slate-600 dark:text-slate-300 text-[14.5px] sm:text-[15.5px] leading-relaxed">
                  {activeIndustry.longDescription}
                </p>

                {/* Key Strategic Focus Bullets */}
                <div className="space-y-2.5 pt-1">
                  {activeIndustry.focusAreas.map((focus, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-[13.5px] sm:text-[14px] text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#c2a675] shrink-0 mt-0.5" />
                      <span>{focus}</span>
                    </div>
                  ))}
                </div>

                {/* Impact Metric Strip */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#c2a675]/15 border border-[#c2a675]/30 flex items-center justify-center text-[#c2a675] shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-[#0b192c] dark:text-white tracking-tight">
                      {activeIndustry.impactMetric.value}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] sm:text-[12px] tracking-wide">
                      {activeIndustry.impactMetric.label}
                    </div>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleConsultation}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#fae092] via-[#e5b955] to-[#c29637] text-[#05080e] font-semibold text-[13.5px] tracking-wide shadow-[0_4px_20px_rgba(229,185,85,0.35)] hover:shadow-[0_4px_28px_rgba(229,185,85,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Consult with Domain Leads</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {activeIndustry.caseStudySlug && (
                    <Link
                      to={`/case-studies/${activeIndustry.caseStudySlug}`}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white font-medium text-[13.5px] transition-all hover:border-slate-400 dark:hover:border-white/30 shadow-sm"
                    >
                      <span>View Case Study</span>
                    </Link>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ========================================================
              RIGHT COLUMN (lg:col-span-7): The Elastic Reel Dock
              ======================================================== */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-full rounded-3xl p-3 sm:p-5 bg-white dark:bg-gradient-to-b dark:from-[#080d16] dark:to-[#04060b] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
              
              {/* Subtle Ambient Glow */}
              <div 
                className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(194, 166, 117, 0.08) 0%, transparent 70%)' }}
              />

              {/* Header Label inside dock frame */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-200 dark:border-white/10 mb-2">
                <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#c2a675] inline-block shadow-[0_0_8px_rgba(194,166,117,0.7)]" />
                  <span>INTERACTIVE INDUSTRY REEL</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  HOVER OR CLICK SLICE TO EXPAND
                </div>
              </div>

              {/* React Bits Pro Elastic Reel Component */}
              <ElasticReel
                items={INDUSTRIES_DATA}
                activeIndex={activeIndex}
                onActiveChange={setActiveIndex}
                autoplay={true}
                autoplayInterval={5500}
              />
            </div>
          </div>

        </div>

        {/* Quick Industry Navigation Strip at bottom - Clean text pills without emojis/icons */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-white/10">
          <div className="text-center font-mono text-[11px] tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 mb-6">
            ALL 12 ENTERPRISE DOMAINS · QUICK NAVIGATION
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto">
            {INDUSTRIES_DATA.map((ind, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-[12px] sm:text-[12.5px] font-medium transition-all duration-200 cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#c2a675] text-[#05080e] font-semibold shadow-[0_0_15px_rgba(194,166,117,0.4)] scale-105"
                      : "bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white border border-slate-300 dark:border-white/10 shadow-sm"
                  }`}
                >
                  <span>{ind.title}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default IndustriesSection;
