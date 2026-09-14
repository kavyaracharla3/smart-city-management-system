import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { pollutionAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { CityMap } from '../components/CityMap';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Wind, Gauge, ShieldAlert, Sparkles, Activity } from 'lucide-react';
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

export const PollutionMonitoring = () => {
  const { selectedZone } = useCity();
  const [stations, setStations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPollutionData = async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone === 'All Zones' ? null : selectedZone;

      const [stRes, analRes] = await Promise.all([
        pollutionAPI.getAll(zoneParam),
        pollutionAPI.getAnalytics(),
      ]);

      setStations(stRes.data);
      setAnalytics(analRes.data);
    } catch (error) {
      toast.error('Failed to load air quality telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPollutionData();
  }, [selectedZone]);

  if (loading || !analytics) return <LoadingSkeleton count={4} height="h-28" />;

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (aqi <= 100) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    if (aqi <= 150) return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40' };
  };

  const aqiStyle = getAqiColor(analytics.overall_avg_aqi);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wind className="w-6 h-6 text-amber-400" />
            <span>Pollution & Air Quality Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400">Environmental monitoring stations tracking PM2.5, PM10, CO, NO2, SO2, and O3</p>
        </div>
      </div>

      {/* Hero AQI Card & Pollutants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large AQI Highlight Box */}
        <div className={`p-6 rounded-2xl glass-card border ${aqiStyle.border} flex flex-col justify-between`}>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Metropolitan Air Quality Index
            </span>
            <div className="mt-4 flex items-baseline space-x-3">
              <span className={`text-6xl font-extrabold tracking-tight ${aqiStyle.text} font-sans`}>
                {analytics.overall_avg_aqi}
              </span>
              <span className="text-xs text-slate-400 font-mono">AQI Scale</span>
            </div>
            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${aqiStyle.bg} ${aqiStyle.text} border ${aqiStyle.border}`}>
                {analytics.overall_avg_aqi <= 50 ? 'Good Air Quality' : analytics.overall_avg_aqi <= 100 ? 'Moderate Air Quality' : 'Unhealthy Air Quality'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-6 leading-relaxed">
            Derived from real-time monitoring stations across Hyderabad municipal industrial and commercial zones.
          </p>
        </div>

        {/* Pollutant Particles Grid (PM2.5, PM10, CO, NO2, SO2, O3) */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-slate-400 text-xs font-semibold block">PM 2.5</span>
            <span className="text-2xl font-bold text-cyan-400 mt-1 block font-mono">{analytics.overall_pm25}</span>
            <span className="text-[10px] text-slate-500">µg/m³ (Fine Particulate)</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-slate-400 text-xs font-semibold block">PM 10</span>
            <span className="text-2xl font-bold text-teal-400 mt-1 block font-mono">{analytics.overall_pm10}</span>
            <span className="text-[10px] text-slate-500">µg/m³ (Respirable Dust)</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-slate-400 text-xs font-semibold block">Carbon Monoxide (CO)</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block font-mono">{analytics.overall_co}</span>
            <span className="text-[10px] text-slate-500">mg/m³ (Combustion Gas)</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-slate-400 text-xs font-semibold block">Nitrogen Dioxide (NO2)</span>
            <span className="text-2xl font-bold text-blue-400 mt-1 block font-mono">{analytics.overall_no2}</span>
            <span className="text-[10px] text-slate-500">ppb (Vehicular Gas)</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-slate-400 text-xs font-semibold block">Sulfur Dioxide (SO2)</span>
            <span className="text-2xl font-bold text-violet-400 mt-1 block font-mono">{analytics.overall_so2}</span>
            <span className="text-[10px] text-slate-500">ppb (Industrial Output)</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-slate-400 text-xs font-semibold block">Ozone (O3)</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block font-mono">{analytics.overall_o3}</span>
            <span className="text-[10px] text-slate-500">ppb (Photochemical)</span>
          </div>
        </div>
      </div>

      {/* AQI Trend & GIS Station Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard title="Environmental GIS Sensor Map" subtitle="Color-coded air quality telemetry pins">
            <CityMap pollutionData={stations} height="420px" />
          </GlassCard>
        </div>

        <div>
          <GlassCard title="AQI 24-Hour Historical Trend" subtitle="Daily air quality index progression">
            <div className="h-96 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.historical_trends}>
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="aqi" stroke="#f59e0b" fillOpacity={1} fill="url(#aqiGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Pollution Station Registry Table */}
      <GlassCard title="Monitoring Station Registry" subtitle="Specific station readings across Hyderabad municipal zones">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Station Code</th>
                <th className="px-4 py-3">Station Name</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">AQI</th>
                <th className="px-4 py-3">PM2.5</th>
                <th className="px-4 py-3">PM10</th>
                <th className="px-4 py-3">Air Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stations.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-amber-400 font-mono">{st.station_code}</td>
                  <td className="px-4 py-3 text-slate-100 font-medium">{st.station_name}</td>
                  <td className="px-4 py-3 text-slate-400">{st.zone}</td>
                  <td className="px-4 py-3 font-mono font-bold text-cyan-400">{st.aqi}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{st.pm25} µg/m³</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{st.pm10} µg/m³</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={st.status} />
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
