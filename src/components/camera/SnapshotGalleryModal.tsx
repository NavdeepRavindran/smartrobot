'use client';

import React from 'react';
import { useRobot } from '@/lib/robot-context';
import { Modal } from '@/components/ui/Modal';
import { Download, Trash2, Clock, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SnapshotGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SnapshotGalleryModal({ isOpen, onClose }: SnapshotGalleryModalProps) {
  const { snapshots, deleteSnapshot } = useRobot();

  const handleDownload = (dataUrl: string, id: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `SMR-01-Snapshot-${id}.png`;
    a.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ESP32-CAM Snapshot Archive"
      subtitle="Recorded telemetry frames and payload verification captures"
      maxWidth="2xl"
    >
      {snapshots.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <Camera className="h-10 w-10 mx-auto mb-2 text-slate-600" />
          <p className="text-sm">No snapshots captured yet.</p>
          <p className="text-xs mt-1">Press the &quot;Snapshot&quot; button in the camera feed to record frames.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {snapshots.map(snap => (
            <div
              key={snap.id}
              className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden group shadow-md"
            >
              {/* Snapshot Image Preview */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={snap.dataUrl}
                  alt={`Snapshot ${snap.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-sky-400 border border-slate-800">
                  {snap.resolution}
                </div>
              </div>

              {/* Meta details */}
              <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                    <Clock className="h-3 w-3 text-sky-400" />
                    <span>{snap.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mt-0.5">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    <span>{snap.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownload(snap.dataUrl, snap.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="Download Frame"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSnapshot(snap.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Frame"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close Archive
        </Button>
      </div>
    </Modal>
  );
}
