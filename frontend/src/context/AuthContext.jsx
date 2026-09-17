import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const extractErrorMessage = (error, defaultMsg) => {
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((err) => {
          if (typeof err === 'string') return err;
          if (err.msg) {
            const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : '';
            return field ? `${field}: ${err.msg}` : err.msg;
          }
          return JSON.stringify(err);
        })
        .join(', ');
    }
    if (typeof detail === 'object') {
      return JSON.stringify(detail);
    }
  }
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
    return 'Backend server is unreachable. Please ensure the backend API server is running on port 8000.';
  }
  return error.message || defaultMsg;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartcity_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartcity_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
          localStorage.setItem('smartcity_user', JSON.stringify(res.data));
        } catch (error) {
          console.error('Failed to verify token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const cleanEmail = email ? email.trim() : '';
      const res = await authAPI.login(cleanEmail, password);
      const { access_token, user: userData } = res.data;
      
      setToken(access_token);
      setUser(userData);
      
      localStorage.setItem('smartcity_token', access_token);
      localStorage.setItem('smartcity_user', JSON.stringify(userData));
      
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Invalid email or password');
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const cleanName = name ? name.trim() : '';
      const cleanEmail = email ? email.trim() : '';
      const res = await authAPI.register(cleanName, cleanEmail, password, role);
      const { access_token, user: userData } = res.data;

      setToken(access_token);
      setUser(userData);

      localStorage.setItem('smartcity_token', access_token);
      localStorage.setItem('smartcity_user', JSON.stringify(userData));

      toast.success('Registration successful! Welcome to Smart City Platform.');
      return { success: true };
    } catch (error) {
      const msg = extractErrorMessage(error, 'Registration failed');
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smartcity_token');
    localStorage.removeItem('smartcity_user');
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

