import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { authService } from '@/services/auth';
import { api } from '@/services/api';

export class AuthViewModel {
  private user: User | null = null;

  constructor() {
    this.user = authService.getCurrentUser();
  }

  // ✅ Getter para leitura
  get currentUser(): User | null {
    return this.user;
  }

  // ✅ Setter para escrita (Permite: viewModel.currentUser = novoUsuario)
  set currentUser(updatedUser: User | null) {
    this.user = updatedUser;
    if (updatedUser) {
      // Sincroniza com o armazenamento persistente
      localStorage.setItem('@App:user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('@App:user');
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const loggedUser = await authService.login(email, password);
      this.currentUser = loggedUser; // Usa o setter
      return loggedUser !== null;
    } catch (error) {
      console.error('Erro no login:', error);
      this.currentUser = null;
      return false;
    }
  }

  logout(): void {
    authService.logout();
    this.currentUser = null; // Usa o setter para limpar tudo
  }

  // Método privado para atualizar o estado interno e persistência
  private async persistUser(updatedUser: User): Promise<void> {
    this.currentUser = updatedUser; // Usa o setter
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

      this.currentUser = response; // Usa o setter
      return true;
    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      return false;
    }
  }

  async getUserOrders(): Promise<Order[]> {
    if (!this.user) return [];
    try {
      const response = await api.get(`orders?userId=${this.user.id}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn("Rota de pedidos não encontrada.");
      return [];
    }
  }

  async updateUser(userId: string, updatedData: Partial<User>): Promise<boolean> {
    try {
      const response = await api.put(`users/${userId}`, {
        ...this.user,
        ...updatedData
      });

      await this.persistUser(response);
      return true;
    }
    catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return false;
    }
  }

  get isLoggedIn(): boolean { return this.user !== null; }
}