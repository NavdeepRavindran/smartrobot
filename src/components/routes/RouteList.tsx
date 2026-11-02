'use client';

import React, { useState } from 'react';
import { useRobot } from '@/lib/robot-context';
import { HospitalRoute } from '@/types/route';
import { 
  Milestone, 
  Clock, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Info,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { RouteDetailModal } from './RouteDetailModal';

export function RouteList() {
  const { routes, telemetry, setDestination, startDelivery } = useRobot();
  const [selectedRoute, setSelectedRoute] = useState<HospitalRoute | null>(null);

  const getStatusBadge = (status: HospitalRoute['status']) => {
    switch (status) {
      case 'Clear':
        return <Badge variant="emerald" size="sm" dot>Clear</Badge>;
      case 'Busy':
        return <Badge variant="amber" size="sm" dot>High Traffic</Badge>;
      case 'Caution':
        return <Badge variant="crimson" size="sm" dot>Caution</Badge>;
      default:
        return <Badge variant="slate" size="sm">Standard</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map(route => {
          const isSelected = telemetry.destination === route.destination;

          return (
            <div
              key={route.id}
              className={cn(
                'rounded-2xl border p-5 transition-all flex flex-col justify-between backdrop-blur-md shadow-lg',
                isSelected
                  ? 'bg-sky-500/10 border-sky-500 shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              )}
            >
              <div>
                {/* Route Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">{route.id}</span>
                    {isSelected && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500 text-white font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  {getStatusBadge(route.status)}
                </div>

                {/* Destination & Wing */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-base font-bold text-white">
                    <span>{route.origin}</span>
                    <ArrowRight className="h-4 w-4 text-sky-400 shrink-0" />
                    <span className="text-sky-300">{route.destination}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{route.wing} • {route.floor}</p>
                </div>

                {/* Waypoints line */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 overflow-x-auto">
                  {route.waypoints.map((wp, idx) => (
                    <React.Fragment key={wp}>
                      <span className={cn('whitespace-nowrap', wp === route.destination ? 'text-sky-300 font-bold' : '')}>
                        {wp}
                      </span>
                      {idx < route.waypoints.length - 1 && (
                        <span className="text-slate-600">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Route Metrics */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 text-[10px] block">Distance</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{route.distanceFormatted}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 text-[10px] block">Est. Time</span>
                    <span className="font-bold text-sky-400 mt-0.5 block">{route.estimatedTimeFormatted}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 text-[10px] block">Junctions</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{route.junctionCount} Nodes</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRoute(route)}
                  className="flex-1 text-xs"
                >
                  <Info className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  Route Details
                </Button>

                <Button
                  variant={isSelected ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => {
                    setDestination(route.destination);
                    if (telemetry.status !== 'DELIVERING') {
                      startDelivery();
                    }
                  }}
                  className="flex-1 text-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5 mr-1" />
                  {isSelected ? 'In Progress' : 'Dispatch'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Route Detail Modal */}
      {selectedRoute && (
        <RouteDetailModal
          isOpen={!!selectedRoute}
          onClose={() => setSelectedRoute(null)}
          route={selectedRoute}
        />
      )}
    </div>
  );
}
