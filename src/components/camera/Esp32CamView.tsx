'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Maximize2, 
  Minimize2, 
  CameraIcon, 
  Lightbulb, 
  Eye, 
  Sliders, 
  Wifi, 
  Clock, 
  Settings2, 
  Layers,
  Crosshair,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useRobot } from '@/lib/robot-context';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { SnapshotGalleryModal } from './SnapshotGalleryModal';
import { StreamConfigModal } from './StreamConfigModal';

interface Esp32CamViewProps {
  isCompact?: boolean;
}

export function Esp32CamView({ isCompact = false }: Esp32CamViewProps) {
  const { 
    telemetry, 
    settings, 
    toggleFlashLed, 
    toggleNightVision, 
    setServoAngle, 
    addSnapshot,
    snapshots 
  } = useRobot();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fps, setFps] = useState(28);
  const [resolution, setResolution] = useState('SVGA 800x600');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [useHardwareFeed, setUseHardwareFeed] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeString(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Jitter simulated FPS between 27 and 30
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(27 + Math.random() * 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCaptureSnapshot = () => {
    // Generate SVG snapshot data URI for presentation
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Paint dark corridor background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 800, 600);
      
      // Paint perspective lines
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 300); ctx.lineTo(50, 550);
      ctx.moveTo(400, 300); ctx.lineTo(750, 550);
      ctx.moveTo(400, 300); ctx.lineTo(100, 100);
      ctx.moveTo(400, 300); ctx.lineTo(700, 100);
      ctx.stroke();

      // Text overlay
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`ESP32-CAM [SMR-01] - ${telemetry.currentLocation}`, 40, 50);
      ctx.font = '16px monospace';
      ctx.fillText(`TIMESTAMP: ${new Date().toISOString()}`, 40, 80);
      ctx.fillText(`BATTERY: ${telemetry.battery}% | SPEED: ${telemetry.speed}%`, 40, 110);
      ctx.fillStyle = '#10b981';
      ctx.fillText(`OBSTACLE STATUS: ${telemetry.obstacleStatus} (Clear Path)`, 40, 550);

      const dataUrl = canvas.toDataURL('image/png');
      addSnapshot(dataUrl);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col',
        isFullscreen && 'fixed inset-0 z-50 rounded-none border-none',
        isCompact ? 'h-[360px]' : 'h-[500px] lg:h-[580px]'
      )}
    >
      {/* Top HUD Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3.5 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent">
        <div className="flex items-center gap-2.5">
          {/* LIVE Blinking Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span>LIVE</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Camera className="h-3.5 w-3.5 text-sky-400" />
            <span>ESP32-CAM OV2640</span>
          </div>

          <Badge variant="emerald" size="sm" dot>
            Connected
          </Badge>
        </div>

        {/* Real-time Camera HUD Readouts */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="h-3 w-3 text-sky-400" />
            <span>{timeString}</span>
          </div>

          <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px] text-emerald-400 font-bold">
            {fps} FPS
          </div>

          <div className="hidden sm:block bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300">
            {resolution}
          </div>
        </div>
      </div>

      {/* Main Video Screen Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Subtle Scanlines and Noise */}
        <div className="absolute inset-0 camera-scanline z-10 opacity-40 pointer-events-none" />

        {/* Night Vision Filter effect */}
        {telemetry.nightVision && (
          <div className="absolute inset-0 bg-emerald-950/30 mix-blend-color-dodge z-10 pointer-events-none" />
        )}

        {/* Flash LED Glow effect */}
        {telemetry.flashLed && (
          <div className="absolute inset-0 bg-white/10 mix-blend-overlay z-10 pointer-events-none animate-pulse" />
        )}

        {/* Simulated Camera Video Stream Graphics */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Hospital Corridor Simulation Visual */}
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full object-cover select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ceiling Lights Perspective */}
            <polygon points="450,220 550,220 700,50 300,50" fill="#0f172a" opacity="0.6" />
            <line x1="470" y1="220" x2="350" y2="50" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 15" opacity="0.4" />
            <line x1="530" y1="220" x2="650" y2="50" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 15" opacity="0.4" />

            {/* Floor Perspective & Medical Black Navigation Line */}
            <polygon points="460,280 540,280 850,600 150,600" fill="#0b1120" />
            {/* Floor Navigation Line tracked by IR sensor */}
            <polygon points="495,280 505,280 525,600 475,600" fill="#0284c7" opacity="0.8" />
            <polygon points="498,280 502,280 515,600 485,600" fill="#38bdf8" className="animate-pulse" />

            {/* Left Corridor Wall & Room 101 Doorway */}
            <polygon points="0,0 450,220 460,280 0,600" fill="#0d1526" />
            <rect x="180" y="240" width="80" height="180" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <text x="195" y="265" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
              RM 101
            </text>

            {/* Right Corridor Wall & Room 102 Doorway */}
            <polygon points="1000,0 550,220 540,280 1000,600" fill="#0d1526" />
            <rect x="740" y="240" width="80" height="180" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <text x="755" y="265" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
              RM 102
            </text>

            {/* Far Corridor Junction / Vanishing Point */}
            <rect x="450" y="220" width="100" height="60" fill="#162032" stroke="#1e293b" />
            <text x="468" y="255" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
              JUNCTION A
            </text>

            {/* AI Object Detection Bounding Box Simulation */}
            <rect
              x="430"
              y="290"
              width="140"
              height="110"
              rx="4"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <rect x="430" y="272" width="140" height="18" fill="#10b981" fillOpacity="0.2" />
            <text x="436" y="285" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
              PATH: CLEAR (1.48m)
            </text>

            {/* Central HUD Crosshairs */}
            <circle cx="500" cy="300" r="35" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            <circle cx="500" cy="300" r="4" fill="#38bdf8" />
            <line x1="450" y1="300" x2="480" y2="300" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="520" y1="300" x2="550" y2="300" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="500" y1="250" x2="500" y2="280" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="500" y1="320" x2="500" y2="350" stroke="#38bdf8" strokeWidth="1.5" />
          </svg>

          {/* Placeholder Banner Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md px-6 py-4 rounded-xl border border-slate-700/80 shadow-2xl max-w-md pointer-events-auto">
              <div className="flex items-center justify-center gap-2 text-sky-400 mb-1">
                <Camera className="h-5 w-5" />
                <span className="font-bold text-sm tracking-wider">ESP32-CAM STREAM SIMULATOR</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Live optical camera feed active from OV2640 sensor
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                &ldquo;Camera feed will appear here when connected to physical ESP32-CAM stream endpoint.&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsConfigOpen(true)}
                  className="px-3 py-1 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-[11px] font-mono transition-colors"
                >
                  Configure Hardware IP
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pan-Tilt Servo Angle Indicator HUD */}
        <div className="absolute bottom-16 left-4 z-20 hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
          <Sliders className="h-3.5 w-3.5 text-sky-400" />
          <span>SERVO: {telemetry.servoAngle}°</span>
        </div>
      </div>

      {/* Bottom Camera Toolbar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-950 border-t border-slate-800">
        {/* Left Controls: Snapshot, Flash LED, Night Vision */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCaptureSnapshot}
            className="text-xs h-9 font-semibold"
          >
            <CameraIcon className="h-4 w-4 mr-1.5" />
            Snapshot
          </Button>

          <Button
            variant={telemetry.flashLed ? 'primary' : 'outline'}
            size="sm"
            onClick={toggleFlashLed}
            className={cn('text-xs h-9', telemetry.flashLed && 'bg-amber-500 hover:bg-amber-400 border-amber-400 text-slate-950')}
            title="Toggle ESP32-CAM High-Brightness Flash LED"
          >
            <Lightbulb className="h-4 w-4 mr-1.5" />
            Flash {telemetry.flashLed ? 'ON' : 'OFF'}
          </Button>

          <Button
            variant={telemetry.nightVision ? 'success' : 'outline'}
            size="sm"
            onClick={toggleNightVision}
            className="text-xs h-9"
            title="Toggle Night Vision / IR Filter"
          >
            <Eye className="h-4 w-4 mr-1.5" />
            Night Vision
          </Button>

          {/* Snapshots Gallery Button */}
          {snapshots.length > 0 && (
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-sky-400" />
              <span>Gallery ({snapshots.length})</span>
            </button>
          )}
        </div>

        {/* Right Controls: Pan-Tilt Servo Slider & Fullscreen */}
        <div className="flex items-center gap-3">
          {/* Servo slider */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Tilt:</span>
            <input
              type="range"
              min="30"
              max="150"
              value={telemetry.servoAngle}
              onChange={e => setServoAngle(parseInt(e.target.value, 10))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Resolution Selector */}
          <select
            value={resolution}
            onChange={e => setResolution(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="SVGA 800x600">SVGA 800x600</option>
            <option value="VGA 640x480">VGA 640x480</option>
            <option value="QVGA 320x240">QVGA 320x240</option>
            <option value="UXGA 1600x1200">UXGA 1600x1200</option>
          </select>

          {/* Hardware Config */}
          <button
            onClick={() => setIsConfigOpen(true)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Configure Camera IP Stream"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Snapshot Gallery Modal */}
      <SnapshotGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />

      {/* Hardware Stream Configuration Modal */}
      <StreamConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </div>
  );
}
