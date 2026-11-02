'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Esp32CamView } from '@/components/camera/Esp32CamView';
import { Camera, Radio, ShieldCheck, Eye, Layers, Wifi, Zap } from 'lucide-react';
import { useRobot } from '@/lib/robot-context';
import { Badge } from '@/components/ui/Badge';

export default function CameraPage() {
  const { telemetry, snapshots } = useRobot();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  ESP32-CAM OPTICAL SURVEILLANCE FEED
                </h2>
                <Badge variant="emerald" size="sm" dot>
                  STREAM ACTIVE
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Front-mounted OV2640 2.0MP module on pan-tilt servo mount with high-lumen flash LED
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
            <div className="bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-sky-400" />
              <span>IP: 192.168.1.150:81</span>
            </div>
          </div>
        </div>

        {/* Large Surveillance Camera Interface */}
        <Esp32CamView />

        {/* Camera Technical Specifications Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Optical Sensor</span>
            <div className="text-sm font-bold text-white mt-1">OmniVision OV2640</div>
            <p className="text-[11px] text-slate-400 mt-1">1/4&quot; Color CMOS 1600x1200 UXGA capable</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Pan-Tilt Gimbal</span>
            <div className="text-sm font-bold text-sky-400 mt-1">SG90 9g Servo ({telemetry.servoAngle}°)</div>
            <p className="text-[11px] text-slate-400 mt-1">PWM Pin GPIO 15 (50Hz duty)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Flash Illumination</span>
            <div className="text-sm font-bold text-amber-400 mt-1">
              {telemetry.flashLed ? 'ACTIVE (GPIO 4 High)' : 'STANDBY (OFF)'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">High-brightness onboard surface-mount LED</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Recorded Captures</span>
            <div className="text-sm font-bold text-emerald-400 mt-1">{snapshots.length} Snapshots</div>
            <p className="text-[11px] text-slate-400 mt-1">Saved to local browser telemetry store</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
