import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { emergencyAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { CityMap } from '../components/CityMap';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { AlertTriangle, Shield, CheckCircle, Clock, Users, Plus, Flame, Car, Droplets, HeartPulse, ShieldAlert, Radio } from 'lucide-react';
import toast from 'react-hot-toast';

export const EmergencyAlerts = () => {
  const { selectedZone } = useCity();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New emergency form state
  const [newType, setNewType] = useState('Accident');
  const [newLocation, setNewLocation] = useState('Madhapur Flyover');
  const [newZone, setNewZone] = useState('Madhapur');
  const [newSeverity, setNewSeverity] = useState('High');
  const [newDesc, setNewDesc] = useState('Vehicle stall blocking central traffic corridor.');

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone === 'All Zones' ? null : selectedZone;
      const res = await emergencyAPI.getAll(zoneParam, severityFilter);
      setEmergencies(res.data);
    } catch (error) {
      toast.error('Failed to load emergency telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, [selectedZone, severityFilter]);

  const handleUpdateStatus = async (id, status, assignedTeam = null) => {
    try {
      const payload = { status };
      if (assignedTeam) payload.assigned_team = assignedTeam;
      await emergencyAPI.update(id, payload);
      toast.success(`Updated incident status to: ${status}`);
      fetchEmergencies();
    } catch (error) {
      toast.error('Failed to update incident');
    }
  };

  const handleCreateEmergency = async (e) => {
    e.preventDefault();
    try {
      await emergencyAPI.create({
        emergency_type: newType,
        location: newLocation,
        zone: newZone,
        severity: newSeverity,
        description: newDesc,
        lat: 17.4400,
        lng: 78.3800
      });
      toast.success('Dispatched new simulated emergency alert!');
      setShowCreateModal(false);
      fetchEmergencies();
    } catch (error) {
      toast.error('Failed to trigger emergency alert');
    }
  };

  if (loading) return <LoadingSkeleton count={4} height="h-28" />;

  const activeCnt = emergencies.filter(e => e.status !== 'Resolved').length;
  const criticalCnt = emergencies.filter(e => e.severity === 'Critical' && e.status !== 'Resolved').length;
  const resolvedCnt = emergencies.filter(e => e.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            <span>Emergency Incident Management</span>
          </h1>
          <p className="text-xs text-slate-400">Multi-agency emergency response coordination and real-time incident dispatching</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-xs shadow-glow-rose transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate New Alert</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Incidents" value={activeCnt} icon={AlertTriangle} color="rose" />
        <StatCard title="Critical Severity Alerts" value={criticalCnt} icon={ShieldAlert} color="rose" />
        <StatCard title="Resolved Emergencies" value={resolvedCnt} icon={CheckCircle} color="emerald" />
        <StatCard title="Average Response Time" value="8.5" unit="mins" icon={Clock} color="cyan" />
      </div>

      {/* Map & Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard title="Emergency Location GIS" subtitle="Pulsing markers and critical radius zones">
            <CityMap emergencyData={emergencies} height="440px" />
          </GlassCard>
        </div>

        <div>
          <GlassCard title="Live Incident Stream" subtitle="Sorted by highest urgency">
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {emergencies.map((e) => (
                <div
                  key={e.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    e.severity === 'Critical'
                      ? 'bg-rose-950/40 border-rose-500/50 shadow-glow-rose'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      {e.emergency_type}
                    </span>
                    <StatusBadge status={e.status} />
                  </div>

                  <div className="text-[11px] font-semibold text-cyan-400">{e.location} ({e.zone})</div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">{e.description}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Crew: <span className="text-slate-200 font-mono">{e.assigned_team}</span></span>
                    
                    <div className="flex gap-1">
                      {e.status === 'Active' && (
                        <button
                          onClick={() => handleUpdateStatus(e.id, 'Investigating', 'Rapid Action Unit 1')}
                          className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold"
                        >
                          Investigate
                        </button>
                      )}
                      {e.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(e.id, 'Resolved')}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modal for Creating Simulated Alert */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-rose-500/30 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Simulate Emergency Incident</h3>
            <p className="text-xs text-slate-400 mb-4">Trigger a mock alert feed update to test command dispatching</p>

            <form onSubmit={handleCreateEmergency} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                >
                  <option value="Accident">Accident</option>
                  <option value="Fire">Fire</option>
                  <option value="Flood">Flood</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Crime">Crime</option>
                  <option value="Natural Disaster">Natural Disaster</option>
                  <option value="Infrastructure Failure">Infrastructure Failure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Location</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City Zone</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                >
                  <option value="Hitech City">Hitech City</option>
                  <option value="Madhapur">Madhapur</option>
                  <option value="Gachibowli">Gachibowli</option>
                  <option value="Kukatpally">Kukatpally</option>
                  <option value="Secunderabad">Secunderabad</option>
                  <option value="Banjara Hills">Banjara Hills</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Description</label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-glow-rose"
                >
                  Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
