'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { HeroRobotStatus } from '@/components/dashboard/HeroRobotStatus';
import { QuickControlBar } from '@/components/robot/QuickControlBar';
import { DestinationSelector } from '@/components/robot/DestinationSelector';
import { TelemetryGrid } from '@/components/robot/TelemetryGrid';
import { HospitalMapSvg } from '@/components/routes/HospitalMapSvg';
import { Esp32CamView } from '@/components/camera/Esp32CamView';
import { ActiveMissionCard } from '@/components/dashboard/ActiveMissionCard';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowUpRight, Camera, Map } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* 1. Hero Robot Status Overview */}
        <HeroRobotStatus />

        {/* 2. Quick Robot Control Bar (Start, Pause, Stop, Return) */}
        <QuickControlBar />

        {/* 3. Destination Waypoint Dispatcher */}
        <DestinationSelector />

        {/* 4. Full Telemetry Readout Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Live Sensor & Telemetry Gauges
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Real-time Polling: 2000ms
            </span>
          </div>
          <TelemetryGrid />
        </div>

        {/* 5. Split Section: Interactive Hospital Floor Map (Left 7 cols) & Live Camera / Mission (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hospital Navigation Map */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <HospitalMapSvg className="h-full" />
          </div>

          {/* ESP32-CAM Compact Preview & Mission Card */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  ESP32-CAM Video Stream
                </span>
                <Link
                  href="/camera"
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                >
                  <span>Full Console</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <Esp32CamView isCompact />
            </div>

            {/* Active Mission Card */}
            <ActiveMissionCard />
          </div>
        </div>

        {/* 6. Recent Activity Log */}
        <RecentActivityFeed />
      </div>
    </AppShell>
  );
}
