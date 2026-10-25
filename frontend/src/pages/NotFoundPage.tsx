import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <Header onCtaClick={() => (window.location.href = '/#contact')} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-32">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c2a675] font-semibold mb-3">
          ERROR 404
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0b192c] dark:text-white tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mb-8">
          The page you are looking for doesn’t exist or has been moved. Explore our core services or return to the homepage.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Browse All Services</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-2.5 rounded-full border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <span>Home</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFoundPage;
