import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import {
  Menu,
  Bell,
  Search,
  MapPin,
  Clock,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Shield,
  Activity,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Navbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const { selectedZone, setSelectedZone, zones } = useCity();
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sampleNotifications = [
    { id: 1, title: 'Critical Alert', desc: 'Accident at Cyber Towers Flyover', time: '2m ago', level: 'high' },
    { id: 2, title: 'Waste Management', desc: 'Bin #102 in Hitech City reached 96%', time: '8m ago', level: 'medium' },
    { id: 3, title: 'Water System', desc: 'Water leak detected near Nizamia Observatory', time: '14m ago', level: 'high' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching city records for: "${searchQuery}"`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md px-4 lg:px-8">
      <div className="flex items-center justify-between h-full">
        {/* Left Section: Mobile Menu & City/Zone Selector */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Zone Selector */}
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="pl-9 pr-8 py-1.5 text-xs font-medium bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none"
            >
              {zones.map((zone) => (
                <option key={zone} value={zone} className="bg-slate-900 text-slate-200">
                  {zone}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Real-time Clock */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-950/60 border border-slate-800/80 text-xs font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{time.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search roads, smart bins, emergency alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </form>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live System Alerts</h4>
                  <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-mono">3 New</span>
                </div>
                <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto">
                  {sampleNotifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                        <span className={n.level === 'high' ? 'text-rose-400' : 'text-amber-400'}>{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/dashboard/emergency');
                    }}
                    className="text-xs text-cyan-400 hover:underline font-medium"
                  >
                    View All Emergency Incidents →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2.5 p-1.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-semibold text-slate-200 leading-tight">{user?.name || 'Admin'}</div>
                <div className="text-[10px] text-cyan-400 capitalize">{user?.role || 'operator'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-xs font-medium text-slate-200">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md capitalize">
                    Role: {user?.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/dashboard/profile');
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 transition-colors text-left"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Profile & Settings</span>
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
