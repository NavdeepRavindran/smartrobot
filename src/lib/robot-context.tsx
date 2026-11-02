'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  RobotTelemetry, 
  RobotSettings, 
  HospitalLocation, 
  RobotStatus, 
  MotorState 
} from '@/types/robot';
import { Delivery, DeliveryStatus } from '@/types/delivery';
import { HospitalRoute } from '@/types/route';
import { HardwareModule, SystemDiagnosticSummary } from '@/types/system';
import { 
  INITIAL_ROBOT_TELEMETRY, 
  INITIAL_SETTINGS, 
  MOCK_DELIVERIES, 
  HOSPITAL_ROUTES, 
  HARDWARE_MODULES, 
  SYSTEM_DIAGNOSTICS_SUMMARY 
} from '@/lib/mock-data';
import { soundFx } from '@/lib/speech';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface CameraSnapshot {
  id: string;
  timestamp: string;
  dataUrl: string;
  resolution: string;
  location: string;
}

interface RobotContextType {
  telemetry: RobotTelemetry;
  settings: RobotSettings;
  deliveries: Delivery[];
  routes: HospitalRoute[];
  hardware: HardwareModule[];
  diagnostics: SystemDiagnosticSummary;
  toasts: ToastItem[];
  snapshots: CameraSnapshot[];
  activeRoute: HospitalRoute | null;
  // Controls
  startDelivery: () => void;
  pauseDelivery: () => void;
  emergencyStop: () => void;
  returnToBase: () => void;
  setDestination: (dest: HospitalLocation) => void;
  setManualDrive: (direction: MotorState['direction']) => void;
  setSpeed: (speed: number) => void;
  setServoAngle: (angle: number) => void;
  toggleFlashLed: () => void;
  toggleNightVision: () => void;
  updateSettings: (newSettings: Partial<RobotSettings>) => void;
  // Delivery management
  addDelivery: (newDeliv: Partial<Delivery>) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => void;
  // Camera
  addSnapshot: (dataUrl: string) => void;
  deleteSnapshot: (id: string) => void;
  // Diagnostics
  runSelfDiagnostics: () => Promise<void>;
  isDiagnosing: boolean;
  // Toasts
  addToast: (title: string, message: string, type?: ToastItem['type']) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

const RobotContext = createContext<RobotContextType | null>(null);

const SETTINGS_STORAGE_KEY = 'smr_settings_config';
const DELIVERIES_STORAGE_KEY = 'smr_deliveries_records';

export function RobotProvider({ children }: { children: React.ReactNode }) {
  const [telemetry, setTelemetry] = useState<RobotTelemetry>(INITIAL_ROBOT_TELEMETRY);
  const [settings, setSettings] = useState<RobotSettings>(INITIAL_SETTINGS);
  const [deliveries, setDeliveries] = useState<Delivery[]>(MOCK_DELIVERIES);
  const [routes] = useState<HospitalRoute[]>(HOSPITAL_ROUTES);
  const [hardware, setHardware] = useState<HardwareModule[]>(HARDWARE_MODULES);
  const [diagnostics, setDiagnostics] = useState<SystemDiagnosticSummary>(SYSTEM_DIAGNOSTICS_SUMMARY);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [snapshots, setSnapshots] = useState<CameraSnapshot[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Load persisted settings and deliveries on client mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(storedSettings) }));
      }
      const storedDeliveries = localStorage.getItem(DELIVERIES_STORAGE_KEY);
      if (storedDeliveries) {
        setDeliveries(JSON.parse(storedDeliveries));
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const addToast = useCallback((title: string, message: string, type: ToastItem['type'] = 'info') => {
    const newToast: ToastItem = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setToasts(prev => [newToast, ...prev.slice(0, 7)]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Update settings and persist
  const updateSettings = useCallback((newSettings: Partial<RobotSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage save error
      }
      return updated;
    });
    addToast('Settings Updated', 'Preferences have been saved locally.', 'success');
  }, [addToast]);

  // Telemetry simulation loop (makes the robot feel alive and active)
  useEffect(() => {
    if (!settings.telemetrySimulation) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        // If stopped, keep zeroed speeds
        if (prev.status === 'STOPPED' || prev.status === 'PAUSED' || prev.status === 'OFFLINE') {
          return {
            ...prev,
            motors: {
              ...prev.motors,
              leftSpeed: 0,
              rightSpeed: 0,
              rpmLeft: 0,
              rpmRight: 0,
              currentAmps: 0.12,
            },
            currentSpeedKmH: 0,
          };
        }

        // Slight live jitter on sensors
        const frontJitter = Math.floor(Math.random() * 5) - 2;
        const leftJitter = Math.floor(Math.random() * 3) - 1;
        const rightJitter = Math.floor(Math.random() * 3) - 1;

        const newFront = Math.max(25, Math.min(320, prev.ultrasonic.front + frontJitter));
        const newLeft = Math.max(40, Math.min(180, prev.ultrasonic.left + leftJitter));
        const newRight = Math.max(40, Math.min(180, prev.ultrasonic.right + rightJitter));

        // Line sensor cycling
        const irStates: [number, number, number, number][] = [
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 1, 0],
          [0, 1, 1, 0],
          [0, 1, 0, 0],
        ];
        const nextIr = irStates[Math.floor(Math.random() * irStates.length)];

        // Increment distance slightly if in motion
        const isMoving = prev.status === 'DELIVERING' || prev.status === 'RETURNING';
        const distIncrement = isMoving ? 0.001 : 0;
        const currentSpeed = isMoving ? parseFloat((1.6 + Math.random() * 0.4).toFixed(1)) : 0;

        return {
          ...prev,
          distanceTravelledKm: parseFloat((prev.distanceTravelledKm + distIncrement).toFixed(3)),
          currentSpeedKmH: currentSpeed,
          ultrasonic: {
            front: newFront,
            left: newLeft,
            right: newRight,
          },
          irLineSensors: nextIr,
          motors: {
            ...prev.motors,
            rpmLeft: isMoving ? Math.floor(115 + Math.random() * 6) : 0,
            rpmRight: isMoving ? Math.floor(115 + Math.random() * 6) : 0,
            currentAmps: isMoving ? parseFloat((1.1 + Math.random() * 0.15).toFixed(2)) : 0.2,
          },
          batteryVoltage: parseFloat((11.8 + (prev.battery / 100) * 0.8).toFixed(2)),
          temperatureC: parseFloat((31.0 + Math.random() * 0.8).toFixed(1)),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [settings.telemetrySimulation]);

  // Delivery progress simulation when in DELIVERING state
  useEffect(() => {
    if (telemetry.status !== 'DELIVERING') return;

    const progressInterval = setInterval(() => {
      setDeliveries(prev => {
        return prev.map(del => {
          if (del.status === 'In Progress' && del.progressPercent < 100) {
            const nextPercent = Math.min(100, del.progressPercent + 2);
            if (nextPercent === 100) {
              addToast('Delivery Complete', `${del.medicine} arrived at ${del.destination}.`, 'success');
              if (settings.voiceAnnouncements) {
                soundFx.speakAnnouncement(`Delivery to ${del.destination} is complete.`);
              }
              return { ...del, progressPercent: 100, status: 'Delivered', completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            }
            return { ...del, progressPercent: nextPercent };
          }
          return del;
        });
      });
    }, 1500);

    return () => clearInterval(progressInterval);
  }, [telemetry.status, addToast, settings.voiceAnnouncements]);

  // Find active route for current destination
  const activeRoute = routes.find(r => r.destination === telemetry.destination) || routes[0];

  // Quick Controls
  const startDelivery = useCallback(() => {
    setTelemetry(prev => ({
      ...prev,
      status: 'DELIVERING',
      mode: 'AUTONOMOUS',
      motors: {
        ...prev.motors,
        direction: 'FORWARD',
        leftSpeed: prev.speed,
        rightSpeed: prev.speed,
      },
      navigationState: `Navigating to ${prev.destination} (Autonomous Line Tracking)`,
    }));
    soundFx.playBeep(980, 0.15);
    addToast('Delivery Started', `SMR-01 dispatched to ${telemetry.destination}.`, 'success');
    if (settings.voiceAnnouncements) {
      soundFx.speakAnnouncement(`Smart Medicine Robot starting autonomous delivery to ${telemetry.destination}`);
    }
  }, [telemetry.destination, addToast, settings.voiceAnnouncements]);

  const pauseDelivery = useCallback(() => {
    setTelemetry(prev => ({
      ...prev,
      status: 'PAUSED',
      motors: {
        ...prev.motors,
        direction: 'STOP',
        leftSpeed: 0,
        rightSpeed: 0,
      },
      navigationState: 'Holding position (Paused by operator)',
    }));
    soundFx.playBeep(600, 0.2);
    addToast('Robot Paused', 'Autonomous motion suspended. Holding current position.', 'warning');
    if (settings.voiceAnnouncements) {
      soundFx.speakAnnouncement('Robot operation paused.');
    }
  }, [addToast, settings.voiceAnnouncements]);

  const emergencyStop = useCallback(() => {
    setTelemetry(prev => ({
      ...prev,
      status: 'STOPPED',
      mode: 'MANUAL',
      speed: 0,
      motors: {
        ...prev.motors,
        direction: 'STOP',
        leftSpeed: 0,
        rightSpeed: 0,
        rpmLeft: 0,
        rpmRight: 0,
        currentAmps: 0,
      },
      navigationState: 'EMERGENCY STOP ENGAGED. Brakes locked.',
    }));
    soundFx.playEmergencyAlert();
    addToast('EMERGENCY STOP ACTIVATED', 'All motor channels cut immediately. System halted.', 'error');
    if (settings.voiceAnnouncements) {
      soundFx.speakAnnouncement('Warning: Emergency Stop Activated. All actuators locked.');
    }
  }, [addToast, settings.voiceAnnouncements]);

  const returnToBase = useCallback(() => {
    setTelemetry(prev => ({
      ...prev,
      destination: 'Nurse Station',
      status: 'RETURNING',
      mode: 'AUTONOMOUS',
      motors: {
        ...prev.motors,
        direction: 'FORWARD',
        leftSpeed: prev.speed,
        rightSpeed: prev.speed,
      },
      navigationState: 'Returning to Nurse Station Base (Docking Bay 1)',
    }));
    soundFx.playBeep(750, 0.15);
    addToast('Return to Base', 'SMR-01 is returning to Nurse Station.', 'info');
    if (settings.voiceAnnouncements) {
      soundFx.speakAnnouncement('Smart Medicine Robot returning to Nurse Station base.');
    }
  }, [addToast, settings.voiceAnnouncements]);

  const setDestination = useCallback((dest: HospitalLocation) => {
    setTelemetry(prev => ({
      ...prev,
      destination: dest,
      navigationState: `Destination set to ${dest}. Route plotted.`,
    }));
    soundFx.playBeep(850, 0.1);
    addToast('Destination Updated', `Target waypoint set to ${dest}.`, 'info');
  }, [addToast]);

  const setManualDrive = useCallback((direction: MotorState['direction']) => {
    setTelemetry(prev => {
      let left = prev.speed;
      let right = prev.speed;
      if (direction === 'STOP') {
        left = 0;
        right = 0;
      } else if (direction === 'LEFT') {
        left = 0;
        right = prev.speed;
      } else if (direction === 'RIGHT') {
        left = prev.speed;
        right = 0;
      }

      return {
        ...prev,
        mode: 'MANUAL',
        status: direction === 'STOP' ? 'ONLINE' : 'DELIVERING',
        motors: {
          ...prev.motors,
          direction,
          leftSpeed: left,
          rightSpeed: right,
        },
        navigationState: `Manual teleoperation active: ${direction}`,
      };
    });
    soundFx.playBeep(700, 0.08);
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setTelemetry(prev => ({
      ...prev,
      speed: newSpeed,
      motors: {
        ...prev.motors,
        leftSpeed: prev.motors.direction === 'STOP' ? 0 : newSpeed,
        rightSpeed: prev.motors.direction === 'STOP' ? 0 : newSpeed,
      },
    }));
  }, []);

  const setServoAngle = useCallback((angle: number) => {
    setTelemetry(prev => ({ ...prev, servoAngle: Math.max(0, Math.min(180, angle)) }));
  }, []);

  const toggleFlashLed = useCallback(() => {
    setTelemetry(prev => {
      const next = !prev.flashLed;
      addToast('ESP32-CAM Illumination', next ? 'High-brightness Flash LED ON' : 'Flash LED OFF', 'info');
      return { ...prev, flashLed: next };
    });
  }, [addToast]);

  const toggleNightVision = useCallback(() => {
    setTelemetry(prev => {
      const next = !prev.nightVision;
      addToast('Night Vision Filter', next ? 'IR Spectral Filter Enabled' : 'Color Spectrum Restored', 'info');
      return { ...prev, nightVision: next };
    });
  }, [addToast]);

  const addDelivery = useCallback((newDeliv: Partial<Delivery>) => {
    const fullDelivery: Delivery = {
      id: `DEL-00${deliveries.length + 1}`,
      destination: newDeliv.destination || 'Room 101',
      origin: newDeliv.origin || 'Nurse Station',
      medicine: newDeliv.medicine || 'Prescription Medicine Pack',
      dosage: newDeliv.dosage || 'Standard Unit',
      patientName: newDeliv.patientName || 'Hospital Patient',
      patientBed: newDeliv.patientBed || 'Bed A-1',
      requestedBy: newDeliv.requestedBy || 'Central Staff',
      requestedRole: newDeliv.requestedRole || 'Registered Nurse',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      robotId: 'SMR-01',
      status: 'Pending',
      priority: newDeliv.priority || 'Routine',
      compartment: newDeliv.compartment || 1,
      progressPercent: 0,
      notes: newDeliv.notes || 'Automated hospital delivery dispatch.',
    };

    setDeliveries(prev => {
      const updated = [fullDelivery, ...prev];
      try {
        localStorage.setItem(DELIVERIES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    addToast('Delivery Created', `Mission ${fullDelivery.id} queued for ${fullDelivery.destination}.`, 'success');
  }, [deliveries.length, addToast]);

  const updateDeliveryStatus = useCallback((id: string, status: DeliveryStatus) => {
    setDeliveries(prev => {
      const updated = prev.map(d => {
        if (d.id === id) {
          return {
            ...d,
            status,
            progressPercent: status === 'Delivered' ? 100 : status === 'In Progress' ? 50 : 0,
            completedTime: status === 'Delivered' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.completedTime,
          };
        }
        return d;
      });
      try {
        localStorage.setItem(DELIVERIES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addToast('Delivery Status Updated', `Mission ${id} marked as ${status}.`, 'info');
  }, [addToast]);

  const addSnapshot = useCallback((dataUrl: string) => {
    const snapshot: CameraSnapshot = {
      id: `SNAP-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dataUrl,
      resolution: 'SVGA 800x600',
      location: telemetry.currentLocation,
    };
    setSnapshots(prev => [snapshot, ...prev]);
    soundFx.playBeep(1200, 0.08);
    addToast('Snapshot Captured', `Saved to telemetry gallery (${snapshot.id}).`, 'success');
  }, [telemetry.currentLocation, addToast]);

  const deleteSnapshot = useCallback((id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
    addToast('Snapshot Removed', 'Snapshot deleted from local gallery.', 'info');
  }, [addToast]);

  const runSelfDiagnostics = useCallback(async () => {
    setIsDiagnosing(true);
    addToast('Diagnostics Initiated', 'Pinging ESP32 FreeRTOS tasks and sensor arrays...', 'info');

    // Simulate diagnostic cycling
    await new Promise(r => setTimeout(r, 2200));

    setHardware(prev => 
      prev.map(mod => ({
        ...mod,
        status: 'Operational',
        statusText: mod.category === 'Vision' || mod.category === 'Power/Comms' ? 'Connected' : 'Operational',
        lastChecked: 'Just now (Passed Self-Test)',
      }))
    );

    setDiagnostics(prev => ({
      ...prev,
      overallHealthScore: 100,
      activeFaultsCount: 0,
      lastPingMs: 11,
      freeHeapKb: 288,
    }));

    setIsDiagnosing(false);
    soundFx.playBeep(1046, 0.25);
    addToast('Diagnostics Completed', 'All 16 hardware subsystems verified operational. 0 faults detected.', 'success');
  }, [addToast]);

  return (
    <RobotContext.Provider
      value={{
        telemetry,
        settings,
        deliveries,
        routes,
        hardware,
        diagnostics,
        toasts,
        snapshots,
        activeRoute,
        startDelivery,
        pauseDelivery,
        emergencyStop,
        returnToBase,
        setDestination,
        setManualDrive,
        setSpeed,
        setServoAngle,
        toggleFlashLed,
        toggleNightVision,
        updateSettings,
        addDelivery,
        updateDeliveryStatus,
        addSnapshot,
        deleteSnapshot,
        runSelfDiagnostics,
        isDiagnosing,
        addToast,
        dismissToast,
        clearToasts,
      }}
    >
      {children}
    </RobotContext.Provider>
  );
}

export function useRobot(): RobotContextType {
  const context = useContext(RobotContext);
  if (!context) {
    throw new Error('useRobot must be used within a RobotProvider');
  }
  return context;
}
