import React from 'react';
import { cn } from '@/lib/utils';

interface StatGaugeProps {
  label: string;
  value: string | number;
  unit?: string;
  percentage?: number;
  status?: 'normal' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function StatGauge({
  label,
  value,
  unit,
  percentage,
  status = 'normal',
  icon,
  subtitle,
  className,
}: StatGaugeProps) {
  const statusColor = {
    normal: 'text-emerald-400 bg-emerald-500',
    warning: 'text-amber-400 bg-amber-500',
    danger: 'text-rose-400 bg-rose-500',
    info: 'text-sky-400 bg-sky-500',
  }[status];

  const textColor = {
    normal: 'text-emerald-400',
    warning: 'text-amber-400',
    danger: 'text-rose-400',
    info: 'text-sky-400',
  }[status];

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 relative overflow-hidden backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">{label}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className={cn('text-2xl font-bold font-mono tracking-tight text-white')}>{value}</span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      {percentage !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={cn('h-full transition-all duration-500 rounded-full', statusColor.split(' ')[1])}
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      )}

      {subtitle && (
        <p className={cn('mt-2 text-xs font-medium', textColor)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
