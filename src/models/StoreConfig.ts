export interface StoreConfig {
  id: any;
  name: string;
  theme: 'light' | 'dark';
  accessibility: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  categoryId?: string;
  address?: {
    street: string;
    number: string;
    city: string;
  };
}

export interface StoreCategory {
  id: string;
  name: string;
  storeIcon: string;
}