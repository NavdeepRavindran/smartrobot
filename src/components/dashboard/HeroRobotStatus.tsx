'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { 
  Bot, 
  MapPin, 
  Navigation, 
  BatteryCharging, 
  Wifi, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { RobotVisual } from '@/components/robot/RobotVisual';

export function HeroRobotStatus() {
  const { telemetry, activeRoute } = useRobot();

  const getStatusBadge = () => {
    switch (telemetry.status) {
      case 'DELIVERING':
        return <Badge variant="emerald" size="lg" dot>DELIVERING (ACTIVE)</Badge>;
      case 'PAUSED':
        return <Badge variant="amber" size="lg" dot>PAUSED</Badge>;
      case 'STOPPED':
        return <Badge variant="crimson" size="lg" dot>STOPPED (E-STOP)</Badge>;
      case 'RETURNING':
        return <Badge variant="cyan" size="lg" dot>RETURNING TO BASE</Badge>;
      default:
        return <Badge variant="emerald" size="lg" dot>ONLINE (STANDBY)</Badge>;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Status & Telemetry Readouts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header pill & Robot ID */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-mono text-xs font-bold">
              <Bot className="h-4 w-4" />
              <span>ROBOT ID: {telemetry.id}</span>
            </div>

            {getStatusBadge()}

            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
              MODE: {telemetry.mode}
            </span>
          </div>

          {/* Large Title & Subtitle */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hospital Autonomous Medicine Delivery System
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Mission Control telemetry bus for St. Jude Medical Complex. Monitoring line-following guidance, 
              quad-bay lockbox vaults, and real-time obstacle evasion.
            </p>
          </div>

          {/* Hero Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {/* Current Location */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Current Location
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-white text-xs sm:text-sm truncate">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="truncate">{telemetry.currentLocation}</span>
              </div>
            </div>

            {/* Destination */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Target Destination
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-sky-400 text-xs sm:text-sm truncate">
                <Navigation className="h-4 w-4 text-sky-400 shrink-0" />
                <span className="truncate">{telemetry.destination}</span>
              </div>
            </div>

            {/* Battery */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Battery Level
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-white text-xs sm:text-sm">
                <BatteryCharging className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{telemetry.battery}%</span>
                <span className="text-[10px] text-slate-400 font-normal">({telemetry.batteryVoltage}V)</span>
              </div>
            </div>

            {/* Connection */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Connection
              </span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-emerald-400 text-xs sm:text-sm">
                <Wifi className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{telemetry.signalQuality}</span>
              </div>
            </div>
          </div>

          {/* Navigation Line Status Readout */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>{telemetry.navigationState}</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[11px]">
              <span>Sensors: Front {telemetry.ultrasonic.front}cm</span>
              <span>•</span>
              <span className="text-emerald-400">IR: [{telemetry.irLineSensors.join(',')}]</span>
            </div>
          </div>
        </div>

        {/* Right Robot Visual Representation (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <RobotVisual size="md" className="w-full max-w-sm" />
        </div>
      </div>
    </div>
  );
}
