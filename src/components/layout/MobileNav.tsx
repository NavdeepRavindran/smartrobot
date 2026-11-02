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
  X, 
  Bot, 
  ShieldAlert 
} from 'lucide-react';
import { useRobot } from '@/lib/robot-context';
import { clearSession } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Robot Control', href: '/control', icon: Gamepad2 },
  { name: 'Live Camera', href: '/camera', icon: Camera },
  { name: 'Routes', href: '/routes', icon: Map },
  { name: 'Deliveries', href: '/deliveries', icon: Package },
  { name: 'System Status', href: '/system', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { telemetry, emergencyStop } = useRobot();

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:hidden flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-wider">SMART MEDICINE</div>
              <div className="text-[10px] text-slate-400">Robot ID: {telemetry.id}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive ? 'text-sky-400' : 'text-slate-400')} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Emergency Stop & Logout Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button
            onClick={() => {
              emergencyStop();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30"
          >
            <ShieldAlert className="h-4 w-4" />
            Emergency STOP
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-medium"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Persistent Quick Bar) */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 flex items-center justify-around">
        <Link
          href="/dashboard"
          className={cn(
            'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors',
            pathname === '/dashboard' ? 'text-sky-400' : 'text-slate-400'
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Overview</span>
        </Link>

        <Link
          href="/control"
          className={cn(
            'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors',
            pathname === '/control' ? 'text-sky-400' : 'text-slate-400'
          )}
        >
          <Gamepad2 className="h-5 w-5" />
          <span>Control</span>
        </Link>

        {/* Emergency Stop Button centered */}
        <button
          onClick={emergencyStop}
          className="-mt-5 h-12 w-12 rounded-full bg-red-600 border-4 border-slate-950 flex items-center justify-center text-white shadow-lg shadow-red-600/40 active:scale-95 transition-transform"
          aria-label="Emergency Stop"
        >
          <ShieldAlert className="h-6 w-6" />
        </button>

        <Link
          href="/camera"
          className={cn(
            'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors',
            pathname === '/camera' ? 'text-sky-400' : 'text-slate-400'
          )}
        >
          <Camera className="h-5 w-5" />
          <span>Camera</span>
        </Link>

        <Link
          href="/deliveries"
          className={cn(
            'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors',
            pathname === '/deliveries' ? 'text-sky-400' : 'text-slate-400'
          )}
        >
          <Package className="h-5 w-5" />
          <span>Deliveries</span>
        </Link>
      </div>
    </>
  );
}
