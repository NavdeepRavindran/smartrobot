'use client';

import React from 'react';
import { HospitalRoute } from '@/types/route';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MapPin, Navigation, Clock, Gauge, GitBranch, ShieldCheck } from 'lucide-react';
import { useRobot } from '@/lib/robot-context';

interface RouteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: HospitalRoute;
}

export function RouteDetailModal({ isOpen, onClose, route }: RouteDetailModalProps) {
  const { setDestination, startDelivery } = useRobot();

  const handleDispatch = () => {
    setDestination(route.destination);
    startDelivery();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Route Specification: ${route.id}`}
      subtitle={`${route.origin} to ${route.destination}`}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Description Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <p className="text-slate-300 leading-relaxed">{route.description}</p>
          <div className="mt-2.5 flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Location: {route.wing}</span>
            <span>•</span>
            <span>Floor: {route.floor}</span>
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Distance</span>
            <span className="text-sm font-bold font-mono text-white mt-1 block">
              {route.distanceFormatted}
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Transit Time</span>
            <span className="text-sm font-bold font-mono text-sky-400 mt-1 block">
              {route.estimatedTimeFormatted}
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Junction Count</span>
            <span className="text-sm font-bold font-mono text-emerald-400 mt-1 block">
              {route.junctionCount} Nodes
            </span>
          </div>
        </div>

        {/* Waypoints Breakdown */}
        <div>
          <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-sky-400" />
            Sequential Floor Waypoints
          </h4>
          <div className="space-y-2">
            {route.waypoints.map((wp, idx) => (
              <div
                key={wp}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono text-[11px]"
              >
                <span className="h-5 w-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-200 flex-1 font-medium">{wp}</span>
                <span className="text-slate-500 text-[10px]">
                  {idx === 0
                    ? 'Start (Base)'
                    : idx === route.waypoints.length - 1
                    ? 'Final Terminal'
                    : 'Corridor Turn'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleDispatch}>
            Confirm & Dispatch Robot
          </Button>
        </div>
      </div>
    </Modal>
  );
}
