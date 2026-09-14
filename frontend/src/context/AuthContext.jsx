import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

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
      const res = await authAPI.login(email, password);
      const { access_token, user: userData } = res.data;
      
      setToken(access_token);
      setUser(userData);
      
      localStorage.setItem('smartcity_token', access_token);
      localStorage.setItem('smartcity_user', JSON.stringify(userData));
      
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Invalid email or password';
      toast.error(msg);
      return false;
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const res = await authAPI.register(name, email, password, role);
      const { access_token, user: userData } = res.data;

      setToken(access_token);
      setUser(userData);

      localStorage.setItem('smartcity_token', access_token);
      localStorage.setItem('smartcity_user', JSON.stringify(userData));

      toast.success('Registration successful! Welcome to Smart City Platform.');
      return true;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Registration failed';
      toast.error(msg);
      return false;
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
