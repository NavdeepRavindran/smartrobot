export type RobotStatus = 
  | 'ONLINE' 
  | 'DELIVERING' 
  | 'PAUSED' 
  | 'STOPPED' 
  | 'RETURNING' 
  | 'CHARGING'
  | 'OFFLINE';

export type RobotMode = 'AUTONOMOUS' | 'MANUAL';

export type HospitalLocation = 
  | 'Nurse Station'
  | 'Room 101'
  | 'Room 102'
  | 'Room 103'
  | 'ICU'
  | 'Emergency Ward'
  | 'Pharmacy'
  | 'Operation Theatre';

export type ObstacleState = 'Clear' | 'Warning' | 'Blocked';

export interface UltrasonicSensors {
  front: number; // in cm
  left: number;  // in cm
  right: number; // in cm
}

export interface MotorState {
  direction: 'STOP' | 'FORWARD' | 'REVERSE' | 'LEFT' | 'RIGHT';
  leftSpeed: number;  // 0 - 100%
  rightSpeed: number; // 0 - 100%
  rpmLeft: number;
  rpmRight: number;
  currentAmps: number;
}

export interface RobotTelemetry {
  id: string;
  name: string;
  status: RobotStatus;
  mode: RobotMode;
  currentLocation: HospitalLocation;
  destination: HospitalLocation;
  battery: number; // percentage
  batteryVoltage: number; // in Volts (e.g. 11.8V for 3S LiPo)
  speed: number; // percentage (0-100)
  currentSpeedKmH: number; // km/h
  distanceTravelledKm: number; // km
  obstacleStatus: ObstacleState;
  ultrasonic: UltrasonicSensors;
  irLineSensors: [number, number, number, number]; // 0 or 1 for TCRT5000 4-ch
  motorStatus: 'Normal' | 'Overload' | 'Calibrating';
  motors: MotorState;
  signalQuality: 'Excellent' | 'Good' | 'Weak' | 'Disconnected';
  signalRssi: number; // -dBm (e.g. -54)
  temperatureC: number; // Celsius
  temperatureStatus: 'Normal' | 'Warm' | 'Overheat';
  navigationState: string;
  activeDeliveryId?: string;
  servoAngle: number; // 0 to 180 degrees
  flashLed: boolean;
  nightVision: boolean;
  buzzerActive: boolean;
}

export interface RobotSettings {
  robotId: string;
  robotName: string;
  hospitalName: string;
  hospitalLocation: string;
  defaultSpeed: number;
  obstacleThresholdCm: number;
  autoReturnToBase: boolean;
  deliveryAlerts: boolean;
  obstacleAlerts: boolean;
  lowBatteryAlerts: boolean;
  voiceAnnouncements: boolean;
  theme: 'dark' | 'light' | 'system';
  compactMode: boolean;
  streamUrl: string;
  telemetrySimulation: boolean;
}
