import { HospitalLocation } from './robot';

export interface RouteWaypoint {
  id: string;
  name: string;
  type: 'station' | 'corridor' | 'junction' | 'room' | 'unit';
  x: number;
  y: number;
}

export interface HospitalRoute {
  id: string;
  destination: HospitalLocation;
  origin: HospitalLocation;
  distanceMeters: number;
  distanceFormatted: string;
  estimatedTimeSeconds: number;
  estimatedTimeFormatted: string;
  junctionCount: number;
  status: 'Clear' | 'Busy' | 'Caution' | 'Under Maintenance';
  priorityLevel: 'High' | 'Normal';
  waypoints: string[];
  description: string;
  floor: string;
  wing: string;
}
