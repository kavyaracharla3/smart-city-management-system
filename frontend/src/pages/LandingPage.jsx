import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Car,
  Trash2,
  Droplets,
  AlertTriangle,
  Wind,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                SMART CITY
              </span>
              <span className="text-xs text-cyan-400 font-mono block">COMMAND CENTER</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-glow-cyan transition-all flex items-center space-x-1.5"
            >
              <span>Access Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto flex-1">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Smart Metropolitan Infrastructure</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Smart City <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Management System</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Real-time monitoring and intelligent management of traffic flow, smart waste collection, water utility distribution, emergency incident dispatch, and air quality telemetry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Command Center</span>
            </Link>

            <a
              href="#credentials"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-sm transition-all"
            >
              Demo Credentials
            </a>
          </motion.div>
        </div>

        {/* Quick Demo Credentials Box */}
        <div id="credentials" className="mt-16 max-w-xl mx-auto p-6 rounded-2xl glass-card border border-cyan-500/30">
          <div className="flex items-center space-x-2 text-cyan-400 mb-3">
            <CheckCircle className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Quick Evaluator Credentials</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Admin Operator Account</span>
              <p className="text-cyan-300 font-bold mt-1">admin@smartcity.gov.in</p>
              <p className="text-slate-400">Password: <span className="text-white font-bold">admin123</span></p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">City User Account</span>
              <p className="text-cyan-300 font-bold mt-1">operator@smartcity.gov.in</p>
              <p className="text-slate-400">Password: <span className="text-white font-bold">user123</span></p>
            </div>
          </div>
        </div>

        {/* Core Modules Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">Centralized Command Operations</h2>
            <p className="text-xs text-slate-400 mt-1">Integrated IoT Sensor Modules for Hyderabad Metropolitan Region</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Traffic Monitoring', icon: Car, color: 'text-cyan-400', desc: 'Real-time vehicle speed tracking, congestion detection, and live camera feed alerts.' },
              { title: 'Waste Management', icon: Trash2, color: 'text-emerald-400', desc: 'Smart bin fill-level telemetry and collection truck route optimization.' },
              { title: 'Water Usage Analytics', icon: Droplets, color: 'text-blue-400', desc: 'Distribution consumption monitoring, reservoir gauging, and automated leak detection.' },
              { title: 'Emergency Dispatch', icon: AlertTriangle, color: 'text-rose-400', desc: 'Priority alert feeds, response crew assignments, and severity radius mapping.' },
              { title: 'Pollution & AQI', icon: Wind, color: 'text-amber-400', desc: 'Air quality index monitoring, PM2.5/PM10 particle analytics, and station tracking.' },
              { title: 'Reports & Analytics', icon: BarChart3, color: 'text-violet-400', desc: 'Zone performance reporting, historical trends export, and executive briefings.' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="p-6 rounded-xl glass-card border border-slate-800 hover:border-slate-700 transition-all">
                  <div className={`p-3 rounded-lg bg-slate-900 inline-block ${m.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-2">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-mono">
        Smart City Operations Platform &copy; 2026 | Hyderabad Metropolitan Development Authority Demo
      </footer>
    </div>
  );
};
