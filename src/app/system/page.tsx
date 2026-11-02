'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SystemHealthGrid } from '@/components/system/SystemHealthGrid';
import { Activity, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useRobot } from '@/lib/robot-context';

export default function SystemStatusPage() {
  const { diagnostics, hardware } = useRobot();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  HARDWARE SUBSYSTEM HEALTH & DIAGNOSTICS
                </h2>
                <Badge variant="emerald" size="sm" dot>
                  FIRMWARE {diagnostics.firmwareVersion}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time FreeRTOS task status, motor driver thermals, ultrasonic calibration, and sensor bus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800">
            <Cpu className="h-4 w-4 text-sky-400" />
            <span>PING: {diagnostics.lastPingMs} ms</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">{hardware.length}/16 ACTIVE</span>
          </div>
        </div>

        {/* 16-Hardware Component Telemetry Grid */}
        <SystemHealthGrid />
      </div>
    </AppShell>
  );
}
