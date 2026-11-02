'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useRobot } from '@/lib/robot-context';
import { 
  Settings as SettingsIcon, 
  Bot, 
  Hospital, 
  Navigation, 
  Bell, 
  Palette, 
  Save, 
  RotateCcw,
  Sliders,
  Volume2,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { INITIAL_SETTINGS } from '@/lib/mock-data';

export default function SettingsPage() {
  const { settings, updateSettings, addToast } = useRobot();

  const [formState, setFormState] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    setFormState({ ...INITIAL_SETTINGS });
    updateSettings(INITIAL_SETTINGS);
    addToast('Defaults Restored', 'System settings reset to factory configuration.', 'info');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  SYSTEM & FLEET CONFIGURATION
                </h2>
                <Badge variant="cyan" size="sm">
                  PERSISTENT STORAGE
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage autonomous threshold profiles, hospital sector assignments, audio synthesis and theme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleResetDefaults} className="text-xs h-9">
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset Defaults
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} className="text-xs h-9 font-semibold">
              <Save className="h-3.5 w-3.5 mr-1" />
              Save Settings
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Configuration changes committed to localStorage. Settings are active immediately.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Robot Profile */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Bot className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">ROBOT IDENTIFICATION</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Robot Hardware Identifier
                </label>
                <input
                  type="text"
                  value={formState.robotId}
                  onChange={e => setFormState({ ...formState, robotId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Assigned Robot Designation Name
                </label>
                <input
                  type="text"
                  value={formState.robotName}
                  onChange={e => setFormState({ ...formState, robotName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Hospital Environment */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Hospital className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">HOSPITAL FACILITY PROFILE</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Medical Institution Name
                </label>
                <input
                  type="text"
                  value={formState.hospitalName}
                  onChange={e => setFormState({ ...formState, hospitalName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Hospital Location / Deployment Wing
                </label>
                <input
                  type="text"
                  value={formState.hospitalLocation}
                  onChange={e => setFormState({ ...formState, hospitalLocation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Autonomous Navigation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Navigation className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">NAVIGATION & SAFETY PARAMETERS</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              {/* Default Speed */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Default Cruising Speed</span>
                  <span className="font-mono font-bold text-sky-400">{formState.defaultSpeed}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={formState.defaultSpeed}
                  onChange={e => setFormState({ ...formState, defaultSpeed: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <span className="text-[10px] text-slate-500 block">Corridor transit governor threshold</span>
              </div>

              {/* Obstacle Threshold */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Obstacle Detection Cutoff</span>
                  <span className="font-mono font-bold text-amber-400">{formState.obstacleThresholdCm} cm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="5"
                  value={formState.obstacleThresholdCm}
                  onChange={e => setFormState({ ...formState, obstacleThresholdCm: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block">Distance to trigger emergency deceleration</span>
              </div>

              {/* Auto Return */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="font-semibold text-slate-300 block">Auto Return to Base</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Automatically return to Nurse Station dock upon delivery confirmation
                  </span>
                </div>
                <label className="mt-3 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.autoReturnToBase}
                    onChange={e => setFormState({ ...formState, autoReturnToBase: e.target.checked })}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 accent-sky-500"
                  />
                  <span className="text-xs text-slate-200 font-mono font-semibold">
                    {formState.autoReturnToBase ? 'ENABLED' : 'DISABLED'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Notifications & Audio */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Bell className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">NOTIFICATIONS & AUDIO SYNTHESIS</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <label className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.deliveryAlerts}
                  onChange={e => setFormState({ ...formState, deliveryAlerts: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded bg-slate-900 border-slate-700 accent-sky-500"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Delivery Alerts</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Toast popups on payload arrival</span>
                </div>
              </label>

              <label className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.obstacleAlerts}
                  onChange={e => setFormState({ ...formState, obstacleAlerts: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded bg-slate-900 border-slate-700 accent-sky-500"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Obstacle Alerts</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Warn when corridor clearance &lt; 50cm</span>
                </div>
              </label>

              <label className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.lowBatteryAlerts}
                  onChange={e => setFormState({ ...formState, lowBatteryAlerts: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded bg-slate-900 border-slate-700 accent-sky-500"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Low Battery Warning</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Trigger alarm when battery &lt; 20%</span>
                </div>
              </label>

              <label className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.voiceAnnouncements}
                  onChange={e => setFormState({ ...formState, voiceAnnouncements: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded bg-slate-900 border-slate-700 accent-sky-500"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Voice Announcements</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">DFPlayer synthesized speech prompts</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 5: Appearance & Simulation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Palette className="h-4 w-4 text-pink-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">APPEARANCE & RUNTIME SIMULATION</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-300 block">Interface Color Theme</span>
                <select
                  value={formState.theme}
                  onChange={e => setFormState({ ...formState, theme: e.target.value as 'dark' | 'light' | 'system' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                >
                  <option value="dark">Hospital Command Dark (Default)</option>
                  <option value="light">Clinical Medical Light</option>
                  <option value="system">System Preference Synchronized</option>
                </select>
                <span className="text-[10px] text-slate-500 block">Deep navy / high-contrast palette</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-300 block">Live Telemetry Simulation Engine</span>
                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formState.telemetrySimulation}
                    onChange={e => setFormState({ ...formState, telemetrySimulation: e.target.checked })}
                    className="h-4 w-4 rounded bg-slate-900 border-slate-700 accent-sky-500"
                  />
                  <span className="text-xs text-slate-200 font-mono font-semibold">
                    {formState.telemetrySimulation ? 'ACTIVE (Sensors Jitter & Update Live)' : 'FROZEN'}
                  </span>
                </label>
                <span className="text-[10px] text-slate-500 block">Simulates real-world sensor fluctuations and mission progress</span>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="outline" type="button" onClick={handleResetDefaults}>
              Reset All Defaults
            </Button>
            <Button variant="primary" type="submit" className="font-bold px-6">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
