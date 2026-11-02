import { HospitalLocation } from './robot';

export type DeliveryStatus = 'In Progress' | 'Delivered' | 'Pending' | 'Cancelled';
export type DeliveryPriority = 'Routine' | 'Urgent' | 'Stat (Emergency)';

export interface Delivery {
  id: string;
  destination: HospitalLocation;
  origin: HospitalLocation;
  medicine: string;
  dosage: string;
  patientName: string;
  patientBed: string;
  requestedBy: string;
  requestedRole: string;
  time: string;
  completedTime?: string;
  robotId: string;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  notes?: string;
  compartment: number; // 1 to 4
  progressPercent: number;
}
