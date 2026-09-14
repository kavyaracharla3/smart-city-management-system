import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { reportsAPI } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { FileText, Download, Filter, RefreshCw, Calendar, CheckCircle2, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsAnalytics = () => {
  const { selectedZone } = useCity();
  const [category, setCategory] = useState('traffic');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone === 'All Zones' ? null : selectedZone;

      let res;
      if (category === 'traffic') res = await reportsAPI.getTrafficReport(zoneParam);
      else if (category === 'waste') res = await reportsAPI.getWasteReport(zoneParam);
      else if (category === 'water') res = await reportsAPI.getWaterReport(zoneParam);
      else if (category === 'emergency') res = await reportsAPI.getEmergencyReport(zoneParam);
      else if (category === 'pollution') res = await reportsAPI.getPollutionReport(zoneParam);

      setReportData(res.data);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [category, selectedZone]);

  const handleDownloadCSV = () => {
    if (!reportData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reportData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `smart_city_${category}_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Downloaded ${category.toUpperCase()} operational report!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-violet-400" />
            <span>Executive Reports & Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">Generate, analyze, and export municipal infrastructure telemetry reports</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReport}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Fresh Report</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report Data</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl glass-card border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Category:</span>
          {['traffic', 'waste', 'water', 'emergency', 'pollution'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                category === cat
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Zone Context: <span className="text-cyan-400 font-bold">{selectedZone}</span>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="h-32" />
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="p-6 rounded-2xl glass-panel border border-violet-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-violet-950/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{reportData.report_type}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Generated: {new Date(reportData.generated_at).toLocaleString()}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                Status: Verified Telemetry
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {Object.entries(reportData)
                .filter(([k]) => typeof reportData[k] !== 'object' && k !== 'report_type' && k !== 'generated_at')
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">
                      {value}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Raw JSON Data Preview Card */}
          <GlassCard title="Report Data Registry Payload" subtitle="Detailed telemetry dataset exported from SQL database">
            <pre className="p-4 rounded-xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto max-h-96 border border-slate-800">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
};
