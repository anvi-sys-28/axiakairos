import FaqSections from './ui/faq-sections';

export function FAQSection() {
  return (
    <section
      id="faqs"
      aria-label="Frequently Asked Questions"
      className="w-full bg-white dark:bg-[#05080e] text-[#0b192c] dark:text-white py-16 sm:py-20 lg:py-24 border-t border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative ambient background gradient without blur-filter overhead */}
      <div 
        className="absolute top-1/2 left-0 w-96 h-96 pointer-events-none -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(194, 166, 117, 0.04) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-0 right-10 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 70%)' }}
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <FaqSections />
      </div>
    </section>
  );
}

export default FAQSection;
