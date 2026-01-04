import { Product } from '../models/Product';
import { StoreConfig } from '../models/StoreConfig';
import { api } from './api';

export const storageService = {
  getProducts: (): Product[] => {
    return api.get('products') || [];
  },
  saveProducts: (products: Product[]) => {
    api.set('products', products);
  },
  getStoreConfig: (): StoreConfig => {
    return api.get('storeConfig') || { name: 'Minha Loja', theme: 'light', accessibility: 'normal' };
  },
  saveStoreConfig: (config: StoreConfig) => {
    api.set('storeConfig', config);
  }
};