import { User } from '../models/User';
import { api } from './api';

export const authService = {
  // Login consulta a lista de usuários no backend
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const users: User[] = await api.get('users');
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return null;
      }

      // salva usuário logado no localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (err) {
      console.error('Erro no login:', err);
      return null;
    }
  },

  // Logout remove usuário da sessão
  logout: () => {
    localStorage.removeItem('currentUser');
  },

  // Recupera usuário atual da sessão
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }
};
