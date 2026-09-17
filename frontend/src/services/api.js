import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartcity_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized if needed
      localStorage.removeItem('smartcity_token');
      localStorage.removeItem('smartcity_user');
    }
    return Promise.reject(error);
  }
);

// API Service functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
  getMe: () => api.get('/auth/me'),
};

export const dashboardAPI = {
  getSummary: (zone) => api.get('/dashboard/summary', { params: { zone } }),
};

export const trafficAPI = {
  getAll: (zone, congestion) => api.get('/traffic', { params: { zone, congestion } }),
  getById: (id) => api.get(`/traffic/${id}`),
  create: (data) => api.post('/traffic', data),
  update: (id, data) => api.put(`/traffic/${id}`, data),
  delete: (id) => api.delete(`/traffic/${id}`),
};

export const wasteAPI = {
  getAll: (zone, status) => api.get('/waste', { params: { zone, status } }),
  getById: (id) => api.get(`/waste/${id}`),
  create: (data) => api.post('/waste', data),
  update: (id, data) => api.put(`/waste/${id}`, data),
  collect: (id) => api.post(`/waste/${id}/collect`),
};

export const waterAPI = {
  getUsage: (zone) => api.get('/water', { params: { zone } }),
  getAnalytics: () => api.get('/water/analytics'),
  getLeaks: (zone, status) => api.get('/water/leaks', { params: { zone, status } }),
  updateLeak: (id, data) => api.put(`/water/leaks/${id}`, data),
};

export const emergencyAPI = {
  getAll: (zone, severity, status) => api.get('/emergencies', { params: { zone, severity, status } }),
  create: (data) => api.post('/emergencies', data),
  update: (id, data) => api.put(`/emergencies/${id}`, data),
  delete: (id) => api.delete(`/emergencies/${id}`),
};

export const pollutionAPI = {
  getAll: (zone, status) => api.get('/pollution', { params: { zone, status } }),
  getAnalytics: () => api.get('/pollution/analytics'),
};

export const reportsAPI = {
  getTrafficReport: (zone) => api.get('/reports/traffic', { params: { zone } }),
  getWasteReport: (zone) => api.get('/reports/waste', { params: { zone } }),
  getWaterReport: (zone) => api.get('/reports/water', { params: { zone } }),
  getEmergencyReport: (zone) => api.get('/reports/emergency', { params: { zone } }),
  getPollutionReport: (zone) => api.get('/reports/pollution', { params: { zone } }),
};

export const collaborationAPI = {
  getIssues: (zone, status, category) => api.get('/collaboration/issues', { params: { zone, status, category } }),
  createIssue: (data) => api.post('/collaboration/issues', data),
  updateIssue: (id, data) => api.put(`/collaboration/issues/${id}`, data),
  getBulletins: () => api.get('/collaboration/bulletins'),
  createBulletin: (data) => api.post('/collaboration/bulletins', data),
  getActivityLogs: () => api.get('/collaboration/activity-logs'),
  createActivityLog: (data) => api.post('/collaboration/activity-logs', data),
  getNotes: (zone) => api.get('/collaboration/notes', { params: { zone } }),
  createNote: (data) => api.post('/collaboration/notes', data),
};

export default api;

