import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected Dashboard Pages
import { Dashboard } from './pages/Dashboard';
import { TrafficMonitoring } from './pages/TrafficMonitoring';
import { WasteManagement } from './pages/WasteManagement';
import { WaterAnalytics } from './pages/WaterAnalytics';
import { EmergencyAlerts } from './pages/EmergencyAlerts';
import { PollutionMonitoring } from './pages/PollutionMonitoring';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating Operator Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              fontSize: '12px',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="traffic" element={<TrafficMonitoring />} />
            <Route path="waste" element={<WasteManagement />} />
            <Route path="water" element={<WaterAnalytics />} />
            <Route path="emergency" element={<EmergencyAlerts />} />
            <Route path="pollution" element={<PollutionMonitoring />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;
