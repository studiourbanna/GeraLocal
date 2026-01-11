import { Address, Entity } from './Base';

export interface StoreConfig {
  id: any;
  name: string;
  theme: 'light' | 'dark';
  accessibility: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  categoryId?: string;
  address?: Address;
}

export interface StoreCategory extends Entity {
  name: string;
  storeIcon: string;
}