'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { 
  BatteryCharging, 
  Gauge, 
  Milestone, 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  Thermometer, 
  Compass,
  AlertTriangle
} from 'lucide-react';
import { StatGauge } from '@/components/ui/StatGauge';

export function TelemetryGrid() {
  const { telemetry } = useRobot();

  const getObstacleStatusColor = (): 'normal' | 'warning' | 'danger' => {
    if (telemetry.obstacleStatus === 'Blocked') return 'danger';
    if (telemetry.obstacleStatus === 'Warning') return 'warning';
    return 'normal';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* Battery */}
      <StatGauge
        label="Battery"
        value={telemetry.battery}
        unit="%"
        percentage={telemetry.battery}
        status={telemetry.battery > 25 ? 'normal' : 'danger'}
        icon={<BatteryCharging className="h-4 w-4 text-emerald-400" />}
        subtitle={`${telemetry.batteryVoltage} V (3S Li-ion pack)`}
      />

      {/* Speed */}
      <StatGauge
        label="Speed"
        value={telemetry.speed}
        unit="%"
        percentage={telemetry.speed}
        status="info"
        icon={<Gauge className="h-4 w-4 text-sky-400" />}
        subtitle={`${telemetry.currentSpeedKmH} km/h (Differential Drive)`}
      />

      {/* Distance Travelled */}
      <StatGauge
        label="Distance Travelled"
        value={telemetry.distanceTravelledKm}
        unit="km"
        status="normal"
        icon={<Milestone className="h-4 w-4 text-purple-400" />}
        subtitle="Odometer (Optical Encoders)"
      />

      {/* Obstacle Detection */}
      <StatGauge
        label="Obstacle Detection"
        value={telemetry.obstacleStatus}
        status={getObstacleStatusColor()}
        icon={
          telemetry.obstacleStatus === 'Clear' ? (
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          )
        }
        subtitle={`Front: ${telemetry.ultrasonic.front} cm | Left: ${telemetry.ultrasonic.left} cm`}
      />

      {/* Motor Status */}
      <StatGauge
        label="Motor Status"
        value={telemetry.motorStatus}
        status="normal"
        icon={<Cpu className="h-4 w-4 text-sky-400" />}
        subtitle={`L298N: ${telemetry.motors.currentAmps} A draw`}
      />

      {/* Signal */}
      <StatGauge
        label="Signal"
        value={telemetry.signalQuality}
        status="normal"
        icon={<Wifi className="h-4 w-4 text-emerald-400" />}
        subtitle={`${telemetry.signalRssi} dBm (ESP32 Wi-Fi)`}
      />

      {/* Temperature */}
      <StatGauge
        label="Temperature"
        value={telemetry.temperatureStatus}
        status="normal"
        icon={<Thermometer className="h-4 w-4 text-emerald-400" />}
        subtitle={`${telemetry.temperatureC} °C (Chassis Internal)`}
      />

      {/* Navigation */}
      <StatGauge
        label="Navigation"
        value={telemetry.navigationState.includes('Line') ? 'Following Line' : 'Holding'}
        status="info"
        icon={<Compass className="h-4 w-4 text-cyan-400" />}
        subtitle={`IR Sens: [${telemetry.irLineSensors.join(',')}]`}
      />
    </div>
  );
}
