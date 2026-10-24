import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, Paperclip, X } from 'lucide-react';
import { submitHandoff } from './api';
import type { FormPartData } from './types';

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

interface HandoffFormProps {
  data?: FormPartData;
  onSubmitted?: () => void;
}

export const HandoffForm: React.FC<HandoffFormProps> = ({ data, onSubmitted }) => {
  const [formData, setFormData] = useState({
    fullName: data?.prefill?.name || '',
    email: data?.prefill?.email || '',
    countryCode: '+1',
    phone: '',
    company: data?.prefill?.company || '',
    message:
      data?.prefill?.message ||
      (data?.reason ? `I'd like to speak with a principal advisor regarding: ${data.reason}` : ''),
    consent: false,
  });

  const [dismissed, setDismissed] = useState(false);
  const [files, setFiles] = useState<File[]>(data?.preselectedFiles || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (dismissed) {
    return (
      <div className="my-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span>Advisor consultation form minimized.</span>
        <button
          type="button"
          onClick={() => setDismissed(false)}
          className="text-[#c2a675] hover:text-[#a88a55] font-medium transition-colors"
        >
          Reopen form
        </button>
      </div>
    );
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid business email.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile phone number is required.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a brief note or requirements summary.';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must accept our Terms and Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setFeedbackMsg('');

    try {
      const res = await submitHandoff({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        countryCode: formData.countryCode,
        phone: formData.phone.trim(),
        company: formData.company.trim() || undefined,
        message: formData.message.trim(),
        consent: formData.consent,
        attachments: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      });
      setStatus('success');
      setFeedbackMsg(res.message);
      onSubmitted?.();
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(err.message || 'Submission failed. Please try again or email contact@axiakairos.com directly.');
    }
  };

  if (status === 'success') {
    return (
      <div className="my-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-serif text-base font-bold text-slate-900">Request Received</h4>
        <p className="text-xs text-slate-700 leading-relaxed max-w-sm mx-auto">{feedbackMsg}</p>
        <p className="text-[11px] font-mono text-slate-500">
          Direct email confirmation sent to {formData.email}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="my-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3.5 text-left"
    >
      <div className="border-b border-slate-100 pb-2.5 flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-600 font-semibold">
            DIRECT ADVISORY HANDOFF
          </span>
          <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900">
            Connect with an Axia Kairos Principal Advisor
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-xs text-slate-400 hover:text-slate-700 font-medium px-2 py-1 rounded-md hover:bg-slate-100 transition-colors shrink-0"
          title="Back to chat"
        >
          ← Back to chat
        </button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Please correct the following errors:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            {Object.values(errors).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-[11px] font-mono font-medium text-slate-700 mb-0.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="e.g. Sarah Jenkins"
          className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-mono font-medium text-slate-700 mb-0.5">
            Work Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="sarah@enterprise.com"
            className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono font-medium text-slate-700 mb-0.5">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1.5">
            <select
              value={formData.countryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
              className="w-20 px-1.5 py-1.5 rounded-lg text-xs font-mono bg-slate-50 border border-slate-300 text-slate-900"
            >
              {COUNTRY_DIAL_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Mobile number"
              className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-[11px] font-mono font-medium text-slate-700 mb-0.5">
          Company Name <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="e.g. Global Logistics Inc."
          className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-[11px] font-mono font-medium text-slate-700 mb-0.5">
          Project Requirements / Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Briefly describe your objectives, timelines, or questions..."
          className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-y"
        />
      </div>

      {/* Attachments preview if files were selected */}
      {files.length > 0 && (
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500">
            Attached Documents ({files.length}):
          </span>
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Paperclip className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span className="truncate max-w-[200px]">{file.name}</span>
                <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="p-0.5 text-slate-400 hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Consent Checkbox */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-cyan-600"
          />
          <span>
            I agree to have an Axia Kairos advisor contact me regarding this inquiry in accordance with the{' '}
            <span className="underline">Privacy Policy</span>. <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* Error state */}
      {status === 'error' && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-2.5 px-4 rounded-xl font-medium text-xs tracking-wider uppercase bg-[#0b192c] hover:bg-[#152a47] text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Sending to Advisory Team...</span>
          </>
        ) : (
          <>
            <span>Submit to Our Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3 h-3 text-cyan-600" />
        Encrypted &amp; confidential enterprise communication
      </p>
    </form>
  );
};
