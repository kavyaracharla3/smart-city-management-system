import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Settings as SettingsIcon, Sliders, Bell, Database, Shield, RefreshCw, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const [refreshRate, setRefreshRate] = useState('15');
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [wasteAlerts, setWasteAlerts] = useState(true);
  const [waterLeakAlerts, setWaterLeakAlerts] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success('Smart City Command Center settings updated!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          <span>System Settings & Operational Parameters</span>
        </h1>
        <p className="text-xs text-slate-400">Configure IoT polling speeds, notification threshold rules, and database parameters</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Telemetry Polling Speed */}
        <GlassCard title="IoT Telemetry Polling Rate" subtitle="Set background simulation and API refresh frequency">
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sensor Polling Interval (Seconds)
              </label>
              <select
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="5">5 Seconds (Ultra Real-Time)</option>
                <option value="15">15 Seconds (Recommended)</option>
                <option value="30">30 Seconds (Low Bandwidth)</option>
                <option value="60">60 Seconds (Manual Refresh)</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Alarm Thresholds */}
        <GlassCard title="Emergency Notification Rules" subtitle="Automated alerts broadcast to operators">
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={criticalAlerts}
                onChange={(e) => setCriticalAlerts(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Critical Emergency Broadcasts</span>
                <span className="text-[11px] text-slate-400">Push instant toast notifications when a Critical alert is created</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={wasteAlerts}
                onChange={(e) => setWasteAlerts(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Waste Bin Capacity Warning</span>
                <span className="text-[11px] text-slate-400">Trigger warning when smart bins reach >=95% fill level</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={waterLeakAlerts}
                onChange={(e) => setWaterLeakAlerts(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Water Leak Detection Alert</span>
                <span className="text-[11px] text-slate-400">Alert on flow pressure loss exceeding 1000 L/h</span>
              </div>
            </label>
          </div>
        </GlassCard>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan transition-all"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
