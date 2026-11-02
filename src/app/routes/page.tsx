'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { HospitalMapSvg } from '@/components/routes/HospitalMapSvg';
import { RouteList } from '@/components/routes/RouteList';
import { DestinationSelector } from '@/components/robot/DestinationSelector';
import { Map, GitBranch, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useRobot } from '@/lib/robot-context';

export default function RoutesPage() {
  const { routes, activeRoute } = useRobot();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Map className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  HOSPITAL NAVIGATION & CORRIDOR TOPOLOGY
                </h2>
                <Badge variant="cyan" size="sm">
                  {routes.length} Pre-mapped Routes
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Floor 2 autonomous line-tracking pathways, corridor junctions, and automated door interfaces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800">
            <GitBranch className="h-4 w-4 text-emerald-400" />
            <span>ACTIVE PATH: {activeRoute?.id || 'DIRECT'}</span>
          </div>
        </div>

        {/* Interactive Hospital Topological Map */}
        <HospitalMapSvg />

        {/* Destination Waypoint Selector */}
        <DestinationSelector />

        {/* Route Cards Catalog */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Available Hospital Delivery Routes Catalog
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Magnetic Tape / Black Line Calibration
            </span>
          </div>
          <RouteList />
        </div>
      </div>
    </AppShell>
  );
}
