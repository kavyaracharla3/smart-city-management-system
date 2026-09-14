import React from 'react';

export const StatusBadge = ({ status }) => {
  const statusMap = {
    // General
    Normal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Good: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Critical: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
    
    // Traffic / Waste / Water / Emergency / Pollution specific
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Moderate: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Heavy: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    'Almost Full': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Full: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    Active: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
    Investigating: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Detected: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    Unhealthy: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  };

  const badgeStyle = statusMap[status] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
};
