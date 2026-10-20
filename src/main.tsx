import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { ScrollToTop } from './components/ScrollToTop';
import { Preloader } from './components/Preloader';
import './styles/index.css';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesIndexPage = lazy(() => import('./pages/ServicesIndexPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const CaseStudiesIndexPage = lazy(() => import('./pages/CaseStudiesIndexPage'));
const CaseStudyDetailPage = lazy(() => import('./pages/CaseStudyDetailPage'));
const BlogsIndexPage = lazy(() => import('./pages/BlogsIndexPage'));
const BlogPostDetailPage = lazy(() => import('./pages/BlogPostDetailPage'));
const CareersLandingPage = lazy(() => import('./pages/CareersLandingPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AssistantPage = lazy(() => import('./features/assistant/AssistantPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
import { AssistantLauncher } from './features/assistant/AssistantLauncher';

const RouteLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#05080e]">
    <div className="w-8 h-8 rounded-full border-2 border-[#0b192c] dark:border-white border-t-transparent animate-spin" />
  </div>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Preloader />
      <ScrollToTop />
      <AssistantLauncher />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesIndexPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/case-studies" element={<CaseStudiesIndexPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="/blogs" element={<BlogsIndexPage />} />
          <Route path="/blogs/:slug" element={<BlogPostDetailPage />} />
          <Route path="/careers" element={<CareersLandingPage />} />
          <Route path="/careers/:slug" element={<JobDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
);
