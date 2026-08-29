import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SyncState, ConnectedDevice } from '../types';
import { Smartphone, Copy, Check, QrCode, RefreshCw, Laptop, ShieldCheck, ArrowRight } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncState: SyncState;
  onJoinRoom: (newRoomId: string) => void;
}

export default function SyncModal({ isOpen, onClose, syncState, onJoinRoom }: SyncModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');

  const syncUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?sync=${encodeURIComponent(syncState.roomId)}`
    : '';

  useEffect(() => {
    if (!isOpen || !syncUrl) return;

    QRCode.toDataURL(syncUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#0e0d0b',
        light: '#f3efe6',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [isOpen, syncUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(syncUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoomId.trim()) return;
    onJoinRoom(inputRoomId.trim());
    setInputRoomId('');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#141310] border border-[#f3efe6]/20 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f3efe6]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-400 uppercase">
                Seamless Multi-Device Protocol
              </span>
              <h3 className="text-xl font-bold uppercase font-mono text-[#f3efe6]">
                Sync Across Multiple Devices
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#f3efe6]/60 hover:text-[#f3efe6] font-mono text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* QR Code and Quick Pairing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: QR Code Display */}
          <div className="flex flex-col items-center justify-center p-5 bg-[#1b1915] rounded-xl border border-[#f3efe6]/15 text-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan QR code to sync tasks across multiple devices"
                className="w-48 h-48 rounded-lg shadow-md border-2 border-[#f3efe6]"
              />
            ) : (
              <div className="w-48 h-48 bg-[#0e0d0b] flex items-center justify-center text-xs font-mono text-[#f3efe6]/40">
                Generating QR...
              </div>
            )}
            <p className="text-[11px] font-mono text-[#f3efe6]/70 mt-3">
              Scan with your phone or tablet camera to pair instantly
            </p>
          </div>

          {/* Right: Room ID & Copy Link */}
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 bg-[#1b1915] rounded-xl border border-[#f3efe6]/15 space-y-2">
              <span className="text-[#f3efe6]/50 uppercase text-[10px]">Active Sync Room</span>
              <div className="text-2xl font-bold text-emerald-400 tracking-widest flex items-center justify-between">
                <span>{syncState.roomId}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#f3efe6]/60 leading-relaxed">
                All tasks, checklists, and ecosystem updates sync instantaneously across any devices
                joined to this room.
              </p>
            </div>

            {/* Share Link Button */}
            <div className="space-y-1.5">
              <label className="block text-[#f3efe6]/60 uppercase text-[10px]">
                Shareable Pairing Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={syncUrl}
                  className="flex-1 bg-[#0e0d0b] border border-[#f3efe6]/15 rounded-lg px-3 py-2 text-[11px] text-[#f3efe6]/80 select-all font-mono"
                />
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-[#f3efe6] hover:bg-white text-[#0e0d0b] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Join Other Room Section */}
        <div className="p-4 bg-[#181613] rounded-xl border border-[#f3efe6]/10 space-y-3 font-mono text-xs">
          <span className="text-[#f3efe6]/70 uppercase font-bold text-[10px] tracking-wider block">
            Join or Create Another Sync Room
          </span>
          <form onSubmit={handleJoinSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              placeholder="Enter Room Code (e.g. WORKSPACE-01, SYNC-8492)..."
              className="flex-1 bg-[#0e0d0b] border border-[#f3efe6]/15 rounded-lg px-3.5 py-2 text-xs text-[#f3efe6] uppercase tracking-wider focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-[#0e0d0b] font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow"
            >
              <span>Connect</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Connected Devices List */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#f3efe6]/70 uppercase font-bold text-[10px] tracking-wider">
              Connected Devices ({syncState.connectedDevices.length || 1})
            </span>
            <span className="text-[10px] text-emerald-400">● 0ms Real-Time Latency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {syncState.connectedDevices.length > 0 ? (
              syncState.connectedDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="flex items-center justify-between p-3 bg-[#181613] border border-[#f3efe6]/10 rounded-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-[#f3efe6] font-medium block text-[11px]">
                        {dev.name} {dev.isCurrent && '(This Device)'}
                      </span>
                      <span className="text-[#f3efe6]/40 text-[9px]">
                        {dev.isCurrent ? 'Active Now' : 'Synced'}
                      </span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-3 bg-[#181613] border border-[#f3efe6]/10 rounded-lg sm:col-span-2">
                <div className="flex items-center gap-2.5">
                  <Laptop className="w-4 h-4 text-emerald-400" />
                  <span className="text-[#f3efe6] font-medium text-[11px]">
                    Current Master Device (Active)
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            )}
          </div>
        </div>

        {/* Security & Reliability Footer Note */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#f3efe6]/50 pt-3 border-t border-[#f3efe6]/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            End-to-end synchronized using high-speed server event stream with offline client-first local caching.
          </span>
        </div>
      </div>
    </div>
  );
}
