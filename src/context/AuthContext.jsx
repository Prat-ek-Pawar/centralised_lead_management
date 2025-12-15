import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to parse user data", e);
      localStorage.removeItem('user');
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [user, role]);

  const loginAdmin = async (userName, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.adminLogin(userName, password);
      if (!data || !data.user) {
        throw new Error('Login failed: No user data received');
      }
      setUser(data.user);
      setRole('admin');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginClient = async (userName, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.clientLogin(userName, password);
      if (!data || !data.user) {
        throw new Error('Login failed: No user data received');
      }
      setUser(data.user);
      setRole('client');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout failed API side", e);
    }
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loginAdmin, loginClient, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
