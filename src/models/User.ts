export interface User {
  favorites: string[];
  cart: { productId: string; quantity: number }[];
  password: string;
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}