'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { HospitalLocation } from '@/types/robot';
import { MapPin, Navigation, ArrowRight, Gauge, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const DESTINATIONS: { name: HospitalLocation; wing: string; iconTag: string }[] = [
  { name: 'Nurse Station', wing: 'Base Docking Station', iconTag: 'BASE' },
  { name: 'Room 101', wing: 'West Patient Wing', iconTag: 'ROOM' },
  { name: 'Room 102', wing: 'Central Patient Wing', iconTag: 'ROOM' },
  { name: 'Room 103', wing: 'East Patient Wing', iconTag: 'ROOM' },
  { name: 'ICU', wing: 'Critical Care Complex', iconTag: 'ICU' },
  { name: 'Emergency Ward', wing: 'Trauma & Emergency', iconTag: 'ER' },
  { name: 'Pharmacy', wing: 'Medication Dispensary', iconTag: 'PHARM' },
  { name: 'Operation Theatre', wing: 'Surgical Suites Fl 3', iconTag: 'OT' },
];

export function DestinationSelector() {
  const { telemetry, activeRoute, setDestination } = useRobot();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Navigation className="h-4 w-4 text-sky-400" />
            <span>DESTINATION & WAYPOINT SYSTEM</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a hospital sector to automatically compute line-following route & ETA
          </p>
        </div>

        <Badge variant="cyan" size="md" dot>
          Active Route: {activeRoute?.id || 'DIRECT'}
        </Badge>
      </div>

      {/* Route Metrics Banner */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Current Location</span>
          <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-200">
            <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{telemetry.currentLocation}</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Target Destination</span>
          <div className="flex items-center gap-1.5 mt-1 font-semibold text-sky-400">
            <ArrowRight className="h-3.5 w-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{telemetry.destination}</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Estimated Distance</span>
          <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-slate-200">
            <Gauge className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>{activeRoute?.distanceFormatted || '58 m'}</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Estimated Transit</span>
          <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-slate-200">
            <Clock className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>{activeRoute?.estimatedTimeFormatted || '1 min 25 s'}</span>
          </div>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {DESTINATIONS.map(item => {
          const isSelected = telemetry.destination === item.name;
          const isCurrent = telemetry.currentLocation === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setDestination(item.name)}
              className={cn(
                'group relative flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer select-none',
                isSelected
                  ? 'border-sky-500 bg-sky-500/15 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
              )}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded font-bold',
                    isSelected
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  )}
                >
                  {item.iconTag}
                </span>

                {isCurrent && (
                  <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    HERE
                  </span>
                )}
              </div>

              <span
                className={cn(
                  'text-xs font-bold tracking-tight',
                  isSelected ? 'text-sky-300' : 'text-slate-200 group-hover:text-white'
                )}
              >
                {item.name}
              </span>
              <span className="text-[10px] text-slate-400 truncate mt-0.5">
                {item.wing}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
