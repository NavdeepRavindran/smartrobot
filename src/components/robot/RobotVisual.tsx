'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { cn } from '@/lib/utils';
import { ShieldAlert, Zap, Radio, Eye } from 'lucide-react';

interface RobotVisualProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RobotVisual({ className, size = 'md' }: RobotVisualProps) {
  const { telemetry } = useRobot();

  const isMoving = telemetry.status === 'DELIVERING' || telemetry.status === 'RETURNING';
  const isStopped = telemetry.status === 'STOPPED';

  const sizeClasses = {
    sm: 'w-48 h-56',
    md: 'w-72 h-80',
    lg: 'w-88 h-96',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      {/* Background Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-64 h-64 rounded-full border border-sky-500/40" />
        <div className="w-48 h-48 rounded-full border border-sky-500/30" />
        <div className="w-32 h-32 rounded-full border border-sky-500/20" />
      </div>

      {/* SVG Robot Chassis */}
      <svg
        viewBox="0 0 320 380"
        className="w-full h-full relative z-10 drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ultrasonic Sensor Detection Cones */}
        {telemetry.obstacleStatus === 'Clear' ? (
          <path
            d="M 160 50 L 110 0 L 210 0 Z"
            fill="url(#frontBeamClear)"
            opacity="0.5"
            className={isMoving ? 'animate-pulse' : ''}
          />
        ) : (
          <path
            d="M 160 50 L 110 0 L 210 0 Z"
            fill="url(#frontBeamWarning)"
            opacity="0.8"
          />
        )}

        {/* Left / Right Ultrasonic Cones */}
        <path d="M 70 85 L 10 50 L 10 120 Z" fill="url(#sideBeam)" opacity="0.35" />
        <path d="M 250 85 L 310 50 L 310 120 Z" fill="url(#sideBeam)" opacity="0.35" />

        {/* Wheels (4WD Differential System) */}
        {/* Front Left */}
        <rect
          x="32"
          y="70"
          width="26"
          height="65"
          rx="6"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2"
        />
        <line x1="32" y1="88" x2="58" y2="88" stroke="#64748b" strokeWidth="2" />
        <line x1="32" y1="105" x2="58" y2="105" stroke="#64748b" strokeWidth="2" />
        <line x1="32" y1="120" x2="58" y2="120" stroke="#64748b" strokeWidth="2" />

        {/* Front Right */}
        <rect
          x="262"
          y="70"
          width="26"
          height="65"
          rx="6"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2"
        />
        <line x1="262" y1="88" x2="288" y2="88" stroke="#64748b" strokeWidth="2" />
        <line x1="262" y1="105" x2="288" y2="105" stroke="#64748b" strokeWidth="2" />
        <line x1="262" y1="120" x2="288" y2="120" stroke="#64748b" strokeWidth="2" />

        {/* Rear Left */}
        <rect
          x="32"
          y="235"
          width="26"
          height="65"
          rx="6"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2"
        />
        <line x1="32" y1="250" x2="58" y2="250" stroke="#64748b" strokeWidth="2" />
        <line x1="32" y1="268" x2="58" y2="268" stroke="#64748b" strokeWidth="2" />
        <line x1="32" y1="285" x2="58" y2="285" stroke="#64748b" strokeWidth="2" />

        {/* Rear Right */}
        <rect
          x="262"
          y="235"
          width="26"
          height="65"
          rx="6"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2"
        />
        <line x1="262" y1="250" x2="288" y2="250" stroke="#64748b" strokeWidth="2" />
        <line x1="262" y1="268" x2="288" y2="268" stroke="#64748b" strokeWidth="2" />
        <line x1="262" y1="285" x2="288" y2="285" stroke="#64748b" strokeWidth="2" />

        {/* Main Base Chassis */}
        <rect
          x="58"
          y="48"
          width="204"
          height="275"
          rx="24"
          fill="url(#chassisGrad)"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeOpacity="0.5"
        />

        {/* Inner Medical Shell */}
        <rect
          x="72"
          y="62"
          width="176"
          height="248"
          rx="18"
          fill="#090d16"
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Front Bumper & Ultrasonic Housing */}
        <path
          d="M 100 48 Q 160 32 220 48 L 210 65 L 110 65 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        {/* HC-SR04 Transducer Eyes */}
        <circle cx="140" cy="52" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="140" cy="52" r="4" fill="#0284c7" />
        <circle cx="180" cy="52" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="180" cy="52" r="4" fill="#0284c7" />

        {/* Camera Tower (ESP32-CAM) */}
        <rect
          x="135"
          y="74"
          width="50"
          height="32"
          rx="6"
          fill="#0284c7"
          fillOpacity="0.2"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <circle cx="160" cy="90" r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        <circle
          cx="160"
          cy="90"
          r="4"
          fill={telemetry.flashLed ? '#ffffff' : '#38bdf8'}
          className={telemetry.flashLed ? 'animate-ping' : ''}
        />

        {/* OLED Screen Simulation */}
        <rect
          x="100"
          y="114"
          width="120"
          height="40"
          rx="4"
          fill="#020617"
          stroke="#334155"
          strokeWidth="1.5"
        />
        <text x="110" y="130" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
          SMR-01 [OK]
        </text>
        <text x="110" y="144" fill="#10b981" fontSize="8" fontFamily="monospace">
          {telemetry.status}: {telemetry.destination}
        </text>

        {/* Quad Medicine Compartment Vault */}
        <rect
          x="88"
          y="164"
          width="144"
          height="115"
          rx="10"
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth="1.5"
        />
        {/* Compartment Grid */}
        <line x1="88" y1="221" x2="232" y2="221" stroke="#1e293b" strokeWidth="2" />
        <line x1="160" y1="164" x2="160" y2="279" stroke="#1e293b" strokeWidth="2" />

        {/* Compartment Pod 1 */}
        <rect x="94" y="170" width="60" height="45" rx="5" fill="#1e293b" fillOpacity="0.5" />
        <text x="100" y="184" fill="#94a3b8" fontSize="8" fontFamily="monospace">
          BAY-1
        </text>
        <circle cx="145" cy="180" r="3" fill="#10b981" />

        {/* Compartment Pod 2 (Active Payload) */}
        <rect
          x="166"
          y="170"
          width="60"
          height="45"
          rx="5"
          fill="#0284c7"
          fillOpacity="0.2"
          stroke="#0284c7"
          strokeWidth="1"
        />
        <text x="172" y="184" fill="#38bdf8" fontSize="8" fontFamily="monospace">
          BAY-2
        </text>
        <circle cx="217" cy="180" r="3.5" fill="#38bdf8" className="animate-pulse" />

        {/* Compartment Pod 3 */}
        <rect x="94" y="228" width="60" height="45" rx="5" fill="#1e293b" fillOpacity="0.5" />
        <text x="100" y="242" fill="#94a3b8" fontSize="8" fontFamily="monospace">
          BAY-3
        </text>
        <circle cx="145" cy="238" r="3" fill="#64748b" />

        {/* Compartment Pod 4 */}
        <rect x="166" y="228" width="60" height="45" rx="5" fill="#1e293b" fillOpacity="0.5" />
        <text x="172" y="242" fill="#94a3b8" fontSize="8" fontFamily="monospace">
          BAY-4
        </text>
        <circle cx="217" cy="238" r="3" fill="#10b981" />

        {/* Rear IR Line Sensor Strip */}
        <rect
          x="115"
          y="312"
          width="90"
          height="16"
          rx="3"
          fill="#020617"
          stroke="#38bdf8"
          strokeWidth="1"
        />
        {/* 4 TCRT5000 IR LEDs */}
        {telemetry.irLineSensors.map((bit, idx) => (
          <circle
            key={idx}
            cx={128 + idx * 21}
            cy="320"
            r="4"
            fill={bit === 1 ? '#10b981' : '#334155'}
            stroke="#1e293b"
            strokeWidth="1"
          />
        ))}

        {/* Status Lighting Bar */}
        <rect
          x="78"
          y="290"
          width="164"
          height="6"
          rx="3"
          fill={
            isStopped
              ? '#ef4444'
              : telemetry.status === 'PAUSED'
              ? '#f59e0b'
              : '#10b981'
          }
          className={isMoving ? 'animate-pulse' : ''}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="chassisGrad" x1="58" y1="48" x2="262" y2="323" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="0.5" stopColor="#0f172a" />
            <stop offset="1" stopColor="#090d16" />
          </linearGradient>

          <linearGradient id="frontBeamClear" x1="160" y1="50" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="frontBeamWarning" x1="160" y1="50" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="sideBeam" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="1" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Status Tag */}
      <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="text-slate-400">DIFF 4WD CHASSIS</span>
        <span
          className={cn(
            'font-semibold',
            isStopped
              ? 'text-rose-400'
              : telemetry.status === 'DELIVERING'
              ? 'text-emerald-400'
              : 'text-sky-400'
          )}
        >
          {telemetry.status}
        </span>
      </div>
    </div>
  );
}
