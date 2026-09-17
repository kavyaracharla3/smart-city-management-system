import React, { useState, useEffect } from 'react';
import { collaborationAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import {
  Users, MessageSquare, AlertTriangle, ShieldCheck, Megaphone, PlusCircle,
  Truck, CheckCircle2, Clock, Filter, Send, UserCheck, Activity, MapPin, Tag
} from 'lucide-react';

export const Collaboration = () => {
  const { selectedZone } = useCity();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('issues'); // 'issues', 'bulletins', 'notes', 'logs'
  const [issues, setIssues] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  // Modal States
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showBulletinModal, setShowBulletinModal] = useState(false);

  // New Issue Form
  const [newIssue, setNewIssue] = useState({
    title: '',
    category: 'Pothole',
    description: '',
    location: '',
    zone: selectedZone === 'All Zones' ? 'Hyderabad Central' : selectedZone,
    priority: 'Medium',
    reporter_name: user?.name || 'Anonymous Citizen',
  });

  // New Bulletin Form
  const [newBulletin, setNewBulletin] = useState({
    title: '',
    message: '',
    category: 'Emergency',
    urgency: 'High',
  });

  // New Note Form
  const [newNote, setNewNote] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [issuesRes, bulletinsRes, notesRes, logsRes] = await Promise.all([
        collaborationAPI.getIssues(selectedZone, statusFilter, categoryFilter),
        collaborationAPI.getBulletins(),
        collaborationAPI.getNotes(selectedZone),
        collaborationAPI.getActivityLogs(),
      ]);
      setIssues(issuesRes.data || []);
      setBulletins(bulletinsRes.data || []);
      setNotes(notesRes.data || []);
      setActivityLogs(logsRes.data || []);
    } catch (err) {
      console.error('Error loading collaboration data:', err);
      toast.error('Failed to load collaboration data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedZone, statusFilter, categoryFilter]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      await collaborationAPI.createIssue(newIssue);
      toast.success('Citizen Incident Ticket logged successfully!');
      setShowIssueModal(false);
      setNewIssue({
        title: '',
        category: 'Pothole',
        description: '',
        location: '',
        zone: selectedZone === 'All Zones' ? 'Hyderabad Central' : selectedZone,
        priority: 'Medium',
        reporter_name: user?.name || 'Anonymous Citizen',
      });
      loadData();
    } catch (err) {
      toast.error('Failed to log citizen issue');
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus, assignedCrew) => {
    try {
      await collaborationAPI.updateIssue(issueId, {
        status: newStatus,
        assigned_crew: assignedCrew,
      });
      toast.success(`Ticket status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      toast.error('Failed to update ticket status');
    }
  };

  const handleCreateBulletin = async (e) => {
    e.preventDefault();
    try {
      await collaborationAPI.createBulletin(newBulletin);
      toast.success('Citywide Bulletin broadcasted successfully!');
      setShowBulletinModal(false);
      setNewBulletin({
        title: '',
        message: '',
        category: 'Emergency',
        urgency: 'High',
      });
      loadData();
    } catch (err) {
      toast.error('Failed to broadcast bulletin');
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await collaborationAPI.createNote({
        operator_name: user?.name || 'City Operator',
        role: user?.role || 'user',
        zone: selectedZone === 'All Zones' ? 'Hyderabad Central' : selectedZone,
        note: newNote,
      });
      toast.success('Operator Note added');
      setNewNote('');
      loadData();
    } catch (err) {
      toast.error('Failed to post note');
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Medium':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Crew Dispatched':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'Under Repair':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Real-World Field Collaboration & Operations Hub
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Inter-Agency Operations, Citizen Incident Reporting & Live Field Response Dispatching ({selectedZone})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowIssueModal(true)}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan transition-all flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Citizen Incident</span>
          </button>

          <button
            onClick={() => setShowBulletinModal(true)}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center space-x-2"
          >
            <Megaphone className="w-4 h-4" />
            <span>Post City Bulletin</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('issues')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'issues'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Citizen Incidents ({issues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulletins')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'bulletins'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>City Broadcast Bulletins ({bulletins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'notes'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Operator Shift Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'logs'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Action Audit Log ({activityLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Citizen Incidents Hub */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>Filter By Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="Crew Dispatched">Crew Dispatched</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Resolved">Resolved</option>
              </select>

              <div className="flex items-center space-x-2 text-xs text-slate-400 ml-4">
                <Tag className="w-4 h-4 text-cyan-400" />
                <span>Category:</span>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="All Categories">All Categories</option>
                <option value="Pothole">Pothole</option>
                <option value="Streetlight">Streetlight</option>
                <option value="Garbage Overflow">Garbage Overflow</option>
                <option value="Water Burst">Water Burst</option>
                <option value="Traffic Signal">Traffic Signal</option>
              </select>
            </div>

            <span className="text-xs text-slate-400">
              Showing {issues.length} real-world tickets
            </span>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : issues.length === 0 ? (
            <GlassCard className="p-8 text-center text-slate-400 text-xs">
              No citizen issues reported matching selected filters.
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues.map((issue) => (
                <GlassCard key={issue.id} className="p-5 relative border-l-4 border-l-cyan-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-xs font-bold text-cyan-400">{issue.ticket_id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(issue.priority)}`}>
                          {issue.priority} Priority
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(issue.status)}`}>
                          {issue.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 mt-1">{issue.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{issue.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{issue.location} ({issue.zone})</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>{issue.reporter_name}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold text-slate-300">{issue.assigned_crew}</span>
                    </div>
                  </div>

                  {/* Operational Crew Dispatch Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500">
                      Logged: {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div className="flex items-center space-x-2">
                      {issue.status !== 'Crew Dispatched' && issue.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateIssueStatus(issue.id, 'Crew Dispatched', `${issue.category} Field Unit #2`)}
                          className="py-1 px-2.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-semibold transition-colors flex items-center space-x-1"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Dispatch Crew</span>
                        </button>
                      )}

                      {issue.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateIssueStatus(issue.id, 'Resolved', issue.assigned_crew)}
                          className="py-1 px-2.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: City Bulletins */}
      {activeTab === 'bulletins' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bulletins.map((b) => (
              <GlassCard key={b.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                      b.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    }`}>
                      {b.category} • {b.urgency}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{b.message}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Issued By:</span>
                  <span className="font-semibold text-cyan-400">{b.posted_by}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Operator Shift Notes */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {notes.map((note) => (
              <GlassCard key={note.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-cyan-400">{note.operator_name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                      {note.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-200">{note.note}</p>
                <div className="mt-2 text-[10px] text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-600" />
                  <span>Zone: {note.zone}</span>
                </div>
              </GlassCard>
            ))}
          </div>

          <div>
            <GlassCard className="p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Post Shift Note</span>
              </h3>
              <form onSubmit={handleCreateNote} className="space-y-3">
                <textarea
                  rows={4}
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Share operational shift handovers, camera status notes, or field team updates..."
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold text-xs border border-cyan-500/30 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Operational Note</span>
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 4: Live Action Audit Log */}
      {activeTab === 'logs' && (
        <GlassCard className="p-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Operator Activity Stream</span>
          </h3>
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-200">{log.operator_name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-800 text-cyan-400 border border-slate-700">
                        {log.module} • {log.action_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{log.details}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Modal 1: Report Citizen Issue */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Log Real-World Incident Ticket</span>
            </h2>

            <form onSubmit={handleCreateIssue} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                >
                  <option value="Pothole">Pothole / Road Damage</option>
                  <option value="Streetlight">Streetlight Failure</option>
                  <option value="Garbage Overflow">Garbage Overflow</option>
                  <option value="Water Burst">Water Burst / Main Leak</option>
                  <option value="Traffic Signal">Traffic Signal Fault</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  placeholder="Deep pothole near Cyber Towers Gate 2"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  placeholder="Detailed description of the issue..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newIssue.location}
                    onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                    placeholder="Cyber Towers flyover"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">City Zone</label>
                  <select
                    value={newIssue.zone}
                    onChange={(e) => setNewIssue({ ...newIssue, zone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="Hyderabad Central">Hyderabad Central</option>
                    <option value="Hitech City">Hitech City</option>
                    <option value="Madhapur">Madhapur</option>
                    <option value="Gachibowli">Gachibowli</option>
                    <option value="Kukatpally">Kukatpally</option>
                    <option value="Secunderabad">Secunderabad</option>
                    <option value="Banjara Hills">Banjara Hills</option>
                    <option value="Jubilee Hills">Jubilee Hills</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
                >
                  Submit Incident Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Post Bulletin */}
      {showBulletinModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Megaphone className="w-5 h-5 text-cyan-400" />
              <span>Broadcast City Notice</span>
            </h2>

            <form onSubmit={handleCreateBulletin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newBulletin.title}
                  onChange={(e) => setNewBulletin({ ...newBulletin, title: e.target.value })}
                  placeholder="Monsoon Heavy Rainfall Alert"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  value={newBulletin.message}
                  onChange={(e) => setNewBulletin({ ...newBulletin, message: e.target.value })}
                  placeholder="Official alert details to broadcast..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newBulletin.category}
                    onChange={(e) => setNewBulletin({ ...newBulletin, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Traffic">Traffic</option>
                    <option value="Water">Water</option>
                    <option value="Weather">Weather</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Urgency</label>
                  <select
                    value={newBulletin.urgency}
                    onChange={(e) => setNewBulletin({ ...newBulletin, urgency: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBulletinModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
                >
                  Broadcast Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
