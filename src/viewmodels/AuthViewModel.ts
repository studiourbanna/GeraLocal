import { User } from '../models/User';
import { Order } from '../models/Order';
import { authService } from '../services/auth';
import { api } from '../services/api';

export class AuthViewModel {
  private user: User | null = null;

  constructor() {
    this.user = authService.getCurrentUser();
  }

  get currentUser(): User | null {
    return this.user;
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const loggedUser = await authService.login(email, password);
      this.user = loggedUser;
      return loggedUser !== null;
    } catch (error) {
      console.error('Erro no login:', error);
      this.user = null;
      return false;
    }
  }

  logout(): void {
    authService.logout();
    this.user = null;
  }

  private async persistUser(updatedUser: User): Promise<void> {
    this.user = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  async toggleFavorite(productId: string): Promise<void> {
    if (!this.user) return;

    const currentFavorites = this.user.favorites || [];
    const isFavorite = currentFavorites.includes(productId);

    const updatedFavorites = isFavorite
      ? currentFavorites.filter(id => id !== productId)
      : [...currentFavorites, productId];

    const response = await api.put(`users/${this.user.id}`, {
      ...this.user,
      favorites: updatedFavorites
    });

    await this.persistUser(response);
  }

  async updateCart(productId: string, quantity: number): Promise<void> {
    if (!this.user) return;

    let cart = [...(this.user.cart || [])];
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart = cart.filter(item => item.productId !== productId);
      } else {
        cart[itemIndex] = { ...cart[itemIndex], quantity };
      }
    } else if (quantity > 0) {
      cart.push({ productId, quantity });
    }

    const response = await api.put(`users/${this.user.id}`, {
      ...this.user,
      cart
    });

    await this.persistUser(response);
  }

  async placeOrder(orderData: Omit<Order, 'id'>): Promise<boolean> {
    if (!this.user) return false;

    try {
      await api.post('orders', orderData);

      const updatedUser = { ...this.user, cart: [] };
      const response = await api.put(`users/${this.user.id}`, updatedUser);

      this.user = response;
      localStorage.setItem('user', JSON.stringify(response));

      return true;
    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      return false;
    }
  }

  getCurrentUser(): User | null { return this.user; }
  get isLoggedIn(): boolean { return this.user !== null; }
}