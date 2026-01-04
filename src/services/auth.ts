import { User } from '../models/User';
import { api } from './api';

export const authService = {
  login: (email: string, password: string): User | null => {
    // Simulação
    if (email === 'admin@loja.com' && password === 'admin123') {
      const user: User = { id: '1', email, name: 'Admin', role: 'admin' };
      api.set('user', user);
      return user;
    }
    return null;
  },
  logout: () => {
    api.remove('user');
  },
  getCurrentUser: (): User | null => {
    return api.get('user');
  }
};