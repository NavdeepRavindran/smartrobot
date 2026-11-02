'use client';

import React, { useState } from 'react';
import { useRobot } from '@/lib/robot-context';
import { HospitalLocation } from '@/types/robot';
import { DeliveryPriority } from '@/types/delivery';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface NewDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DESTINATION_OPTIONS: HospitalLocation[] = [
  'Room 101',
  'Room 102',
  'Room 103',
  'ICU',
  'Emergency Ward',
  'Pharmacy',
  'Operation Theatre',
  'Nurse Station',
];

export function NewDeliveryModal({ isOpen, onClose }: NewDeliveryModalProps) {
  const { addDelivery, setDestination } = useRobot();

  const [destination, setDestinationState] = useState<HospitalLocation>('Room 101');
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientBed, setPatientBed] = useState('');
  const [requestedBy, setRequestedBy] = useState('Nurse Station Alpha');
  const [priority, setPriority] = useState<DeliveryPriority>('Routine');
  const [compartment, setCompartment] = useState(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicine || !patientName) return;

    addDelivery({
      destination,
      origin: 'Pharmacy',
      medicine,
      dosage: dosage || 'Standard Pack',
      patientName,
      patientBed: patientBed || 'Bed A-1',
      requestedBy,
      requestedRole: 'Staff Nurse',
      priority,
      compartment,
      notes,
    });

    setDestination(destination);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch New Medicine Delivery"
      subtitle="Queue autonomous payload for SMR-01 delivery carrier"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Destination */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Target Ward / Room Destination
            </label>
            <select
              value={destination}
              onChange={e => setDestinationState(e.target.value as HospitalLocation)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            >
              {DESTINATION_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Priority Urgency
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as DeliveryPriority)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="Routine">Routine (Scheduled)</option>
              <option value="Urgent">Urgent (Expedited)</option>
              <option value="Stat (Emergency)">Stat (Emergency Flash)</option>
            </select>
          </div>
        </div>

        {/* Medicine Name & Dosage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Prescription / Medicine Name *
            </label>
            <input
              type="text"
              required
              value={medicine}
              onChange={e => setMedicine(e.target.value)}
              placeholder="e.g. Paracetamol IV 1000mg"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Dosage & Form
            </label>
            <input
              type="text"
              value={dosage}
              onChange={e => setDosage(e.target.value)}
              placeholder="e.g. 1 Infusion Bag (100mL)"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Patient Name & Bed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Patient Name *
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Bed ID / Station
            </label>
            <input
              type="text"
              value={patientBed}
              onChange={e => setPatientBed(e.target.value)}
              placeholder="e.g. Bed 102-A"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Compartment & Requester */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Lockbox Vault Compartment (1-4)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCompartment(c)}
                  className={`py-2 rounded-lg border font-mono font-bold text-center transition-all ${
                    compartment === c
                      ? 'bg-sky-500 text-white border-sky-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Bay {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Requested By Station
            </label>
            <input
              type="text"
              value={requestedBy}
              onChange={e => setRequestedBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Handling Instructions / Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Special refrigeration, OTP delivery verification..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 resize-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Confirm & Queue Delivery
          </Button>
        </div>
      </form>
    </Modal>
  );
}
