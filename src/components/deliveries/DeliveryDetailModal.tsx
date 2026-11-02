'use client';

import React from 'react';
import { Delivery } from '@/types/delivery';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRobot } from '@/lib/robot-context';
import { 
  Package, 
  MapPin, 
  User, 
  Clock, 
  Bot, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface DeliveryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery;
}

export function DeliveryDetailModal({ isOpen, onClose, delivery }: DeliveryDetailModalProps) {
  const { updateDeliveryStatus } = useRobot();

  const getStatusBadge = (status: Delivery['status']) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="emerald" size="sm" dot>Delivered</Badge>;
      case 'In Progress':
        return <Badge variant="cyan" size="sm" dot>In Progress</Badge>;
      case 'Pending':
        return <Badge variant="amber" size="sm" dot>Pending</Badge>;
      case 'Cancelled':
        return <Badge variant="crimson" size="sm" dot>Cancelled</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delivery Dossier: ${delivery.id}`}
      subtitle={`Prescription Payload for ${delivery.patientName}`}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Header Status Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">Status & Priority</span>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(delivery.status)}
              <span className="font-mono text-xs font-semibold text-slate-300">
                {delivery.priority}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono block">Vault Compartment</span>
            <div className="flex items-center gap-1.5 mt-1 font-mono font-bold text-sky-400">
              <Lock className="h-3.5 w-3.5" />
              <span>BAY #{delivery.compartment}</span>
            </div>
          </div>
        </div>

        {/* Medicine & Patient Details */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Prescribed Medicine</span>
            <div className="text-sm font-bold text-white mt-0.5">{delivery.medicine}</div>
            <div className="text-slate-400 text-xs mt-0.5">Dosage / Unit: {delivery.dosage}</div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Patient Name</span>
              <span className="font-semibold text-slate-200">{delivery.patientName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Bed / Station</span>
              <span className="font-semibold text-slate-200">{delivery.patientBed}</span>
            </div>
          </div>
        </div>

        {/* Logistics Routing */}
        <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Origin Station</span>
            <div className="flex items-center gap-1.5 mt-1 text-slate-300 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>{delivery.origin}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Destination</span>
            <div className="flex items-center gap-1.5 mt-1 text-sky-300 font-semibold">
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              <span>{delivery.destination}</span>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>Requested By:</span>
            <span className="text-slate-200 font-medium">{delivery.requestedBy} ({delivery.requestedRole})</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Dispatch Timestamp:</span>
            <span className="text-slate-200 font-mono">{delivery.time}</span>
          </div>
          {delivery.completedTime && (
            <div className="flex justify-between text-slate-400">
              <span>Delivery Confirmed:</span>
              <span className="text-emerald-400 font-mono font-semibold">{delivery.completedTime}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-400">
            <span>Assigned Carrier:</span>
            <span className="text-sky-400 font-mono font-semibold">{delivery.robotId}</span>
          </div>
        </div>

        {delivery.notes && (
          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400">
            <strong>Notes:</strong> {delivery.notes}
          </div>
        )}

        {/* Status Transition Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {delivery.status !== 'Delivered' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  updateDeliveryStatus(delivery.id, 'Delivered');
                  onClose();
                }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Mark Delivered
              </Button>
            )}

            {delivery.status !== 'In Progress' && delivery.status !== 'Delivered' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  updateDeliveryStatus(delivery.id, 'In Progress');
                  onClose();
                }}
              >
                Start Transit
              </Button>
            )}

            {delivery.status !== 'Cancelled' && delivery.status !== 'Delivered' && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  updateDeliveryStatus(delivery.id, 'Cancelled');
                  onClose();
                }}
              >
                Cancel
              </Button>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
