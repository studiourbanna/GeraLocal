// Simulação de API com localStorage
export const api = {
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  }
};