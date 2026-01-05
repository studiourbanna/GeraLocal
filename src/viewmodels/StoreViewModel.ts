import { StoreConfig } from '../models/StoreConfig';
import { api } from '../services/api';

export class StoreViewModel {
  private config: StoreConfig | null = null;

  // Busca a configuração da loja na API
  async getConfig(): Promise<StoreConfig> {
    const response = await api.get('storeConfig'); // ✅ barra inicial
    const data: StoreConfig = {
      ...response.data,
      theme: response.data?.theme ?? 'light', // valor padrão
    };
    this.config = data;
    return data;
  }

  // Atualiza a configuração da loja (aceita objeto parcial)
  async updateConfig(updates: Partial<StoreConfig>): Promise<StoreConfig> {
    // mescla a configuração atual com os updates
    const mergedConfig: StoreConfig = {
      ...(this.config ?? {}), // ✅ evita erro se for null
      ...updates,
    } as StoreConfig;

    const response = await api.put('storeConfig', mergedConfig); // ✅ barra inicial
    const data: StoreConfig = {
      ...response.data,
      theme: response.data?.theme ?? mergedConfig.theme ?? 'light', // garante theme
    };
    this.config = data;
    return data;
  }

  // Retorna a configuração atual em memória
  getCurrentConfig(): StoreConfig | null {
    return this.config;
  }
}
