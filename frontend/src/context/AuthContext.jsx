import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session saat pertama kali aplikasi dibuka
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        // Jika data corrupt, clear session
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Handler Login
  const login = async (emailOrUsername, password) => {
    try {
      const response = await api.post('/auth/login', { emailOrUsername, password });
      const { user: userData, accessToken, refreshToken } = response.data;
      
      setUser(userData);
      setToken(accessToken);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Handler Register
  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { user: userData, accessToken, refreshToken } = response.data;

      setUser(userData);
      setToken(accessToken);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return response;
    } catch (error) {
      throw error;
    }
  };

  // Handler Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  // Helper untuk mengecek apakah user memiliki permission tertentu
  const hasPermission = (permission) => {
    if (!user) return false;
    // Superadmin dengan wildcard 'all' otomatis diizinkan
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
