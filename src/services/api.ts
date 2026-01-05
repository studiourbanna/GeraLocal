const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  get: async (endpoint: string) => {
    // Se for storeConfig, buscamos o primeiro item da lista (ID 1)
    const url = endpoint === 'storeConfig' ? 'storeConfig/1' : endpoint;
    const res = await fetch(`${BASE_URL}/${url}`);
    if (!res.ok) throw new Error('Erro ao buscar dados');
    return res.json();
  },

  put: async (endpoint: string, data: any) => {
    // Garantimos que estamos atualizando o registro ID 1
    const url = endpoint.includes('storeConfig') ? 'storeConfig/1' : endpoint;
    
    const res = await fetch(`${BASE_URL}/${url}`, {
      method: 'PUT', // Ou PATCH se quiser atualizar apenas campos enviados
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error('Erro ao atualizar recurso no DB');
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

  // Helpers de LocalStorage
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