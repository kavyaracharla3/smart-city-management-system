import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Trash2,
  Droplets,
  AlertTriangle,
  Wind,
  FileText,
  Settings,
  User,
  Shield,
  Activity,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Traffic Monitoring', path: '/dashboard/traffic', icon: Car },
  { name: 'Waste Management', path: '/dashboard/waste', icon: Trash2 },
  { name: 'Water Analytics', path: '/dashboard/water', icon: Droplets },
  { name: 'Emergency Alerts', path: '/dashboard/emergency', icon: AlertTriangle, badge: 'Live' },
  { name: 'Pollution Monitoring', path: '/dashboard/pollution', icon: Wind },
  { name: 'Reports & Analytics', path: '/dashboard/reports', icon: FileText },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900/95 border-r border-slate-800 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Branding */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  SMART CITY
                </h1>
                <p className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
                  Command Center
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Core Operational Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border-l-4 border-cyan-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Simulation System Badge Footer */}
          <div className="p-4 m-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-2 text-xs text-emerald-400 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold font-mono tracking-wide">IoT Telemetry Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Backend real-time simulation feeding live city operational metrics.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
