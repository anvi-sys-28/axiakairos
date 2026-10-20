import React from 'react';
import TicketStubFooter from './ui/ticket-stub-footer';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      <TicketStubFooter
        brand="Axia Kairos"
        wordmark="Axia Kairos"
        company="Axia Kairos Consulting Inc."
        year={2026}
        eyebrow={[
          "Strategy that moves you forward",
          "Empowering global enterprises to scale",
          "Cloud · Data Architecture · SAP · Automation",
        ]}
        headline={["Strategy that", "moves you forward."]}
        description="Axia Kairos is an elite digital consultancy partnering with visionary enterprises to modernize cloud infrastructure, optimize SAP ecosystems, engineer data intelligence, and automate business processes."
        cta={{ label: "Talk to Us", href: "/contact" }}
        sections={[
          { label: "Overview", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Services", href: "/services" },
          { label: "Cloud Platforms", href: "/services/cloud-platform-modernization" },
          { label: "Data & Analytics", href: "/services/data-engineering-and-analytics" },
          { label: "SAP Advisory", href: "/services/sap-implementation-advisory-and-support" },
          { label: "Cyber Security", href: "/services/cyber-security-services" },
          { label: "Contact", href: "/contact" },
        ]}
        linkGroups={[
          {
            title: "Capabilities",
            links: [
              { label: "Cloud Modernization", href: "/services/cloud-platform-modernization" },
              { label: "Data & Analytics", href: "/services/data-engineering-and-analytics" },
              { label: "SAP Advisory", href: "/services/sap-implementation-advisory-and-support" },
              { label: "Process Automation", href: "/services/business-process-automation" },
              { label: "Cyber Security", href: "/services/cyber-security-services" },
              { label: "All 12 Capabilities", href: "/services" },
            ],
          },
          {
            title: "Organization",
            links: [
              { label: "About Us", href: "/about" },
              { label: "Leadership Roster", href: "/about" },
              { label: "Our Approach", href: "/#approach" },
              { label: "Insights & Research", href: "/blogs" },
              { label: "Careers", href: "/careers" },
              { label: "Contact", href: "/contact" },
            ],
          },
        ]}
        statusLabels={["Operations Live", "Advisory Active"]}
        statusCaption="Global operations center active 24/7 across North America, EMEA & APAC"
        blurb="Axia Kairos delivers measurable transformation, resilient cloud platforms, and data architectures engineered for sustained high performance."
        legal={[
          { label: "Privacy Policy", href: "/#privacy" },
          { label: "Terms of Service", href: "/#terms" },
          { label: "Security & Compliance", href: "/#security" },
          { label: "Cookie Preferences" },
        ]}
        background="#071325"
        ink="#f8fafc"
        muted="#8da0b8"
        accent="#c2a675"
        accentDeep="#9f824e"
        accentInk="#071325"
        halftone={true}
      />
    </div>
  );
};

export default Footer;
