import { User } from '../models/User';
import { authService } from '../services/auth';

export class AuthViewModel {
  private user: User | null = null;

  constructor() {
    this.user = authService.getCurrentUser();
  }

  // login agora é assíncrono para refletir o authService
  async login(email: string, password: string): Promise<User | null> { 
    const loggedUser = await authService.login(email, password); 
    this.user = loggedUser; return this.user; 
  }

  logout() {
    authService.logout();
    this.user = null;
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  // método explícito para alinhar com AuthContextType
  getCurrentUser(): User | null {
    return this.user;
  }
}
