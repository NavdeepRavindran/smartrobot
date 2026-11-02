'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Camera, 
  Map, 
  Package, 
  Activity, 
  Settings, 
  LogOut, 
  Bot, 
  BatteryCharging, 
  Radio, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useRobot } from '@/lib/robot-context';
import { clearSession } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Robot Control', href: '/control', icon: Gamepad2 },
  { name: 'Live Camera', href: '/camera', icon: Camera },
  { name: 'Routes', href: '/routes', icon: Map },
  { name: 'Deliveries', href: '/deliveries', icon: Package },
  { name: 'System Status', href: '/system', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { telemetry } = useRobot();

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const getStatusColor = () => {
    switch (telemetry.status) {
      case 'DELIVERING':
        return 'emerald';
      case 'PAUSED':
        return 'amber';
      case 'STOPPED':
        return 'crimson';
      case 'RETURNING':
        return 'cyan';
      default:
        return 'emerald';
    }
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-40 bg-slate-950 border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center gap-3.5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 ring-1 ring-sky-400/30">
          <Bot className="h-6 w-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white tracking-wider">SMART MEDICINE</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold">
              {telemetry.id}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 truncate">
            Autonomous Delivery System
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Navigation
        </div>
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all',
                isActive
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/25 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-sky-400/80" />}
            </Link>
          );
        })}
      </div>

      {/* Robot Mini Health Widget */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-medium text-slate-300">SMR-01 Telemetry</span>
            </div>
            <Badge variant={getStatusColor()} size="sm" dot>
              {telemetry.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950/60 p-1.5 rounded border border-slate-800/60">
              <BatteryCharging className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>{telemetry.battery}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950/60 p-1.5 rounded border border-slate-800/60">
              <Radio className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span>{telemetry.signalRssi} dBm</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 truncate">
            Loc: <span className="text-slate-200 font-medium">{telemetry.currentLocation}</span>
          </div>
        </div>

        {/* User & Logout */}
        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">Admin Operator</p>
              <p className="text-[10px] text-slate-500 truncate">St. Jude Medical</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
