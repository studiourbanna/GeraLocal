export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  date: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
}

export interface OrdersTabProps {
  myOrders: Order[];
}
