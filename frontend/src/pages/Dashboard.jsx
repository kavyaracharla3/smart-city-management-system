import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { dashboardAPI, trafficAPI, wasteAPI, waterAPI, emergencyAPI, pollutionAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { CityMap } from '../components/CityMap';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  Car,
  Trash2,
  Droplets,
  AlertTriangle,
  Wind,
  Activity,
  RefreshCw,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { selectedZone } = useCity();
  const [summary, setSummary] = useState(null);
  const [trafficList, setTrafficList] = useState([]);
  const [wasteList, setWasteList] = useState([]);
  const [waterLeaks, setWaterLeaks] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [pollutionStations, setPollutionStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const zoneParam = selectedZone === 'All Zones' ? null : selectedZone;

      const [sumRes, trafRes, wasteRes, leakRes, emergRes, pollRes] = await Promise.all([
        dashboardAPI.getSummary(zoneParam),
        trafficAPI.getAll(zoneParam),
        wasteAPI.getAll(zoneParam),
        waterAPI.getLeaks(zoneParam),
        emergencyAPI.getAll(zoneParam),
        pollutionAPI.getAll(zoneParam),
      ]);

      setSummary(sumRes.data);
      setTrafficList(trafRes.data);
      setWasteList(wasteRes.data);
      setWaterLeaks(leakRes.data);
      setEmergencies(emergRes.data);
      setPollutionStations(pollRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Could not fetch real-time telemetry from backend server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000); // 15s auto polling for simulated telemetry
    return () => clearInterval(interval);
  }, [selectedZone]);

  if (loading || !summary) {
    return <LoadingSkeleton count={4} height="h-32" />;
  }

  // Chart sample data
  const trafficChartData = trafficList.map(t => ({
    name: t.road_name.split(' ')[0],
    speed: t.average_speed,
    vehicles: t.vehicle_count
  }));

  const aqiColors = ['#10b981', '#eab308', '#f97316', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-cyan-950/30">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Smart City Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{summary.system_status} Status</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time monitoring and intelligent management of city infrastructure ({selectedZone})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{summary.simulation_mode}</span>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Refresh IoT Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Traffic Card */}
        <StatCard
          title="Traffic Speed"
          value={summary.traffic.average_speed}
          unit="km/h"
          icon={Car}
          color="cyan"
          trend={{
            value: `${summary.traffic.congested_roads} Congested`,
            isPositive: summary.traffic.congested_roads < 2,
            label: 'roads'
          }}
        />

        {/* 2. Waste Card */}
        <StatCard
          title="Waste Efficiency"
          value={`${summary.waste.efficiency_percentage}%`}
          icon={Trash2}
          color="emerald"
          trend={{
            value: `${summary.waste.full_bins} Full`,
            isPositive: summary.waste.full_bins === 0,
            label: 'bins pending'
          }}
        />

        {/* 3. Water Card */}
        <StatCard
          title="Water Usage"
          value={summary.water.daily_consumption_kl}
          unit="kL"
          icon={Droplets}
          color="blue"
          trend={{
            value: `${summary.water.active_leaks} Leaks`,
            isPositive: summary.water.active_leaks === 0,
            label: 'active'
          }}
        />

        {/* 4. Emergency Card */}
        <StatCard
          title="Active Emergencies"
          value={summary.emergency.active_emergencies}
          icon={AlertTriangle}
          color="rose"
          trend={{
            value: `${summary.emergency.critical_alerts} Critical`,
            isPositive: false,
            label: 'alerts'
          }}
        />

        {/* 5. Pollution Card */}
        <StatCard
          title="City Air Quality (AQI)"
          value={summary.pollution.aqi}
          unit={summary.pollution.aqi_status}
          icon={Wind}
          color="amber"
          trend={{
            value: `PM2.5: ${summary.pollution.pm25}`,
            isPositive: summary.pollution.aqi < 100,
            label: 'µg/m³'
          }}
        />
      </div>

      {/* Main Interactive Command Map & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live City Leaflet Map */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard
            title="Metropolitan IoT Telemetry Map"
            subtitle="Interactive GIS mapping traffic speed, smart bins, water leaks, emergencies, and air stations"
          >
            <CityMap
              trafficData={trafficList}
              wasteData={wasteList}
              leakData={waterLeaks}
              emergencyData={emergencies}
              pollutionData={pollutionStations}
              height="460px"
            />
          </GlassCard>
        </div>

        {/* Right 1 Column: Traffic Speed & Pollution Visualizations */}
        <div className="space-y-6">
          <GlassCard title="Traffic Speed & Volume" subtitle="Speed profile across major arterial roads">
            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="speed" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard title="Air Pollution Index Breakdown" subtitle={`Current City AQI: ${summary.pollution.aqi}`}>
            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Fine Particulate Matter (PM2.5)</span>
                <span className="font-mono text-cyan-400 font-bold">{summary.pollution.pm25} µg/m³</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, summary.pollution.pm25 * 1.5)}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Respirable Dust (PM10)</span>
                <span className="font-mono text-cyan-400 font-bold">{summary.pollution.pm10} µg/m³</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${Math.min(100, summary.pollution.pm10)}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Carbon Monoxide (CO)</span>
                <span className="font-mono text-cyan-400 font-bold">{summary.pollution.co} mg/m³</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, summary.pollution.co * 30)}%` }} />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Bottom Row: Recent Emergencies & Waste Bins Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Emergencies Panel */}
        <GlassCard
          title="Recent Emergency Incidents"
          subtitle="Live priority dispatch stream from Hyderabad Police & Fire Command"
        >
          <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
            {emergencies.slice(0, 5).map((e) => (
              <div key={e.id} className="py-3 flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-100">{e.emergency_type}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">({e.zone})</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug mt-0.5">{e.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">Crew: {e.assigned_team}</div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={e.status} />
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Smart Bin Fill Levels */}
        <GlassCard
          title="Smart Waste Bin Monitor"
          subtitle="Real-time fill level percentages across municipal zones"
        >
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {wasteList.slice(0, 5).map((b) => (
              <div key={b.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-200">{b.bin_code} - {b.location}</span>
                  <StatusBadge status={b.status} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Zone: {b.city_zone}</span>
                  <span className="font-mono font-bold text-cyan-400">{b.fill_level}% Capacity</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      b.fill_level >= 85 ? 'bg-rose-500' : b.fill_level >= 70 ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${b.fill_level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
