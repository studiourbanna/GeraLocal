import { User } from '../models/User';
import { authService } from '../services/auth';

export class AuthViewModel {
  private user: User | null = null;

  constructor() {
    this.user = authService.getCurrentUser();
  }

  // Login retorna boolean para indicar sucesso/falha
  async login(email: string, password: string): Promise<boolean> { 
    try {
      const loggedUser = await authService.login(email, password);
      this.user = loggedUser;
      return loggedUser !== null; // Retorna true se login bem-sucedido
    } catch (error) {
      console.error('Erro no login:', error);
      this.user = null;
      return false; // Retorna false em caso de erro
    }
  }

  logout(): void {
    authService.logout();
    this.user = null;
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  // Retorna o usuário atual
  getCurrentUser(): User | null {
    return this.user;
  }

  // Método adicional útil para obter dados específicos do usuário
  getUserEmail(): string | null {
    return this.user?.email ?? null;
  }

  getUserName(): string | null {
    return this.user?.name ?? null;
  }
}