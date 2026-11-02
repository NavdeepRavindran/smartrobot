'use client';

import React, { useState } from 'react';
import { useRobot } from '@/lib/robot-context';
import { HardwareModule } from '@/types/system';
import { 
  Activity, 
  Cpu, 
  Camera, 
  Cog, 
  Radar, 
  Zap, 
  Volume2, 
  Tv, 
  Wifi, 
  BatteryCharging, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function SystemHealthGrid() {
  const { hardware, diagnostics, runSelfDiagnostics, isDiagnosing, telemetry } = useRobot();
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const categories = ['ALL', 'Compute', 'Vision', 'Actuator', 'Sensor', 'Audio/Visual', 'Power/Comms'];

  const filteredModules = categoryFilter === 'ALL'
    ? hardware
    : hardware.filter(h => h.category === categoryFilter);

  const getCategoryIcon = (category: HardwareModule['category']) => {
    switch (category) {
      case 'Compute':
        return <Cpu className="h-4 w-4 text-sky-400" />;
      case 'Vision':
        return <Camera className="h-4 w-4 text-purple-400" />;
      case 'Actuator':
        return <Cog className="h-4 w-4 text-amber-400" />;
      case 'Sensor':
        return <Radar className="h-4 w-4 text-emerald-400" />;
      case 'Audio/Visual':
        return <Volume2 className="h-4 w-4 text-pink-400" />;
      case 'Power/Comms':
        return <Wifi className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status: HardwareModule['status'], text: string) => {
    switch (status) {
      case 'Operational':
        return <Badge variant="emerald" size="sm" dot>{text}</Badge>;
      case 'Connected':
        return <Badge variant="cyan" size="sm" dot>{text}</Badge>;
      case 'Warning':
        return <Badge variant="amber" size="sm" dot>{text}</Badge>;
      case 'Error':
        return <Badge variant="crimson" size="sm" dot>{text}</Badge>;
      default:
        return <Badge variant="slate" size="sm">{text}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Health Score Hero Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Health Score Gauge */}
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={238}
                  strokeDashoffset={238 - (238 * diagnostics.overallHealthScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-white">
                  {diagnostics.overallHealthScore}%
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase">HEALTH</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  SYSTEM HARDWARE HEALTH CENTER
                </h2>
                <Badge variant="emerald" size="sm" dot>
                  ALL SYSTEMS NOMINAL
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                16 integrated micro-devices, dual-core ESP32 MCU, 4WD motor telemetry, 
                and multi-transducer collision avoidance bus.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
                <span>Active Faults: <strong className="text-emerald-400">{diagnostics.activeFaultsCount}</strong></span>
                <span>•</span>
                <span>Subsystems: <strong className="text-white">{diagnostics.totalSubsystems}/16</strong></span>
                <span>•</span>
                <span>Uptime: <strong className="text-slate-200">{diagnostics.uptimeHours} hrs</strong></span>
                <span>•</span>
                <span>FreeRTOS Heap: <strong className="text-sky-400">{diagnostics.freeHeapKb} KB</strong></span>
              </div>
            </div>
          </div>

          {/* Diagnostic Action Button */}
          <div className="w-full md:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={runSelfDiagnostics}
              isLoading={isDiagnosing}
              className="w-full md:w-auto h-12 px-6 font-bold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {isDiagnosing ? 'Running Diagnostics...' : 'Run Subsystem Self-Test'}
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap',
              categoryFilter === cat
                ? 'bg-sky-500 text-white shadow-sm font-semibold'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            )}
          >
            {cat === 'ALL' ? 'All Hardware (16)' : cat}
          </button>
        ))}
      </div>

      {/* Hardware Subsystem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredModules.map(mod => (
          <div
            key={mod.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                    {getCategoryIcon(mod.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{mod.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{mod.category}</span>
                  </div>
                </div>

                {getStatusBadge(mod.status, mod.statusText)}
              </div>

              {/* Metric Card */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  {mod.metricLabel}
                </span>
                <span className="text-xs font-mono font-bold text-sky-400 mt-0.5 block">
                  {mod.metricValue}
                </span>
              </div>

              {/* Details */}
              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                {mod.details}
              </p>
            </div>

            {/* Pinout & Timestamp */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="truncate max-w-[150px]">{mod.pinout || 'I/O Pin: GPIO Bus'}</span>
              <span>{mod.lastChecked}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
