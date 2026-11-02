'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DeliveryTable } from '@/components/deliveries/DeliveryTable';
import { Package, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useRobot } from '@/lib/robot-context';
import { Badge } from '@/components/ui/Badge';

export default function DeliveriesPage() {
  const { deliveries } = useRobot();

  const deliveredCount = deliveries.filter(d => d.status === 'Delivered').length;
  const inProgressCount = deliveries.filter(d => d.status === 'In Progress').length;
  const pendingCount = deliveries.filter(d => d.status === 'Pending').length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  MEDICINE DELIVERY & PAYLOAD LOGISTICS
                </h2>
                <Badge variant="cyan" size="sm">
                  {deliveries.length} Prescriptions Logged
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                St. Jude automated medicine ledger with compartment lock verification and audit tracking
              </p>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{deliveredCount} Delivered</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{inProgressCount} En Route</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{pendingCount} Queued</span>
            </div>
          </div>
        </div>

        {/* Deliveries Table & Manager */}
        <DeliveryTable />
      </div>
    </AppShell>
  );
}
