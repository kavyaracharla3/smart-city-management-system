import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { trafficAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { CityMap } from '../components/CityMap';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Car, Camera, AlertCircle, Gauge, Filter, Search, Plus } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import toast from 'react-hot-toast';

export const TrafficMonitoring = () => {
  const { selectedZone } = useCity();
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [congestionFilter, setCongestionFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTraffic = async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone === 'All Zones' ? null : selectedZone;
      const res = await trafficAPI.getAll(zoneParam, congestionFilter);
      setTrafficData(res.data);
    } catch (error) {
      toast.error('Failed to load traffic telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
  }, [selectedZone, congestionFilter]);

  if (loading) return <LoadingSkeleton count={4} height="h-28" />;

  // Filtered roads by search term
  const filteredRoads = trafficData.filter(t =>
    t.road_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalVehicles = trafficData.reduce((acc, curr) => acc + curr.vehicle_count, 0);
  const avgSpeed = trafficData.length > 0
    ? round(trafficData.reduce((acc, curr) => acc + curr.average_speed, 0) / trafficData.length, 1)
    : 0;
  const congestedRoadsCount = trafficData.filter(t => t.congestion_level === 'Heavy').length;
  const totalIncidents = trafficData.reduce((acc, curr) => acc + curr.incidents_count, 0);

  function round(val, dec) {
    return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
  }

  // Chart data
  const chartData = trafficData.map(t => ({
    road: t.road_name.split(' ')[0],
    speed: t.average_speed,
    vehicles: t.vehicle_count
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Car className="w-6 h-6 text-cyan-400" />
            <span>Traffic Monitoring Operations</span>
          </h1>
          <p className="text-xs text-slate-400">Real-time speed telemetry, intersection camera feeds, and congestion analytics</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={congestionFilter}
              onChange={(e) => setCongestionFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none pr-2 cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Traffic Levels</option>
              <option value="Low" className="bg-slate-900">Low Traffic</option>
              <option value="Moderate" className="bg-slate-900">Moderate Traffic</option>
              <option value="Heavy" className="bg-slate-900">Heavy Traffic</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Monitored Vehicles" value={totalVehicles} icon={Car} color="cyan" />
        <StatCard title="Average Traffic Speed" value={avgSpeed} unit="km/h" icon={Gauge} color="emerald" />
        <StatCard title="Congested Road Stretches" value={congestedRoadsCount} icon={AlertCircle} color="rose" />
        <StatCard title="Active Traffic Incidents" value={totalIncidents} icon={Camera} color="amber" />
      </div>

      {/* Traffic Map & Speed Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard title="Interactive Traffic GIS Map" subtitle="Live speed markers: Green (Low), Yellow (Moderate), Red (Heavy)">
            <CityMap trafficData={trafficData} height="420px" />
          </GlassCard>
        </div>

        <div>
          <GlassCard title="Vehicles Per Hour & Speed" subtitle="Speed profile vs traffic volume">
            <div className="h-96 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis dataKey="road" type="category" stroke="#64748b" fontSize={10} width={70} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="vehicles" fill="#06b6d4" name="Vehicles" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Traffic Roads Data Table */}
      <GlassCard
        title="Road Traffic Status Registry"
        subtitle="Detailed speed, vehicle counts, and camera status for municipal corridors"
        action={
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Filter by road..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Road Name</th>
                <th className="px-4 py-3">Zone / Location</th>
                <th className="px-4 py-3">Vehicle Count</th>
                <th className="px-4 py-3">Average Speed</th>
                <th className="px-4 py-3">Congestion Level</th>
                <th className="px-4 py-3">Camera Status</th>
                <th className="px-4 py-3">Last Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRoads.map((road) => (
                <tr key={road.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-100">{road.road_name}</td>
                  <td className="px-4 py-3 text-slate-400">{road.location} ({road.city_zone})</td>
                  <td className="px-4 py-3 font-mono font-bold text-cyan-400">{road.vehicle_count}</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-200">{road.average_speed} km/h</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={road.congestion_level} />
                  </td>
                  <td className="px-4 py-3 font-mono text-emerald-400">{road.camera_status}</td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                    {new Date(road.timestamp).toLocaleTimeString()}
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
