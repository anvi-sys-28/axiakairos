"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FaqSectionsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  faqs?: FAQItem[];
  className?: string;
}

export const defaultFaqs: FAQItem[] = [
  {
    question: "What enterprise modernization services does Axia Kairos provide?",
    answer:
      "Axia Kairos specializes in end-to-end management consulting and digital transformation, including SAP S/4HANA migrations, cloud platform modernization (AWS, Azure, GCP), enterprise AI and automation, data engineering, and 24/7 managed IT services.",
  },
  {
    question: "How does Axia Kairos approach SAP S/4HANA migration?",
    answer:
      "We leverage proven greenfield, brownfield, and selective data transition methodologies combined with SAP Business Technology Platform (BTP). Our phased approach minimizes operational disruption and guarantees business continuity.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We serve 12 global mission-critical sectors including BFSI, Manufacturing & Automotive, Aviation & Aerospace, Healthcare & Life Sciences, Energy & Utilities, E-Commerce & Retail, FinTech, and Public Sector.",
  },
  {
    question: "How do you ensure enterprise data governance and cyber security?",
    answer:
      "Our architectures incorporate zero-trust security principles, strict regulatory compliance (SOC 2, ISO 27001, HIPAA, GDPR), automated audit trails, and proactive 24/7 SOC infrastructure monitoring.",
  },
  {
    question: "How can our enterprise initiate an engagement with Axia Kairos?",
    answer:
      "You can request an initial architectural assessment through our contact page or speak directly with our domain practice leaders to evaluate your roadmap, scope, and timeline.",
  },
];

export const FaqSections = ({
  eyebrow = "FAQ'S",
  title = "Looking for answer?",
  description = "Explore frequently asked questions about our enterprise consulting services, SAP modernization methodologies, and technical delivery frameworks.",
  imageSrc = "/assets/careers_team.webp",
  faqs = defaultFaqs,
  className,
}: FaqSectionsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-12 xl:gap-16 py-6 sm:py-8",
        className
      )}
    >
      {/* Left Media Column - Prominent rectangular showcase ("rectable and little big") */}
      <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0">
        <div className="relative group w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-100 dark:bg-[#0c1421]">
          <img
            className="w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[440px] object-cover transition-transform duration-500 group-hover:scale-105"
            src={imageSrc}
            alt="Axia Kairos Enterprise Advisory"
            width={600}
            height={440}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/card_sunset.webp";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 inset-x-6 text-white">
            <span className="font-mono text-[#c2a675] tracking-[0.2em] text-[11px] uppercase block mb-1">
              HAVE MORE QUESTIONS?
            </span>
            <p className="text-sm text-slate-200 font-medium leading-snug">
              Our enterprise advisory leads are available 24/7 to assist with your transformation roadmap.
            </p>
          </div>
        </div>
      </div>

      {/* Right Accordion Column */}
      <div className="flex-1 w-full max-w-2xl">
        <p className="text-[#c2a675] text-xs sm:text-sm font-semibold tracking-widest uppercase font-mono mb-1.5">
          {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0b192c] dark:text-white">
          {title}
        </h2>
        <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 mt-2 pb-5 leading-relaxed">
          {description}
        </p>

        <div className="divide-y divide-slate-200 dark:divide-white/10 border-t border-slate-200 dark:border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                className="py-4 sm:py-5 cursor-pointer select-none group transition-colors"
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3
                    className={cn(
                      "text-base sm:text-[17px] font-semibold transition-colors leading-snug",
                      isOpen
                        ? "text-[#c2a675] dark:text-[#c2a675]"
                        : "text-[#0b192c] dark:text-white group-hover:text-[#c2a675] dark:group-hover:text-[#c2a675]"
                    )}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300",
                      isOpen
                        ? "bg-[#c2a675] text-[#05080e] border-[#c2a675] rotate-180"
                        : "border-slate-300 dark:border-white/20 text-slate-500 dark:text-slate-400 group-hover:border-[#c2a675]"
                    )}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isOpen
                      ? "opacity-100 max-h-[400px] translate-y-0 pt-3"
                      : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"
                  )}
                >
                  <p className="text-sm sm:text-[14.5px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FaqSections;
