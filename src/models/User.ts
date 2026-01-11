import { Entity } from "./Base";

export interface User extends Entity {
  name: string;
  email: string;
  password?: string; // Opcional para não circular em todo o app
  role: 'admin' | 'user';
  phone?: string;
  favorites: string[]; // IDs dos produtos
  cart: { productId: string; quantity: number }[];
}