"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useState } from "react";
import { loginAdmin, setStoredAdminSession, getApiBase, getCustomBackendUrl, setCustomBackendUrl } from "@/lib/api";
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Server, Check } from "lucide-react";

interface AuthSectionOneProps {
  onSuccess?: (token: string, user: { username: string; role: string }) => void;
  className?: string;
}

export default function AuthSectionOne({ onSuccess, className = "" }: AuthSectionOneProps) {
  const [userId, setUserId] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [backendUrl, setBackendUrl] = useState(getCustomBackendUrl());
  const [showBackendInput, setShowBackendInput] = useState(false);
  const [savedUrlSuccess, setSavedUrlSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = userId.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage("Please enter both User ID and Password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginAdmin(trimmedUser, trimmedPass);

      if (res.success && res.token && res.user) {
        setStoredAdminSession(res.token, res.user, rememberMe);
        onSuccess?.(res.token, res.user);
      } else {
        setErrorMessage(res.error || "Invalid User ID or Password. Expected: admin / admin123");
      }
    } catch (err: any) {
      // Direct credential gate fallback if backend unavailable
      if (trimmedUser === "admin" && trimmedPass === "admin123") {
        const fallbackUser = { username: "admin", role: "Administrator" };
        const fallbackToken = "standalone-admin-token-" + Date.now();
        setStoredAdminSession(fallbackToken, fallbackUser, rememberMe);
        onSuccess?.(fallbackToken, fallbackUser);
      } else {
        setErrorMessage("Authentication failed. Use admin / admin123.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickCredentials = () => {
    setUserId("admin");
    setPassword("admin123");
    setErrorMessage(null);
  };

  return (
    <section className={`min-h-screen bg-white p-3 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white ${className}`}>
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        {/* Left Side: Auth Card */}
        <div className="flex min-h-[760px] items-center rounded-2xl border border-black/10 bg-white px-6 py-12 sm:px-10 dark:border-white/10 dark:bg-[#0a0a0a] lg:min-h-0 lg:px-14 lg:py-20 xl:px-20 shadow-sm">
          <div className="mx-auto w-full max-w-[540px]">
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-[42px] lg:leading-[1.1] text-zinc-900 dark:text-white">
                Admin Authentication
              </h1>
              <p className="mt-2.5 text-base text-zinc-500 dark:text-zinc-400">
                Secure executive portal to manage enterprise inquiries and operations.
              </p>
            </div>

            {/* Quick Demo Pill */}
            <div className="mt-6 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <span>
                  Authorized Credentials: <strong className="text-zinc-900 dark:text-white font-mono">admin</strong> / <strong className="text-zinc-900 dark:text-white font-mono">admin123</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={fillQuickCredentials}
                className="text-xs font-semibold text-sky-500 hover:text-sky-600 underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            {/* Railway Backend Connection Target */}
            <div className="mt-3 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 font-medium truncate max-w-[320px]">
                  <Server className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">
                    Backend: <strong className="font-mono text-zinc-900 dark:text-white">{getApiBase() || 'Cloudflare / Same Origin'}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBackendInput(!showBackendInput)}
                  className="text-sky-600 dark:text-sky-400 hover:underline font-semibold shrink-0 cursor-pointer ml-2"
                >
                  {showBackendInput ? 'Close' : 'Set Railway URL'}
                </button>
              </div>

              {showBackendInput && (
                <div className="mt-1 pt-2 border-t border-sky-200 dark:border-sky-800/60 flex items-center gap-2">
                  <input
                    type="url"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="https://axiakairos-backend-...up.railway.app"
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-sky-300 dark:border-sky-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomBackendUrl(backendUrl);
                      setSavedUrlSuccess(true);
                      setTimeout(() => setSavedUrlSuccess(false), 2500);
                      setShowBackendInput(false);
                      setErrorMessage(null);
                    }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                  >
                    {savedUrlSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{savedUrlSuccess ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Notification with Standalone Bypass option */}
            {errorMessage && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug text-xs sm:text-sm">{errorMessage}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-500/20 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowBackendInput(true)}
                    className="font-semibold text-sky-600 dark:text-sky-400 underline cursor-pointer"
                  >
                    Paste Railway Backend URL
                  </button>
                  <span className="text-zinc-400">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      const fallbackUser = { username: "admin", role: "Administrator" };
                      const fallbackToken = "standalone-admin-token-" + Date.now();
                      setStoredAdminSession(fallbackToken, fallbackUser, rememberMe);
                      onSuccess?.(fallbackToken, fallbackUser);
                    }}
                    className="font-semibold text-zinc-700 dark:text-zinc-300 underline cursor-pointer"
                  >
                    Continue to Dashboard (Standalone)
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              {/* User ID Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-mono text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  User ID / Admin ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="admin"
                    className="w-full h-13 rounded-xl border border-black/20 bg-zinc-50/50 dark:bg-zinc-900/60 dark:border-white/15 px-4 text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-mono text-[11px] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-13 rounded-xl border border-black/20 bg-zinc-50/50 dark:bg-zinc-900/60 dark:border-white/15 px-4 text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-zinc-300 dark:border-zinc-700 text-sky-500 focus:ring-sky-500 h-4 w-4"
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="text-xs font-mono text-zinc-400">Axia Security v2.4</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-zinc-900 dark:bg-white text-base font-semibold text-white dark:text-zinc-900 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer shadow-md disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-400">
              Axia Kairos Advisory & Technology Group &bull; Confidential Management Portal
            </div>
          </div>
        </div>

        {/* Right Side: GrainGradient Visual */}
        <div className="relative flex min-h-[720px] overflow-hidden rounded-2xl bg-black p-8 text-white sm:p-12 lg:min-h-0">
          <GrainGradient
            speed={1}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            frame={2854.5}
            colors={["#FFFFFF", "#38BDF8", "#7DD3FC", "#FFFFFF"]}
            colorBack="#00000000"
            className="absolute inset-0 bg-black"
          />

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-wider text-white/90 mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                Enterprise Command Center
              </div>
              <h2 className="max-w-[620px] pt-4 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:pt-10 lg:text-[56px] lg:leading-[1.02]">
                Intelligence in sync,
                <br />
                Control in command
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/70 max-w-lg leading-relaxed">
                Monitor client touchpoints, track mission-critical enterprise transformations, and orchestrate advisory engagements seamlessly.
              </p>
            </div>

            <div className="pt-8">
              <div className="inline-flex items-center gap-3 rounded-xl border border-white/25 bg-black/40 px-5 py-3 text-sm font-medium text-white/90 backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <span>PostgreSQL Contact Pipeline Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
