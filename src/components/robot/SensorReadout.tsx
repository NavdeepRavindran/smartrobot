'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { Cpu, Radar, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SensorReadout() {
  const { telemetry } = useRobot();

  const getDistanceColor = (dist: number) => {
    if (dist < 40) return 'text-rose-400 bg-rose-500';
    if (dist < 80) return 'text-amber-400 bg-amber-500';
    return 'text-emerald-400 bg-emerald-500';
  };

  return (
    <div className="space-y-4">
      {/* Motor State Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 pb-3 border-b border-slate-800">
          <Cpu className="h-4 w-4 text-sky-400" />
          <span>L298N DUAL H-BRIDGE MOTOR STATUS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Left Motor */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Left Motors (Ch A)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                NORMAL
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">PWM Duty / Speed:</span>
                <span className="font-bold text-white">{telemetry.motors.leftSpeed}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${telemetry.motors.leftSpeed}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Output RPM: {telemetry.motors.rpmLeft}</span>
                <span>Current: {(telemetry.motors.currentAmps / 2).toFixed(2)} A</span>
              </div>
            </div>
          </div>

          {/* Right Motor */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Right Motors (Ch B)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                NORMAL
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">PWM Duty / Speed:</span>
                <span className="font-bold text-white">{telemetry.motors.rightSpeed}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${telemetry.motors.rightSpeed}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Output RPM: {telemetry.motors.rpmRight}</span>
                <span>Current: {(telemetry.motors.currentAmps / 2).toFixed(2)} A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultrasonic & IR Sensor States */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 pb-3 border-b border-slate-800">
          <Radar className="h-4 w-4 text-emerald-400" />
          <span>COLLISION & GUIDANCE SENSOR ARRAY</span>
        </h3>

        {/* Ultrasonic 3x Sensors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {/* Front */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">
              Front HC-SR04
            </span>
            <div className="text-2xl font-mono font-bold mt-1 text-white">
              {telemetry.ultrasonic.front}{' '}
              <span className="text-xs text-slate-400 font-normal">cm</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', getDistanceColor(telemetry.ultrasonic.front).split(' ')[1])}
                style={{ width: `${Math.min(100, (telemetry.ultrasonic.front / 300) * 100)}%` }}
              />
            </div>
            <span className={cn('text-[10px] font-mono font-semibold block mt-1.5', getDistanceColor(telemetry.ultrasonic.front).split(' ')[0])}>
              {telemetry.ultrasonic.front < 40 ? 'CRITICAL CLEARANCE' : 'CLEAR PATH'}
            </span>
          </div>

          {/* Left */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">
              Left HC-SR04
            </span>
            <div className="text-2xl font-mono font-bold mt-1 text-white">
              {telemetry.ultrasonic.left}{' '}
              <span className="text-xs text-slate-400 font-normal">cm</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', getDistanceColor(telemetry.ultrasonic.left).split(' ')[1])}
                style={{ width: `${Math.min(100, (telemetry.ultrasonic.left / 200) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-semibold block mt-1.5 text-emerald-400">
              WALL ALIGNED
            </span>
          </div>

          {/* Right */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">
              Right HC-SR04
            </span>
            <div className="text-2xl font-mono font-bold mt-1 text-white">
              {telemetry.ultrasonic.right}{' '}
              <span className="text-xs text-slate-400 font-normal">cm</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', getDistanceColor(telemetry.ultrasonic.right).split(' ')[1])}
                style={{ width: `${Math.min(100, (telemetry.ultrasonic.right / 200) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-semibold block mt-1.5 text-emerald-400">
              SAFE CLEARANCE
            </span>
          </div>
        </div>

        {/* 4-Channel TCRT5000 IR Line Sensor */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-semibold text-slate-200">
                4-Channel TCRT5000 IR Line Follower
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="h-3 w-3" />
              LINE LOCKED
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['IR-1 (Left Outer)', 'IR-2 (Left Center)', 'IR-3 (Right Center)', 'IR-4 (Right Outer)'].map(
              (label, idx) => {
                const isActive = telemetry.irLineSensors[idx] === 1;
                return (
                  <div
                    key={label}
                    className={cn(
                      'p-2.5 rounded-lg border text-center transition-all',
                      isActive
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    )}
                  >
                    <span className="text-[10px] font-mono block truncate">{label}</span>
                    <div className="mt-1 flex items-center justify-center gap-1.5">
                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          isActive ? 'bg-emerald-400 ring-2 ring-emerald-500/40' : 'bg-slate-700'
                        )}
                      />
                      <span className="text-xs font-mono font-bold">{isActive ? '1 (BLACK)' : '0 (WHITE)'}</span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
