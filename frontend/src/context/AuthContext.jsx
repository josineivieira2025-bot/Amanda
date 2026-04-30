import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    setToken(data.token);
    setUser(data.user);
  }

  async function register(payload) {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    setToken(data.token);
    setUser(data.user);
  }

  async function updateProfile(payload) {
    const data = await api('/auth/me', { method: 'PUT', body: JSON.stringify(payload) });
    setUser(data.user);
    return data.user;
  }

  async function changePassword(payload) {
    return api('/auth/password', { method: 'PUT', body: JSON.stringify(payload) });
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateProfile, changePassword }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
