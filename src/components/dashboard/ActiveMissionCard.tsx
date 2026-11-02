'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { 
  Package, 
  MapPin, 
  Clock, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function ActiveMissionCard() {
  const { deliveries, telemetry, activeRoute, updateDeliveryStatus } = useRobot();

  const activeMission = deliveries.find(d => d.status === 'In Progress') || deliveries[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              ACTIVE PAYLOAD DISPATCH
            </h3>
          </div>
          <Badge variant={activeMission?.status === 'In Progress' ? 'cyan' : 'emerald'} size="sm" dot>
            {activeMission?.status}
          </Badge>
        </div>

        {/* Mission Payload Info */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Mission ID: {activeMission?.id}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{activeMission?.medicine}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Dosage: {activeMission?.dosage} • For: <strong className="text-slate-200">{activeMission?.patientName}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Vault Bay</span>
              <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1 justify-end mt-0.5">
                <Lock className="h-3 w-3" />
                BAY #{activeMission?.compartment}
              </span>
            </div>
          </div>

          {/* Route path */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>{activeMission?.origin}</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
            <div className="flex items-center gap-1.5 text-sky-300 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              <span>{activeMission?.destination}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Transit Completion</span>
              <span className="font-bold text-sky-400">{activeMission?.progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${activeMission?.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono text-[11px]">
          ETA: <strong className="text-white">{activeRoute?.estimatedTimeFormatted || '1 min'}</strong>
        </span>

        {activeMission?.status === 'In Progress' && (
          <Button
            variant="success"
            size="sm"
            onClick={() => updateDeliveryStatus(activeMission.id, 'Delivered')}
            className="text-xs h-8"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Confirm Arrival
          </Button>
        )}
      </div>
    </div>
  );
}
