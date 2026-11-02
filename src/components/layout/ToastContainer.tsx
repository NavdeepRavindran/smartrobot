'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, dismissToast } = useRobot();

  if (toasts.length === 0) return null;

  const icons = {
    info: <Info className="h-4 w-4 text-sky-400 shrink-0" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
    error: <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0" />,
  };

  const borders = {
    info: 'border-sky-500/40 bg-slate-900/95 shadow-sky-500/10',
    success: 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-500/10',
    warning: 'border-amber-500/40 bg-slate-900/95 shadow-amber-500/10',
    error: 'border-rose-500/50 bg-slate-900/95 shadow-rose-500/20 ring-1 ring-rose-500/30',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3',
            borders[toast.type]
          )}
        >
          <div className="mt-0.5">{icons[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold text-slate-100">{toast.title}</h4>
              <span className="text-[10px] text-slate-500 font-mono">{toast.timestamp}</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-0.5 -mr-1 -mt-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
