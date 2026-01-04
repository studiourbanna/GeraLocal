import { Product } from '../models/Product';
import { StoreConfig } from '../models/StoreConfig';
import { api } from './api';

export const storageService = {
  // Busca produtos do backend
  getProducts: async (): Promise<Product[]> => {
    try {
      const data = await api.get('products');
      return Array.isArray(data) ? data : [];
    } catch {
      console.error('Erro ao buscar produtos');
      return [];
    }
  },

  // Salva produtos no backend
  saveProducts: async (products: Product[]) => {
    for (const product of products) {
      if (product.id) {
        // Atualiza produto existente
        await api.put(`products/${product.id}`, product);
      } else {
        // Cria novo produto
        await api.post('products', product);
      }
    }
  },

  // Busca configuração da loja
  getStoreConfig: async (): Promise<StoreConfig> => {
    try {
      const data = await api.get('storeConfig');
      if (Array.isArray(data)) {
        return data[0] || { id: 1, name: 'Minha Loja', theme: 'light', accessibility: 'normal' };
      }
      return data || { id: 1, name: 'Minha Loja', theme: 'light', accessibility: 'normal' };
    } catch {
      return { id: 1, name: 'Minha Loja', theme: 'light', accessibility: 'normal' };
    }
  },


  // Salva configuração da loja
  saveStoreConfig: async (config: StoreConfig) => {
    if (config.id) {
      // Atualiza config existente
      return api.put(`storeConfig/${config.id}`, config);
    }
    // Cria nova config
    return api.post('storeConfig', config);
  }
};
