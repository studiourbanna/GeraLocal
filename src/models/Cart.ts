import { Product } from './Product';
import { Address, Entity } from './Base';

export interface CartItem extends Entity {
  product: Product;
  quantity: number;
}

export interface CartCheckoutStep extends Entity {
  name: 'cart' | 'address' | 'payment';
  setCheckoutStep: (step: CartCheckoutStep['name']) => void;
}

// Reaproveita a interface Address e adiciona a função de controle
export interface CartAddress extends Address {
  setAddress: (address: Address) => void;
}

export interface CartTabProps extends Entity {
  cartDetails: CartItem[];
  total: number;
  checkoutStep: CartCheckoutStep[]; // Mantendo seu padrão de array de instância
  address: CartAddress[];           // Mantendo seu padrão de array de instância
  addToCart: (productId: string, quantity: number) => void;
  handlePlaceOrder: () => void;
}