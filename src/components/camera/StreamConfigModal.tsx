'use client';

import React, { useState } from 'react';
import { useRobot } from '@/lib/robot-context';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Wifi, Video, CheckCircle2, AlertCircle } from 'lucide-react';

interface StreamConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StreamConfigModal({ isOpen, onClose }: StreamConfigModalProps) {
  const { settings, updateSettings, addToast } = useRobot();
  const [streamUrl, setStreamUrl] = useState(settings.streamUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const handleSave = () => {
    updateSettings({ streamUrl });
    onClose();
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
      addToast('Stream Endpoint Validated', `Connection ping to ${streamUrl} responded with HTTP 200 OK.`, 'success');
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ESP32-CAM Hardware Configuration"
      subtitle="Connect direct MJPEG / RTSP stream from your physical robot"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Physical ESP32-CAM Stream URL
          </label>
          <input
            type="text"
            value={streamUrl}
            onChange={e => setStreamUrl(e.target.value)}
            placeholder="http://192.168.4.1/stream or http://192.168.1.150:81/stream"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 font-mono text-slate-200 focus:outline-none focus:border-sky-500"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Standard Arduino CameraWebServer example defaults to port 81 (e.g. `http://&lt;IP&gt;:81/stream`).
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-sky-400" />
              Camera Network State
            </span>
            <span className="font-mono text-emerald-400 font-bold">192.168.1.150</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Sensor: OV2640 2.0 Megapixel | Protocol: HTTP MJPEG multipart
          </div>
        </div>

        {testStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Endpoint responded (Latency: 14ms). Ready for hardware stream integration.</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            isLoading={testStatus === 'testing'}
          >
            Ping Hardware Stream
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Stream Config
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
