'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { RobotVisual } from '@/components/robot/RobotVisual';
import { ManualDrivePad } from '@/components/robot/ManualDrivePad';
import { SensorReadout } from '@/components/robot/SensorReadout';
import { QuickControlBar } from '@/components/robot/QuickControlBar';
import { useRobot } from '@/lib/robot-context';
import { Gamepad2, Radio, Compass, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function RobotControlPage() {
  const { telemetry } = useRobot();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  ROBOT TELEOPERATION & DIAGNOSTIC CENTER
                </h2>
                <Badge variant={telemetry.mode === 'MANUAL' ? 'amber' : 'cyan'} size="sm">
                  {telemetry.mode} CONTROL
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manual motor override, optical line sensor telemetry, and 3-axis ultrasonic ranging
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800">
            <Compass className="h-4 w-4 text-sky-400" />
            <span>HEADING: {telemetry.motors.direction}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">{telemetry.speed}% PWM</span>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <QuickControlBar />

        {/* Central Split Layout: Large Robot Visualizer + Manual Pad (Left), Sensor Readouts (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visualizer + Directional Pad */}
          <div className="lg:col-span-6 space-y-6">
            {/* Large Visualizer Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col items-center justify-center shadow-xl">
              <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-300">CHASSIS VISUALIZER</span>
                <span className="text-[11px] font-mono text-sky-400">DIFF 4-WHEEL DRIVE</span>
              </div>
              <RobotVisual size="lg" className="w-full max-w-md h-96" />
            </div>

            {/* Directional Pad */}
            <ManualDrivePad />
          </div>

          {/* Right Column: Motor Telemetry & Sensor Visualizers */}
          <div className="lg:col-span-6 space-y-6">
            <SensorReadout />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
