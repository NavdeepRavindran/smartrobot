'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  Hospital, 
  ArrowRight,
  Sparkles,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { VALID_CREDENTIALS, saveSession, isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { soundFx } from '@/lib/speech';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (
        username.trim() === VALID_CREDENTIALS.username &&
        password === VALID_CREDENTIALS.password
      ) {
        saveSession({
          username: 'admin',
          role: 'Robotics Fleet Administrator',
          name: 'Chief Medical Officer',
          loginTime: new Date().toISOString(),
        });
        soundFx.playBeep(980, 0.15);
        router.push('/dashboard');
      } else {
        setIsLoading(false);
        setErrorMsg('Invalid credentials. Check username & password or use demo fill.');
        soundFx.playBeep(440, 0.2, 'sawtooth');
      }
    }, 600);
  };

  const handleQuickDemoFill = () => {
    setUsername(VALID_CREDENTIALS.username);
    setPassword(VALID_CREDENTIALS.password);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden bg-grid-pattern">
      {/* Ambient glowing radial effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-blue-700 text-white shadow-xl shadow-sky-500/25 ring-2 ring-sky-400/30 mb-2">
            <Bot className="h-9 w-9" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider text-white">
              SMART MEDICINE ROBOT
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold">
              SMR-01
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Hospital Autonomous Medicine Delivery & Monitoring System
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Operator Authentication
            </span>
            <Badge variant="emerald" size="sm" dot>
              System Online
            </Badge>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Username */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Operator Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Access Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0 accent-sky-500 h-3.5 w-3.5"
                />
                <span className="text-[11px]">Remember terminal session</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotMsg(true)}
                className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {forgotMsg && (
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Contact system administrator: <strong>admin@hospital.org</strong></span>
                <button onClick={() => setForgotMsg(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>
            )}

            {/* LOGIN Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full h-11 text-xs font-bold tracking-wider uppercase mt-2 shadow-lg shadow-sky-600/20"
            >
              AUTHENTICATE OPERATOR
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Quick Demo Fill Button (Presentation Convenience) */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-[11px] font-mono flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Fill Evaluation Credentials (admin / admin123)</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Autonomous Navigation • ESP32 FreeRTOS • OV2640 Optical Bus</p>
          <p className="font-mono text-[10px]">St. Jude Metropolitan Hospital Robotics Fleet v2.4</p>
        </div>
      </div>
    </div>
  );
}
