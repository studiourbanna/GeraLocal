const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  // HTTP
  get: async (endpoint: string) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error('Erro ao buscar dados');
    return res.json();
  },

  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar recurso');
    return res.json();
  },

  put: async (endpoint: string, data: any) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar recurso');
    return res.json();
  },

  patch: async (endpoint: string, data: any) => {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar parcialmente recurso');
    return res.json();
  },

  delete: async (endpoint: string, id: string | number) => {
    const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar recurso');
    return true;
  },

  // LocalStorage (para storeConfig, theme etc.)
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getLocal: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  }
};
