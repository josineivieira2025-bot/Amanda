const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_URL = RAW_API_URL.replace(/\/+$/, '').endsWith('/api')
  ? RAW_API_URL.replace(/\/+$/, '')
  : `${RAW_API_URL.replace(/\/+$/, '')}/api`;

export function getToken() {
  return localStorage.getItem('photo_erp_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('photo_erp_token', token);
  else localStorage.removeItem('photo_erp_token');
}

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao comunicar com a API.');
  }
  return data;
}

export { API_URL };
