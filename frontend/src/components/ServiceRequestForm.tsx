import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { servicesData } from '../data/services';

const COUNTRY_DIAL_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'US / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
];

export interface ServiceFormData {
  fullName: string;
  email: string;
  company: string;
  countryCode: string;
  phone: string;
  serviceSlug: string;
  message: string;
  consent: boolean;
  source?: string;
}

// TODO: Connect production API endpoint via VITE_FORM_ENDPOINT in .env
export async function submitRequest(data: ServiceFormData): Promise<{ success: boolean; message: string }> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Server returned error status ${res.status}`);
    }
    return { success: true, message: 'Request submitted successfully.' };
  }

  // Simulated API response with network latency
  await new Promise((resolve) => setTimeout(resolve, 900));
  console.log('[Axia Kairos Service Request Submitted]:', data);
  return { success: true, message: 'Thank you. An enterprise advisor will be in touch within 24 hours.' };
}

interface ServiceRequestFormProps {
  initialServiceSlug?: string;
  source?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  initialServiceSlug = 'cloud-platform-modernization',
  source,
  badge = 'INITIATE ENGAGEMENT',
  title = 'Request an Enterprise Service',
  subtitle = 'Connect directly with an Axia Kairos principal consultant. We respect your confidentiality.',
  className = '',
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    fullName: '',
    email: '',
    company: '',
    countryCode: '+91',
    phone: '',
    serviceSlug: initialServiceSlug,
    message: '',
    consent: false,
    source,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid work email address.';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{6,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide brief details about your inquiry.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please enter at least 10 characters.';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to data processing to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setServerMessage('');

    try {
      const res = await submitRequest(formData);
      setStatus('success');
      setServerMessage(res.message);
    } catch (err: unknown) {
      setStatus('error');
      setServerMessage(err instanceof Error ? err.message : 'An error occurred while sending your request.');
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      company: '',
      countryCode: '+91',
      phone: '',
      serviceSlug: initialServiceSlug,
      message: '',
      consent: false,
      source,
    });
    setErrors({});
    setStatus('idle');
    setServerMessage('');
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`} id="request-service">
      <div className="bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-10 shadow-xl transition-colors duration-200">
        
        {/* Header */}
        <div className="mb-8">
          {badge && (
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#c2a675] font-semibold mb-2">
              {badge}
            </div>
          )}
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0b192c] dark:text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {status === 'success' ? (
          <div className="p-8 text-center flex flex-col items-center bg-slate-50 dark:bg-white/5 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-4" />
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Engagement Request Received
            </h4>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mb-6">
              {serverMessage}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {status === 'error' && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{serverMessage}</span>
              </div>
            )}

            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="form-fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="form-fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "form-fullName-error" : undefined}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-axia-slate transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-slate-300 dark:border-white/15'
                  }`}
                  placeholder="e.g. Eleanor Vance"
                />
                {errors.fullName && (
                  <p id="form-fullName-error" role="alert" className="text-red-500 text-xs mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="form-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="form-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "form-email-error" : undefined}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-axia-slate transition-all ${
                    errors.email ? 'border-red-500' : 'border-slate-300 dark:border-white/15'
                  }`}
                  placeholder="eleanor@enterprise.com"
                />
                {errors.email && (
                  <p id="form-email-error" role="alert" className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Company & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="form-company" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="form-company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? "form-company-error" : undefined}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-axia-slate transition-all ${
                    errors.company ? 'border-red-500' : 'border-slate-300 dark:border-white/15'
                  }`}
                  placeholder="Global Logistics Ltd."
                />
                {errors.company && (
                  <p id="form-company-error" role="alert" className="text-red-500 text-xs mt-1">
                    {errors.company}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="form-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <select
                    aria-label="Country code"
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="px-2.5 py-2.5 rounded-l-lg border border-r-0 border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-axia-slate"
                  >
                    {COUNTRY_DIAL_CODES.map((c) => (
                      <option key={`${c.code}-${c.country}`} value={c.code} className="text-slate-900 bg-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="form-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "form-phone-error" : undefined}
                    className={`w-full px-4 py-2.5 rounded-r-lg border text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-axia-slate transition-all ${
                      errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-white/15'
                    }`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && (
                  <p id="form-phone-error" role="alert" className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Service Selection */}
            <div>
              <label htmlFor="form-service" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Service Focus
              </label>
              <select
                id="form-service"
                value={formData.serviceSlug}
                onChange={(e) => setFormData({ ...formData, serviceSlug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#071325] focus:outline-none focus:ring-2 focus:ring-axia-slate"
              >
                {servicesData.map((s) => (
                  <option key={s.slug} value={s.slug} className="text-slate-900 bg-white dark:bg-[#071325] dark:text-white">
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 4: Message */}
            <div>
              <label htmlFor="form-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Brief Scope & Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="form-message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "form-message-error" : undefined}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-slate-50/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-axia-slate transition-all ${
                  errors.message ? 'border-red-500' : 'border-slate-300 dark:border-white/15'
                }`}
                placeholder="Describe your current systems, timeline, and strategic goals..."
              />
              {errors.message && (
                <p id="form-message-error" role="alert" className="text-red-500 text-xs mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Row 5: Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  aria-invalid={!!errors.consent}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-axia-navy focus:ring-axia-slate"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  I agree to Axia Kairos processing my information in accordance with their privacy policy to respond to this enterprise service request.
                </span>
              </label>
              {errors.consent && (
                <p role="alert" className="text-red-500 text-xs mt-1">
                  {errors.consent}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#0b192c] dark:bg-white text-white dark:text-[#0b192c] font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Service Inquiry</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
