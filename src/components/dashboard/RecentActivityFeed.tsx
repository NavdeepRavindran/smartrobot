'use client';

import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, Send, Navigation, ShieldCheck } from 'lucide-react';
import { useRobot } from '@/lib/robot-context';

export function RecentActivityFeed() {
  const { telemetry } = useRobot();

  const activities = [
    {
      id: 'act-1',
      title: 'Waypoint Arrival: Junction A',
      desc: 'Line-sensor array aligned with magnetic route. Motors governed at 40% PWM.',
      time: '2 mins ago',
      type: 'info',
      icon: <Navigation className="h-3.5 w-3.5 text-sky-400" />,
    },
    {
      id: 'act-2',
      title: 'Ultrasonic Distance Scan Clear',
      desc: 'Front transducer reports 148 cm clearance. No gurney or pedestrian obstruction.',
      time: '4 mins ago',
      type: 'success',
      icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />,
    },
    {
      id: 'act-3',
      title: 'Payload Lockbox Vault Sealed',
      desc: 'Compartment #2 solenoid lock engaged. RFID latch confirmed secured.',
      time: '8 mins ago',
      type: 'success',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    },
    {
      id: 'act-4',
      title: 'DFPlayer Voice Notification Broadcast',
      desc: '"Attention: Smart Medicine Robot departing Nurse Station." Track #02 played.',
      time: '12 mins ago',
      type: 'info',
      icon: <Activity className="h-3.5 w-3.5 text-purple-400" />,
    },
    {
      id: 'act-5',
      title: 'Delivery DEL-001 Confirmed Received',
      desc: 'Room 101 bedside lockbox opened by Charge Nurse Sarah M. OTP verified.',
      time: '25 mins ago',
      type: 'success',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            REAL-TIME ROBOT ACTIVITY LOG
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">LIVE BUS</span>
      </div>

      <div className="mt-4 space-y-3.5">
        {activities.map(act => (
          <div key={act.id} className="flex items-start gap-3 text-xs">
            <div className="mt-0.5 p-1 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
              {act.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-200 truncate">{act.title}</span>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">{act.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
