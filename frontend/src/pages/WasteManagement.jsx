import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { wasteAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { CityMap } from '../components/CityMap';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Trash2, Truck, AlertTriangle, CheckCircle, RefreshCw, Send } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

export const WasteManagement = () => {
  const { selectedZone } = useCity();
  const [wasteBins, setWasteBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchBins = async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone === 'All Zones' ? null : selectedZone;
      const res = await wasteAPI.getAll(zoneParam, statusFilter);
      setWasteBins(res.data);
    } catch (error) {
      toast.error('Failed to load smart bin telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, [selectedZone, statusFilter]);

  const handleDispatchCollection = async (binId, binCode) => {
    try {
      await wasteAPI.collect(binId);
      toast.success(`Dispatched collection truck to ${binCode}. Bin fill level reset to 5%!`);
      fetchBins();
    } catch (error) {
      toast.error('Failed to dispatch collection truck');
    }
  };

  if (loading) return <LoadingSkeleton count={4} height="h-28" />;

  const totalBins = wasteBins.length;
  const fullBins = wasteBins.filter(b => b.status === 'Full' || b.fill_level >= 95).length;
  const almostFullBins = wasteBins.filter(b => b.status === 'Almost Full' || (b.fill_level >= 80 && b.fill_level < 95)).length;
  const normalBins = wasteBins.filter(b => b.fill_level < 80).length;

  const chartData = wasteBins.map(b => ({
    name: b.bin_code.replace('BIN-HYD-', '#'),
    fill: b.fill_level,
    location: b.location
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-emerald-400" />
            <span>Smart Waste Management Operations</span>
          </h1>
          <p className="text-xs text-slate-400">IoT Bin fill-level monitoring and optimized municipal truck dispatching</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="All">All Bin Statuses</option>
            <option value="Normal">Normal (&lt;80%)</option>
            <option value="Almost Full">Almost Full (80-94%)</option>
            <option value="Full">Critical Full (&ge;95%)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Smart Bins Monitored" value={totalBins} icon={Trash2} color="emerald" />
        <StatCard title="Critical Full Bins (>=95%)" value={fullBins} icon={AlertTriangle} color="rose" />
        <StatCard title="Almost Full Bins (80-94%)" value={almostFullBins} icon={AlertTriangle} color="amber" />
        <StatCard title="Active Collection Vehicles" value="18 Trucks" icon={Truck} color="cyan" />
      </div>

      {/* Map & Fill Level Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard title="Smart Waste Bin Locations & Fill GIS" subtitle="Blue (Normal), Yellow (Almost Full), Red (Critical Full)">
            <CityMap wasteData={wasteBins} height="420px" />
          </GlassCard>
        </div>

        <div>
          <GlassCard title="Bin Capacity Utilization" subtitle="Fill percentage by bin ID">
            <div className="h-96 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="fill" name="Fill Level %" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill >= 95 ? '#ef4444' : entry.fill >= 80 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Waste Bin Registry & Truck Dispatch Table */}
      <GlassCard title="Municipal Smart Bin Status & Truck Dispatch" subtitle="Real-time telemetry and immediate collection crew dispatch">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Bin Code</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Fill Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Collection</th>
                <th className="px-4 py-3 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {wasteBins.map((bin) => (
                <tr key={bin.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-100 font-mono">{bin.bin_code}</td>
                  <td className="px-4 py-3 text-slate-300">{bin.location}</td>
                  <td className="px-4 py-3 text-slate-400">{bin.city_zone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 w-32">
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            bin.fill_level >= 95 ? 'bg-rose-500' : bin.fill_level >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${bin.fill_level}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[11px] text-slate-200">{bin.fill_level}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={bin.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                    {new Date(bin.last_collection).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDispatchCollection(bin.id, bin.bin_code)}
                      className="px-3 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold transition-all flex items-center space-x-1 ml-auto"
                    >
                      <Send className="w-3 h-3" />
                      <span>Dispatch Truck</span>
                    </button>
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
