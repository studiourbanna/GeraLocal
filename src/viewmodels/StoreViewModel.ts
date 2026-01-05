import { StoreConfig } from '../models/StoreConfig';
import { api } from '../services/api';

export class StoreViewModel {
  private config: StoreConfig | null = null;

  // Busca a configuração da loja na API
  async getConfig(): Promise<StoreConfig> {
    const response = await api.get('/storeConfig');
    const data: StoreConfig = response.data;
    this.config = data;
    return data;
  }

  // Atualiza a configuração da loja
  async updateConfig(newConfig: StoreConfig): Promise<StoreConfig> {
    const response = await api.put('/storeConfig', newConfig);
    const data: StoreConfig = response.data;
    this.config = data;
    return data;
  }

  // Retorna a configuração atual em memória
  getCurrentConfig(): StoreConfig | null {
    return this.config;
  }
}
