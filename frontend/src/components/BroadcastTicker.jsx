import React, { useEffect, useState } from 'react';
import { collaborationAPI } from '../services/api';
import { Megaphone, AlertTriangle, Info, Bell, Flame } from 'lucide-react';

export const BroadcastTicker = () => {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBulletins = async () => {
    try {
      const res = await collaborationAPI.getBulletins();
      setBulletins(res.data || []);
    } catch (err) {
      console.error('Failed to load city bulletins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulletins();
    const interval = setInterval(fetchBulletins, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading || bulletins.length === 0) {
    return null;
  }

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
    }
  };

  return (
    <div className="bg-slate-900/90 border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between font-sans text-xs">
      <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider min-w-max">
        <Megaphone className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span>Live City Broadcast:</span>
      </div>

      <div className="overflow-hidden relative w-full mx-4 h-5 flex items-center">
        <div className="flex space-x-8 animate-marquee whitespace-nowrap">
          {bulletins.map((b) => (
            <div key={b.id} className="inline-flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getUrgencyBadge(b.urgency)}`}>
                {b.category} • {b.urgency}
              </span>
              <span className="font-semibold text-slate-200">{b.title}:</span>
              <span className="text-slate-400">{b.message}</span>
              <span className="text-slate-600 text-[10px]">({b.posted_by})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[10px] text-slate-500 min-w-max">
        {bulletins.length} Active Notice{bulletins.length > 1 ? 's' : ''}
      </div>
    </div>
  );
};
