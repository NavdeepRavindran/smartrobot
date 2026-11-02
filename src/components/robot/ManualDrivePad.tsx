'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Square, 
  ShieldAlert, 
  Gauge, 
  RotateCw,
  Power
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function ManualDrivePad() {
  const { telemetry, setManualDrive, setSpeed, emergencyStop } = useRobot();

  const currentDir = telemetry.motors.direction;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Power className="h-4 w-4 text-sky-400" />
            <span>MANUAL TELEOPERATION PAD</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time differential motor control override (4WD Chassis)
          </p>
        </div>

        <span
          className={cn(
            'text-xs font-mono font-bold px-2.5 py-1 rounded-full border',
            telemetry.mode === 'MANUAL'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          )}
        >
          {telemetry.mode} MODE
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center">
        {/* Directional Pad */}
        <div className="grid grid-cols-3 gap-3 w-64 h-64 select-none">
          {/* Top Row: empty, FORWARD, empty */}
          <div />
          <button
            onClick={() => setManualDrive('FORWARD')}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer',
              currentDir === 'FORWARD'
                ? 'bg-sky-500 text-white border-sky-400 shadow-sky-500/25 ring-2 ring-sky-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            )}
          >
            <ArrowUp className="h-6 w-6 mb-1" />
            <span>FORWARD</span>
          </button>
          <div />

          {/* Middle Row: LEFT, STOP, RIGHT */}
          <button
            onClick={() => setManualDrive('LEFT')}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer',
              currentDir === 'LEFT'
                ? 'bg-sky-500 text-white border-sky-400 shadow-sky-500/25 ring-2 ring-sky-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            )}
          >
            <ArrowLeft className="h-6 w-6 mb-1" />
            <span>LEFT</span>
          </button>

          <button
            onClick={() => setManualDrive('STOP')}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer',
              currentDir === 'STOP'
                ? 'bg-slate-700 text-amber-400 border-amber-500/40 ring-2 ring-amber-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border-slate-700'
            )}
          >
            <Square className="h-6 w-6 mb-1 fill-current" />
            <span>STOP</span>
          </button>

          <button
            onClick={() => setManualDrive('RIGHT')}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer',
              currentDir === 'RIGHT'
                ? 'bg-sky-500 text-white border-sky-400 shadow-sky-500/25 ring-2 ring-sky-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            )}
          >
            <ArrowRight className="h-6 w-6 mb-1" />
            <span>RIGHT</span>
          </button>

          {/* Bottom Row: empty, REVERSE, empty */}
          <div />
          <button
            onClick={() => setManualDrive('REVERSE')}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer',
              currentDir === 'REVERSE'
                ? 'bg-sky-500 text-white border-sky-400 shadow-sky-500/25 ring-2 ring-sky-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            )}
          >
            <ArrowDown className="h-6 w-6 mb-1" />
            <span>REVERSE</span>
          </button>
          <div />
        </div>

        {/* Speed Slider Control */}
        <div className="w-full mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-sky-400" />
              Drive Speed Governor (PWM)
            </span>
            <span className="text-sm font-mono font-bold text-sky-400">{telemetry.speed}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={telemetry.speed}
            onChange={e => setSpeed(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% (Halt)</span>
            <span>25% (Hospital Patrol)</span>
            <span>50% (Standard)</span>
            <span>75% (Fast)</span>
            <span>100% (Emergency Max)</span>
          </div>
        </div>

        {/* Emergency Stop Button */}
        <div className="w-full mt-4">
          <Button
            variant="emergency"
            size="lg"
            onClick={emergencyStop}
            className="w-full h-12 font-black tracking-wider text-sm"
          >
            <ShieldAlert className="h-5 w-5 mr-2" />
            TRIGGER EMERGENCY STOP
          </Button>
        </div>
      </div>
    </div>
  );
}
