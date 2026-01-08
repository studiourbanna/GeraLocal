import { Product } from './Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartTabProps {
  cartDetails: CartItem[];
  total: number;
  checkoutStep: 'cart' | 'address' | 'payment';
  setCheckoutStep: (step: 'cart' | 'address' | 'payment') => void;
  address: { street: string; city: string; zip: string };
  setAddress: (address: any) => void;
  addToCart: (productId: string, quantity: number) => void;
  handlePlaceOrder: () => void;
}
