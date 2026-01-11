// Endereço padronizado para Loja, Usuário e Pedido - baseado no ViaCEP
export interface Address {
  zip: string;
  street: string;
  number: string;
  city: string;
  state: string;
}

// Interface para garantir que quase tudo tenha um ID
export interface Entity {
  id: string;
}

// Base para itens (usado em CartItem e OrderItem)
export interface BaseItem extends Entity {
  name: string;
  price: number;
  quantity: number;
}

export interface TabType {
  id: string;
  name: string;
}

// 'products' | 'settings' | 'orders' | 'profile';