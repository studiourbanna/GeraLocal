import { User } from '../models/User';
import { authService } from '../services/auth';

export class AuthViewModel {
  private user: User | null = null;

  constructor() {
    this.user = authService.getCurrentUser();
  }

  login(email: string, password: string): boolean {
    this.user = authService.login(email, password);
    return this.user !== null;
  }

  logout() {
    authService.logout();
    this.user = null;
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }

  get currentUser(): User | null {
    return this.user;
  }
}