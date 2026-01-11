import { Address, Entity, BaseItem } from './Base';

export interface OrderStatus extends Entity {
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | string;
}

// OrderItem agora estende BaseItem (reutilização)
export interface OrderItem extends BaseItem {}

export interface Order extends Entity {
  userId: string;
  items: OrderItem[];
  total: number;
  address: Address; // Agora usa o padrão global
  date: string;
  status: OrderStatus[];
}

export interface OrdersTabProps extends Entity {
  myOrders: Order[];
}