'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bell, 
  Clock, 
  Menu, 
  ShieldAlert, 
  Radio, 
  Volume2, 
  VolumeX, 
  Check, 
  LogOut, 
  Sliders, 
  Activity,
  X
} from 'lucide-react';
import { useRobot } from '@/lib/robot-context';
import { clearSession } from '@/lib/auth';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Mission Command Center', subtitle: 'Live Autonomous Telemetry & Route Operations' },
  '/control': { title: 'Robot Teleoperation', subtitle: 'Manual Drive, Motor Diagnostics & Sensor Visualizer' },
  '/camera': { title: 'ESP32-CAM Surveillance', subtitle: 'Real-time Video Feed & Payload Inspection' },
  '/routes': { title: 'Hospital Navigation Grid', subtitle: 'Floor 2 Topological Corridors & Waypoints' },
  '/deliveries': { title: 'Medicine Delivery Ledger', subtitle: 'Hospital Prescriptions, Compartments & Verification' },
  '/system': { title: 'Hardware Diagnostics', subtitle: 'ESP32 Microcontroller, Motors, Sensors & Comm Bus' },
  '/settings': { title: 'System Configuration', subtitle: 'Navigation Parameters, Thresholds & Network Profiles' },
};

export function TopNavbar({ onMobileMenuToggle }: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { telemetry, settings, updateSettings, emergencyStop, toasts, clearToasts } = useRobot();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const pageInfo = PAGE_TITLES[pathname] || {
    title: 'Hospital Robot Console',
    subtitle: 'Autonomous Medical Transporter SMR-01',
  };

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const toggleSound = () => {
    updateSettings({ voiceAnnouncements: !settings.voiceAnnouncements });
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              {pageInfo.title}
            </h1>
            <Badge variant="cyan" size="sm" className="hidden sm:inline-flex font-mono">
              {telemetry.id}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Telemetry & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date & Time Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="h-3.5 w-3.5 text-sky-400" />
          <span>{currentDate}</span>
          <span className="text-slate-600">|</span>
          <span className="text-sky-300 font-semibold">{currentTime}</span>
        </div>

        {/* Live Robot Online Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={
                telemetry.status === 'STOPPED'
                  ? 'animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75'
                  : 'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'
              }
            />
            <span
              className={
                telemetry.status === 'STOPPED'
                  ? 'relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500'
                  : 'relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500'
              }
            />
          </span>
          <span className="text-xs font-mono font-medium text-slate-200 hidden sm:inline">
            {telemetry.status === 'STOPPED' ? 'E-STOPPED' : telemetry.status}
          </span>
        </div>

        {/* Voice Announcement Audio Toggle */}
        <button
          onClick={toggleSound}
          title={settings.voiceAnnouncements ? 'Voice announcements ON' : 'Voice announcements MUTED'}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          {settings.voiceAnnouncements ? (
            <Volume2 className="h-4 w-4 text-sky-400" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {/* Quick Emergency STOP */}
        <Button
          variant="emergency"
          size="sm"
          onClick={emergencyStop}
          className="hidden sm:inline-flex text-xs px-3 py-1.5 h-8 font-bold"
        >
          <ShieldAlert className="h-3.5 w-3.5 mr-1" />
          E-STOP
        </Button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(prev => !prev)}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {toasts.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sky-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-slate-950">
                {toasts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-2xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">System Notifications</span>
                {toasts.length > 0 && (
                  <button
                    onClick={clearToasts}
                    className="text-[10px] text-sky-400 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {toasts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    No active alerts. System healthy.
                  </div>
                ) : (
                  toasts.map(t => (
                    <div
                      key={t.id}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{t.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{t.timestamp}</span>
                      </div>
                      <p className="text-slate-400 mt-0.5 text-[11px]">{t.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold">
              AD
            </div>
            <span className="text-xs font-medium text-slate-200 hidden md:inline">Admin</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-2xl z-50 p-2">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-100">Administrator</p>
                <p className="text-[11px] text-slate-400">admin@hospital.org</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="emerald" size="sm">Auth Level 3</Badge>
                  <span className="text-[10px] font-mono text-slate-500">SMR-01</span>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push('/settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  System Settings
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push('/system');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Activity className="h-3.5 w-3.5" />
                  Hardware Status
                </button>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
