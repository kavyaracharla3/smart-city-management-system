import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { waterAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { CityMap } from '../components/CityMap';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Droplets, AlertTriangle, CheckCircle, Search, Wrench, ShieldAlert } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';

export const WaterAnalytics = () => {
  const { selectedZone } = useCity();
  const [waterUsages, setWaterUsages] = useState([]);
  const [waterLeaks, setWaterLeaks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWaterData = async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone === 'All Zones' ? null : selectedZone;

      const [usageRes, leakRes, analRes] = await Promise.all([
        waterAPI.getUsage(zoneParam),
        waterAPI.getLeaks(zoneParam),
        waterAPI.getAnalytics(),
      ]);

      setWaterUsages(usageRes.data);
      setWaterLeaks(leakRes.data);
      setAnalytics(analRes.data);
    } catch (error) {
      toast.error('Failed to load water telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, [selectedZone]);

  const handleUpdateLeakStatus = async (leakId, leakCode, newStatus) => {
    try {
      await waterAPI.updateLeak(leakId, { status: newStatus });
      toast.success(`Updated ${leakCode} status to: ${newStatus}`);
      fetchWaterData();
    } catch (error) {
      toast.error('Failed to update water leak status');
    }
  };

  if (loading || !analytics) return <LoadingSkeleton count={4} height="h-28" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Droplets className="w-6 h-6 text-blue-400" />
            <span>Water Utility Analytics & Leak Management</span>
          </h1>
          <p className="text-xs text-slate-400">Reservoir capacity, zone consumption telemetry, and pipeline leak response</p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Daily Water Consumption" value={analytics.total_daily_consumption_kl} unit="kL" icon={Droplets} color="blue" />
        <StatCard title="Reservoir Supply Capacity" value={`${analytics.avg_reservoir_level_pct}%`} icon={Droplets} color="cyan" />
        <StatCard title="Active Pipeline Leaks" value={analytics.active_leaks_count} icon={AlertTriangle} color="rose" />
        <StatCard title="Estimated Water Loss" value={analytics.total_water_loss_lph} unit="L/h" icon={ShieldAlert} color="amber" />
      </div>

      {/* Consumption Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard title="24-Hour Hourly Consumption Profile" subtitle="Citywide demand flow throughout the day">
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.hourly_trends}>
                  <defs>
                    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="consumption" stroke="#3b82f6" fillOpacity={1} fill="url(#waterGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard title="Consumption By Zone" subtitle="Demand distribution in kiloliters (kL)">
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterUsages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="zone" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="consumption_kl" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Water Leak Detection & Response Panel */}
      <GlassCard title="Automated Pipeline Leak Detection System" subtitle="Telemetry sensor alerts, flow pressure anomalies, and field crew status">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Leak Code</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Water Loss Rate</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {waterLeaks.map((leak) => (
                <tr key={leak.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-cyan-400 font-mono">{leak.leak_code}</td>
                  <td className="px-4 py-3 text-slate-200">{leak.location}</td>
                  <td className="px-4 py-3 text-slate-400">{leak.zone}</td>
                  <td className="px-4 py-3 font-mono font-bold text-rose-400">{leak.estimated_loss_lph} L/h</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      leak.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                      leak.severity === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {leak.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={leak.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {leak.status === 'Detected' && (
                        <button
                          onClick={() => handleUpdateLeakStatus(leak.id, leak.leak_code, 'Investigating')}
                          className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-[10px] font-semibold transition-all flex items-center space-x-1"
                        >
                          <Wrench className="w-3 h-3" />
                          <span>Investigate</span>
                        </button>
                      )}
                      {leak.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateLeakStatus(leak.id, leak.leak_code, 'Resolved')}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[10px] font-semibold transition-all flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
