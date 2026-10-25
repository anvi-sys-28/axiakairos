import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import ContactWithGlobe, { CONTACT_LINKS } from '../components/ui/contact-with-globe';

export function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      {/* SEO & Meta Tags */}
      <SEO
        title="Contact Us | Axia Kairos Enterprise Advisory"
        description="Connect with Axia Kairos principal consultants for enterprise digital transformation, cloud architecture, data engineering, and SAP advisory."
        canonicalUrl="https://axiakairos.com/contact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Axia Kairos',
            description: 'Get in touch with Axia Kairos enterprise consultants.',
            url: 'https://axiakairos.com/contact',
          },
        ]}
      />

      {/* Floating Island Navigation Header */}
      <Header />

      {/* Main Content: Contact with Interactive 3D Wireframe Globe */}
      <main className="w-full flex-1 flex flex-col pt-20 sm:pt-24">
        <ContactWithGlobe
          title="Let's build what's next."
          subtitle="CONTACT AXIA KAIROS"
          description="Reach our global advisory team across North America, EMEA, and APAC. Connect with a principal consultant to discuss your strategic enterprise initiatives."
          contactLinks={CONTACT_LINKS}
        />
      </main>

      {/* Shared Ticket Stub Footer */}
      <Footer />
    </div>
  );
}

export default ContactPage;
