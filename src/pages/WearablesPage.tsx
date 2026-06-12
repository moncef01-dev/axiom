import { useState } from 'react';
import { Watch, Link2, Link2Off, Battery, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

import PlatformLayout from '../components/PlatformLayout';
import wearablesData from '../data/wearables.json';

export default function WearablesPage() {
  const [devices, setDevices] = useState(() => wearablesData.devices);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleToggleConnect = (id: string) => {
    setDevices(prev =>
      prev.map(dev =>
        dev.id === id ? { ...dev, connected: !dev.connected } : dev
      )
    );
  };

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setDevices(prev =>
        prev.map(dev =>
          dev.id === id
            ? { ...dev, lastSync: new Date().toISOString(), battery: Math.max(10, dev.battery - 2) }
            : dev
        )
      );
    }, 1500);
  };

  return (
    <PlatformLayout
      title="Wearables & Sensor Integration"
      subtitle="Connect, manage, and sync external athlete tracking devices and biometrics"
    >
      {/* Overview stats */}
      <div className="bg-axiom-card border border-axiom-border p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <span className="text-[0.65rem] tracking-[2px] uppercase text-axiom-muted font-condensed font-600">
          Device Hub Sync: Active · 3 of 4 Devices Connected
        </span>
        <button className="flex items-center gap-1.5 bg-axiom-border border border-axiom-border text-axiom-muted hover:text-lime hover:border-lime transition-all px-3 py-1.5 text-[0.65rem] tracking-widest font-condensed font-700 uppercase">
          <Zap size={12} />
          Register New Device
        </button>
      </div>

      {/* Wearable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map(device => {
          const isConnected = device.connected;
          const isSyncing = syncingId === device.id;
          const syncTime = new Date(device.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const syncDate = new Date(device.lastSync).toLocaleDateString([], { month: 'short', day: 'numeric' });

          return (
            <div
              key={device.id}
              className={`bg-axiom-card border p-5 flex flex-col justify-between transition-all ${
                isConnected ? 'border-axiom-border hover:border-lime/20' : 'border-axiom-border opacity-70'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 border border-axiom-border flex items-center justify-center bg-axiom-black text-axiom-muted flex-shrink-0">
                      <Watch size={20} style={{ color: device.color }} />
                    </div>
                    <div>
                      <h3 className="font-condensed font-700 text-sm tracking-wider text-axiom-white uppercase">
                        {device.name}
                      </h3>
                      <p className="text-[0.65rem] text-axiom-muted tracking-wider uppercase">
                        {device.type} · Firmware {device.firmware}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleConnect(device.id)}
                    className={`flex items-center gap-1 text-[0.6rem] tracking-wider uppercase font-condensed font-700 px-2 py-1 border transition-colors ${
                      isConnected
                        ? 'border-lime text-lime hover:border-red-500 hover:text-red-500 bg-lime/5 hover:bg-red-500/5'
                        : 'border-axiom-muted text-axiom-muted hover:border-lime hover:text-lime'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Link2 size={10} />
                        Connected
                      </>
                    ) : (
                      <>
                        <Link2Off size={10} />
                        Disconnect
                      </>
                    )}
                  </button>
                </div>

                {/* Battery & Sync Info */}
                {isConnected && (
                  <div className="flex items-center gap-6 mb-4 text-xs font-condensed uppercase tracking-wider text-axiom-muted">
                    <span className="flex items-center gap-1.5">
                      <Battery size={13} className="text-lime" />
                      Battery: {device.battery}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-lime" />
                      Last Sync: {syncDate} at {syncTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Watch size={13} className="text-lime" />
                      Active Athletes: {device.connectedAthletes}
                    </span>
                  </div>
                )}

                {/* Synced Metrics list */}
                <div className="mb-5">
                  <span className="text-[0.6rem] tracking-wider uppercase text-axiom-muted font-condensed font-700 block mb-2">
                    Telemetry Channels synced
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.metrics.map(met => (
                      <span
                        key={met}
                        className="bg-axiom-black text-axiom-muted border border-axiom-border text-[0.6rem] font-condensed font-600 uppercase px-2.5 py-0.5"
                      >
                        {met}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action sync button */}
              {isConnected && (
                <div className="pt-4 border-t border-axiom-border flex justify-end">
                  <button
                    disabled={isSyncing}
                    onClick={() => handleSync(device.id)}
                    className="report-action-btn primary"
                  >
                    {isSyncing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-axiom-black/30 border-t-axiom-black rounded-full animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={11} />
                        Sync Now
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PlatformLayout>
  );
}
