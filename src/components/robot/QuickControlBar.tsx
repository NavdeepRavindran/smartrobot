'use client';

import React from 'react';
import { Play, Pause, Square, CornerDownLeft, AlertCircle } from 'lucide-react';
import { useRobot } from '@/lib/robot-context';
import { Button } from '@/components/ui/Button';

export function QuickControlBar() {
  const { telemetry, startDelivery, pauseDelivery, emergencyStop, returnToBase } = useRobot();

  const isDelivering = telemetry.status === 'DELIVERING';
  const isPaused = telemetry.status === 'PAUSED';
  const isStopped = telemetry.status === 'STOPPED';
  const isReturning = telemetry.status === 'RETURNING';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <span>QUICK ROBOT CONTROL</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              MISSION DISPATCH
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active Mode: <strong className="text-slate-200">{telemetry.mode}</strong> | Current Action:{' '}
            <strong className="text-sky-400">{telemetry.status}</strong>
          </p>
        </div>

        {isStopped && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold animate-pulse">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>BRAKES LOCKED (E-STOP ACTIVE)</span>
          </div>
        )}
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
        {/* START DELIVERY */}
        <Button
          variant="success"
          size="lg"
          onClick={startDelivery}
          disabled={isDelivering}
          className="h-13 font-bold tracking-wide"
        >
          <Play className="h-4 w-4 mr-2 fill-current" />
          START DELIVERY
        </Button>

        {/* PAUSE */}
        <Button
          variant="secondary"
          size="lg"
          onClick={pauseDelivery}
          disabled={!isDelivering && !isReturning}
          className="h-13 font-bold tracking-wide text-amber-300 hover:text-amber-200 hover:bg-slate-800 border-amber-500/20"
        >
          <Pause className="h-4 w-4 mr-2 fill-current" />
          PAUSE
        </Button>

        {/* RETURN TO BASE */}
        <Button
          variant="outline"
          size="lg"
          onClick={returnToBase}
          disabled={isReturning || (telemetry.currentLocation === 'Nurse Station' && !isDelivering)}
          className="h-13 font-bold tracking-wide text-sky-300 hover:text-sky-200 border-sky-500/30 hover:bg-sky-500/10"
        >
          <CornerDownLeft className="h-4 w-4 mr-2" />
          RETURN TO BASE
        </Button>

        {/* EMERGENCY STOP */}
        <Button
          variant="emergency"
          size="lg"
          onClick={emergencyStop}
          className="h-13 font-black text-sm col-span-2 sm:col-span-1"
        >
          <Square className="h-4 w-4 mr-2 fill-current" />
          EMERGENCY STOP
        </Button>
      </div>
    </div>
  );
}
