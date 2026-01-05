import { User } from '../models/User';
import { authService } from '../services/auth';
import { api } from '../services/api';

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

  async toggleFavorite(productId: string): Promise<void> {
    if (!this.user) return;

    // Inicializa favoritos como array caso não exista
    const currentFavorites = this.user.favorites || [];
    const isFavorite = currentFavorites.includes(productId);

    let updatedFavorites;
    if (isFavorite) {
      // Se já é favorito, remove
      updatedFavorites = currentFavorites.filter(id => id !== productId);
    } else {
      // Se não é, adiciona
      updatedFavorites = [...currentFavorites, productId];
    }

    // Atualiza o usuário no db.json via API
    const updatedUser = await api.put(`users/${this.user.id}`, {
      ...this.user,
      favorites: updatedFavorites
    });

    this.user = updatedUser;
  }

  async updateCart(productId: string, quantity: number): Promise<void> {
    if (!this.user) return;

    let cart = this.user.cart || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart = cart.filter(item => item.productId !== productId);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      cart.push({ productId, quantity });
    }

    const updatedUser = await api.put(`users/${this.user.id}`, { ...this.user, cart });
    this.user = updatedUser;
  }
}