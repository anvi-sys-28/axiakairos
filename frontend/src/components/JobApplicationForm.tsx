import React, { useState, useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { submitApplication, type Job, type JobApplicationPayload } from '../data/jobs';

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

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

interface JobApplicationFormProps {
  job: Job;
  className?: string;
}

interface FormState {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: string;
  linkedInUrl: string;
  shortNote: string;
  consent: boolean;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, className = '' }) => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    currentLocation: '',
    yearsOfExperience: '',
    linkedInUrl: '',
    shortNote: '',
    consent: false,
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const handleFileValidation = (file: File | undefined): boolean => {
    setResumeError('');
    if (!file) {
      setResumeFile(null);
      setResumeError('Resume/CV file is required.');
      return false;
    }

    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setResumeFile(null);
      setResumeError('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setResumeFile(null);
      setResumeError(`File size exceeds 5 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please upload a smaller document.`);
      return false;
    }

    setResumeFile(file);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileValidation(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    handleFileValidation(file);
  };

  const removeFile = () => {
    setResumeFile(null);
    setResumeError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9\s\-()+]{6,16}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid phone number.';
    }

    if (!formData.currentLocation.trim()) {
      newErrors.currentLocation = 'Current Location is required.';
    }

    if (!formData.yearsOfExperience.trim()) {
      newErrors.yearsOfExperience = 'Years of Experience is required.';
    }

    if (formData.linkedInUrl.trim()) {
      try {
        const url = new URL(formData.linkedInUrl.trim());
        if (!url.hostname.includes('linkedin.com')) {
          newErrors.linkedInUrl = 'Please enter a valid LinkedIn profile URL.';
        }
      } catch {
        newErrors.linkedInUrl = 'Please enter a valid URL (e.g. https://linkedin.com/in/username).';
      }
    }

    if (!resumeFile) {
      newErrors.resume = resumeError || 'Resume/CV file is required (PDF, DOC, DOCX up to 5 MB).';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must accept the Terms of Use and Privacy Policy to proceed.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        errorSummaryRef.current?.focus();
      }, 50);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!resumeFile) return;

    setStatus('submitting');
    setFeedbackMessage('');

    const payload: JobApplicationPayload = {
      jobSlug: job.slug,
      jobTitle: job.title,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      countryCode: formData.countryCode,
      phone: formData.phone.trim(),
      currentLocation: formData.currentLocation.trim(),
      yearsOfExperience: formData.yearsOfExperience.trim(),
      linkedInUrl: formData.linkedInUrl.trim() || undefined,
      shortNote: formData.shortNote.trim() || undefined,
      resumeFile,
      consent: formData.consent,
    };

    try {
      const response = await submitApplication(payload);
      setStatus('success');
      setFeedbackMessage(response.message);
    } catch (err) {
      setStatus('error');
      setFeedbackMessage(err instanceof Error ? err.message : 'Submission failed. Please try again or email careers@axiakairos.com directly.');
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      countryCode: '+91',
      phone: '',
      currentLocation: '',
      yearsOfExperience: '',
      linkedInUrl: '',
      shortNote: '',
      consent: false,
    });
    setResumeFile(null);
    setResumeError('');
    setErrors({});
    setStatus('idle');
    setFeedbackMessage('');
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0c1424]/90 backdrop-blur-md shadow-xl p-6 sm:p-8 ${className}`}
    >
      <div className="mb-6 pb-5 border-b border-slate-200/80 dark:border-white/10">
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
          DIRECT TALENT APPLICATION
        </span>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Apply for this Position
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Role: <strong className="text-slate-900 dark:text-slate-200">{job.title}</strong> &bull; {job.location}
        </p>
      </div>

      {/* Accessible Error Summary */}
      {Object.keys(errors).length > 0 && status !== 'success' && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs focus:outline-none"
        >
          <div className="flex items-center gap-2 font-semibold mb-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please correct the following {Object.keys(errors).length} issues:</span>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success View */}
      {status === 'success' ? (
        <div className="py-8 text-center space-y-4" role="status">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            Application Received
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            {feedbackMessage}
          </p>
          <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
            Reference for candidate: <strong>{job.slug}</strong> &bull; {formData.email}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Hidden Fields for Job Tracking */}
          <input type="hidden" name="jobSlug" value={job.slug} />
          <input type="hidden" name="jobTitle" value={job.title} />

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. John Doe"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border ${
                errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-white/15'
              } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors`}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. john@example.com"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border ${
                errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-white/15'
              } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors`}
            />
            {errors.email && (
              <p id="email-error" className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Phone (with Country Dial Code) */}
          <div>
            <label htmlFor="phone" className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                aria-label="Country dial code"
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="w-28 shrink-0 px-2.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {COUNTRY_DIAL_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Mobile number"
                className={`flex-1 px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border ${
                  errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-white/15'
                } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors`}
              />
            </div>
            {errors.phone && (
              <p id="phone-error" className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Current Location & Years of Experience (2-col grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="currentLocation" className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Location <span className="text-red-500">*</span>
              </label>
              <input
                id="currentLocation"
                name="currentLocation"
                type="text"
                required
                aria-invalid={!!errors.currentLocation}
                aria-describedby={errors.currentLocation ? 'currentLocation-error' : undefined}
                value={formData.currentLocation}
                onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                placeholder="e.g. Bangalore, India"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border ${
                  errors.currentLocation ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-white/15'
                } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors`}
              />
              {errors.currentLocation && (
                <p id="currentLocation-error" className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.currentLocation}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="yearsOfExperience" className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="text"
                required
                aria-invalid={!!errors.yearsOfExperience}
                aria-describedby={errors.yearsOfExperience ? 'yearsOfExperience-error' : undefined}
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                placeholder="e.g. 4.5 Years"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border ${
                  errors.yearsOfExperience ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-white/15'
                } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors`}
              />
              {errors.yearsOfExperience && (
                <p id="yearsOfExperience-error" className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.yearsOfExperience}
                </p>
              )}
            </div>
          </div>

          {/* LinkedIn Profile URL (optional) */}
          <div>
            <label htmlFor="linkedInUrl" className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn Profile URL <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="linkedInUrl"
              name="linkedInUrl"
              type="url"
              aria-invalid={!!errors.linkedInUrl}
              aria-describedby={errors.linkedInUrl ? 'linkedInUrl-error' : undefined}
              value={formData.linkedInUrl}
              onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border ${
                errors.linkedInUrl ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-white/15'
              } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors`}
            />
            {errors.linkedInUrl && (
              <p id="linkedInUrl-error" className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.linkedInUrl}
              </p>
            )}
          </div>

          {/* Resume Upload (PDF / DOC / DOCX, max 5 MB) */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1">
              Attach Resume / CV <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(PDF, DOC, DOCX up to 5 MB)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="resume-file-input"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="sr-only"
              aria-invalid={!!errors.resume || !!resumeError}
              aria-describedby="resume-error"
            />

            {!resumeFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={`w-full p-4 border-2 border-dashed rounded-xl cursor-pointer text-center transition-colors ${
                  errors.resume || resumeError
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-slate-300 dark:border-white/20 hover:border-cyan-500 hover:bg-cyan-500/5'
                }`}
              >
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  Click to upload or drag &amp; drop
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  PDF, DOCX, DOC (max 5 MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-slate-900 dark:text-white">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <div className="text-left overflow-hidden">
                    <p className="text-xs font-medium truncate max-w-[200px] sm:max-w-[280px]">
                      {resumeFile.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {(resumeFile.size / 1024).toFixed(0)} KB &bull; Ready to send
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove uploaded file"
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {(errors.resume || resumeError) && (
              <p id="resume-error" className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.resume || resumeError}
              </p>
            )}
          </div>

          {/* Short Note / Cover Note (Optional) */}
          <div>
            <label htmlFor="shortNote" className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1">
              Short Note to Hiring Manager <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="shortNote"
              name="shortNote"
              rows={3}
              value={formData.shortNote}
              onChange={(e) => setFormData({ ...formData, shortNote: e.target.value })}
              placeholder="Briefly highlight your relevant SAP/technical experience or notice period..."
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y"
            />
          </div>

          {/* Consent Checkbox */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 dark:border-white/20 text-cyan-600 focus:ring-cyan-500"
              />
              <span>
                I have read and accept the Axia Kairos <span className="underline hover:text-cyan-600 dark:hover:text-cyan-400">Terms of Use</span> and{' '}
                <span className="underline hover:text-cyan-600 dark:hover:text-cyan-400">Privacy Policy</span>. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.consent && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.consent}
              </p>
            )}
          </div>

          {/* Error Banner if submission failed */}
          {status === 'error' && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3 px-6 rounded-full font-medium text-xs tracking-wider uppercase transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-500" />
            Your application data is kept confidential under our privacy policy.
          </p>
        </form>
      )}
    </div>
  );
};
