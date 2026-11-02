'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { HospitalLocation } from '@/types/robot';
import { cn } from '@/lib/utils';
import { Bot, Navigation, ShieldCheck, MapPin } from 'lucide-react';

interface HospitalMapSvgProps {
  className?: string;
  onSelectDestination?: (loc: HospitalLocation) => void;
}

// Map Node coordinates on 800x600 SVG canvas
interface NodeCoord {
  name: HospitalLocation | 'Main Corridor' | 'Junction A' | 'Junction B';
  x: number;
  y: number;
  label: string;
  type: 'base' | 'junction' | 'room' | 'unit';
  floor: string;
}

const NODES: NodeCoord[] = [
  { name: 'Nurse Station', x: 400, y: 70, label: 'Nurse Station (Base)', type: 'base', floor: 'Floor 2' },
  { name: 'Main Corridor', x: 400, y: 160, label: 'Main Central Corridor', type: 'junction', floor: 'Floor 2' },
  { name: 'Junction A', x: 400, y: 250, label: 'Junction Alpha (3-Way)', type: 'junction', floor: 'Floor 2' },
  { name: 'Room 101', x: 180, y: 250, label: 'Room 101 (West)', type: 'room', floor: 'Floor 2' },
  { name: 'Room 102', x: 400, y: 340, label: 'Room 102 (Central)', type: 'room', floor: 'Floor 2' },
  { name: 'Room 103', x: 620, y: 250, label: 'Room 103 (East)', type: 'room', floor: 'Floor 2' },
  { name: 'Pharmacy', x: 400, y: 430, label: 'Central Pharmacy Bay', type: 'unit', floor: 'Floor 2' },
  { name: 'Junction B', x: 400, y: 510, label: 'Junction Bravo (South)', type: 'junction', floor: 'Floor 2' },
  { name: 'ICU', x: 180, y: 510, label: 'Intensive Care Unit (ICU)', type: 'unit', floor: 'Floor 2' },
  { name: 'Emergency Ward', x: 400, y: 580, label: 'Emergency Ward (Trauma)', type: 'unit', floor: 'Floor 1-2' },
  { name: 'Operation Theatre', x: 620, y: 510, label: 'Operation Theatre (OT)', type: 'unit', floor: 'Floor 3' },
];

export function HospitalMapSvg({ className, onSelectDestination }: HospitalMapSvgProps) {
  const { telemetry, activeRoute, setDestination } = useRobot();

  // Find node by location name
  const getNode = (name: string): NodeCoord => {
    return NODES.find(n => n.name === name) || NODES[0];
  };

  const robotNode = getNode(telemetry.currentLocation);
  const destNode = getNode(telemetry.destination);

  // Check if a path segment is on the active route
  const isSegmentActive = (from: string, to: string) => {
    if (!activeRoute) return false;
    const waypoints = activeRoute.waypoints;
    const fromIdx = waypoints.indexOf(from);
    const toIdx = waypoints.indexOf(to);
    return fromIdx !== -1 && toIdx !== -1 && Math.abs(fromIdx - toIdx) === 1;
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6 shadow-2xl overflow-hidden',
        className
      )}
    >
      {/* Top Map Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              HOSPITAL AUTONOMOUS TOPOLOGY MAP
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
              FLOOR 2 MED-WING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time track guidance & magnetic line routes for SMR-01
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
            <span>Robot Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-400 ring-2 ring-sky-500/30" />
            <span>Target Dest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 bg-sky-500 rounded-full" />
            <span>Active Path</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Hospital Floorplan */}
      <div className="relative mt-4 w-full aspect-[4/3] max-h-[540px] flex items-center justify-center bg-slate-950 rounded-xl border border-slate-900 overflow-hidden">
        {/* Subtle blueprint grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <svg
          viewBox="0 0 800 640"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Hospital Structural Corridors (Base Grey Lines) */}
          {/* Main Spine: Nurse Station -> Main Corridor -> Junction A -> Room 102 -> Pharmacy -> Junction B -> Emergency Ward */}
          <line x1="400" y1="70" x2="400" y2="160" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="160" x2="400" y2="250" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="250" x2="400" y2="340" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="340" x2="400" y2="430" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="430" x2="400" y2="510" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="510" x2="400" y2="580" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />

          {/* Lateral Wings at Junction A: Room 101 <-> Junction A <-> Room 103 */}
          <line x1="180" y1="250" x2="400" y2="250" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="250" x2="620" y2="250" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />

          {/* Lateral Wings at Junction B: ICU <-> Junction B <-> Operation Theatre */}
          <line x1="180" y1="510" x2="400" y2="510" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="510" x2="620" y2="510" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />

          {/* ACTIVE ROUTE OVERLAYS (Glowing Cyan Animated Dashes) */}
          {/* Nurse Station to Main Corridor */}
          {isSegmentActive('Nurse Station', 'Main Corridor') && (
            <line
              x1="400"
              y1="70"
              x2="400"
              y2="160"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Main Corridor to Junction A */}
          {isSegmentActive('Main Corridor', 'Junction A') && (
            <line
              x1="400"
              y1="160"
              x2="400"
              y2="250"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Junction A to Room 101 */}
          {isSegmentActive('Junction A', 'Room 101') && (
            <line
              x1="400"
              y1="250"
              x2="180"
              y2="250"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Junction A to Room 102 */}
          {isSegmentActive('Junction A', 'Room 102') && (
            <line
              x1="400"
              y1="250"
              x2="400"
              y2="340"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Junction A to Room 103 */}
          {isSegmentActive('Junction A', 'Room 103') && (
            <line
              x1="400"
              y1="250"
              x2="620"
              y2="250"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Junction A through Room 102 to Pharmacy */}
          {(isSegmentActive('Junction A', 'Pharmacy') || isSegmentActive('Room 102', 'Pharmacy')) && (
            <line
              x1="400"
              y1="250"
              x2="400"
              y2="430"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Pharmacy to Junction B */}
          {isSegmentActive('Pharmacy', 'Junction B') && (
            <line
              x1="400"
              y1="430"
              x2="400"
              y2="510"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Junction B to ICU */}
          {isSegmentActive('Junction B', 'ICU') && (
            <line
              x1="400"
              y1="510"
              x2="180"
              y2="510"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Junction B to Emergency Ward */}
          {isSegmentActive('Junction B', 'Emergency Ward') && (
            <line
              x1="400"
              y1="510"
              x2="400"
              y2="580"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* Junction B to Operation Theatre */}
          {isSegmentActive('Junction B', 'Operation Theatre') && (
            <line
              x1="400"
              y1="510"
              x2="620"
              y2="510"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          )}

          {/* WAYPOINT / ROOM NODES */}
          {NODES.map(node => {
            const isDestination = telemetry.destination === node.name;
            const isRobotHere = telemetry.currentLocation === node.name;
            const isSelectable = node.type === 'base' || node.type === 'room' || node.type === 'unit';

            return (
              <g
                key={node.name}
                className={isSelectable ? 'cursor-pointer' : ''}
                onClick={() => {
                  if (isSelectable) {
                    if (onSelectDestination) onSelectDestination(node.name as HospitalLocation);
                    else setDestination(node.name as HospitalLocation);
                  }
                }}
              >
                {/* Node Box */}
                {node.type === 'junction' ? (
                  // Small diamond for corridor junctions
                  <polygon
                    points={`${node.x},${node.y - 10} ${node.x + 10},${node.y} ${node.x},${node.y + 10} ${node.x - 10},${node.y}`}
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                ) : (
                  // Rectangular Room Pod
                  <g>
                    <rect
                      x={node.x - 65}
                      y={node.y - 24}
                      width="130"
                      height="48"
                      rx="8"
                      fill={
                        isDestination
                          ? '#0284c7'
                          : isRobotHere
                          ? '#064e3b'
                          : '#0f172a'
                      }
                      fillOpacity={isDestination ? 0.35 : isRobotHere ? 0.45 : 0.8}
                      stroke={
                        isDestination
                          ? '#38bdf8'
                          : isRobotHere
                          ? '#10b981'
                          : '#334155'
                      }
                      strokeWidth={isDestination || isRobotHere ? 2 : 1}
                    />

                    {/* Room Label */}
                    <text
                      x={node.x}
                      y={node.y - 4}
                      textAnchor="middle"
                      fill={isDestination ? '#38bdf8' : isRobotHere ? '#34d399' : '#f1f5f9'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.name}
                    </text>

                    {/* Subtitle / Floor */}
                    <text
                      x={node.x}
                      y={node.y + 12}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="sans-serif"
                    >
                      {node.floor}
                    </text>
                  </g>
                )}

                {/* Destination Target Marker Indicator */}
                {isDestination && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="28"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-spin"
                  />
                )}
              </g>
            );
          })}

          {/* SMR-01 ROBOT ICON & LIVE POSITION MARKER */}
          <g
            transform={`translate(${robotNode.x}, ${robotNode.y})`}
            className="transition-all duration-700 ease-in-out"
          >
            {/* Pulsing Sonar Ring */}
            <circle cx="0" cy="0" r="22" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="15" fill="#065f46" stroke="#10b981" strokeWidth="2" />

            {/* Custom SMR-01 Visual Icon */}
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
            <circle cx="-3" cy="-3" r="1.5" fill="#34d399" />
            <circle cx="3" cy="-3" r="1.5" fill="#34d399" />
            <rect x="-4" y="2" width="8" height="2" rx="1" fill="#34d399" />

            {/* Floating Tag */}
            <g transform="translate(18, -12)">
              <rect x="0" y="0" width="55" height="18" rx="4" fill="#020617" stroke="#10b981" strokeWidth="1" />
              <text x="6" y="12" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">
                SMR-01
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Map Footer Route Info Bar */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            Navigation Mode:{' '}
            <strong className="text-white font-mono">{telemetry.mode}</strong> (4-Channel IR Floor Tape Follower)
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>Junctions: {activeRoute?.junctionCount || 1}</span>
          <span>Distance: {activeRoute?.distanceFormatted || '58 m'}</span>
          <span className="text-sky-400 font-bold">ETA: {activeRoute?.estimatedTimeFormatted || '1m 25s'}</span>
        </div>
      </div>
    </div>
  );
}
