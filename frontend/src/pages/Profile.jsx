import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { User, Shield, KeyRound, Mail, Clock, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-cyan-400" />
          <span>Operator Profile & Identity</span>
        </h1>
        <p className="text-xs text-slate-400">Manage account credentials, role permissions, and session access security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Badge Card */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-glow-cyan mb-4">
            {user?.name ? user.name[0] : 'U'}
          </div>

          <h2 className="text-lg font-bold text-white">{user?.name || 'Command Center User'}</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>

          <div className="mt-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-semibold capitalize">
              Role: {user?.role || 'user'}
            </span>
          </div>
        </div>

        {/* Profile Details & Permissions */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard title="Security Profile & Privileges" subtitle="System authorization level">
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Registered Email</span>
                <span className="font-mono text-slate-100 font-bold">{user?.email}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Access Privileges</span>
                <span className="font-mono text-cyan-400 font-bold capitalize">
                  {user?.role === 'admin' ? 'Full Command Center Administration' : 'Operator Read & Action Dispatch'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Account Created</span>
                <span className="font-mono text-slate-300">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'System Default'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
