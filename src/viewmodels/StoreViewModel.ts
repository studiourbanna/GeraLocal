import { StoreConfig } from '../models/StoreConfig';
import { api } from '../services/api';

export class StoreViewModel {
  private config: StoreConfig | null = null;

  async getConfig(): Promise<StoreConfig> {
    const response = await api.get('storeConfig');
    // Se a API retornar array, pegamos o primeiro. Se retornar objeto, usamos direto.
    const rawData = Array.isArray(response) ? response[0] : response;
    
    const data: StoreConfig = {
      ...rawData,
      theme: rawData?.theme ?? 'light',
    };
    this.config = data;
    return data;
  }

  async updateConfig(updates: Partial<StoreConfig>): Promise<StoreConfig> {
    // Mesclamos o que temos na memória com os novos updates antes de enviar
    const mergedConfig = {
      ...(this.config || {}),
      ...updates,
      id: "1" // Forçamos o ID 1 para o JSON Server não criar um novo
    } as StoreConfig;

    // Enviamos para storeConfig/1 (a rota correta para atualizar)
    const response = await api.put('storeConfig/1', mergedConfig);
    
    // Tratamos o retorno (mesma lógica do get)
    const rawData = Array.isArray(response) ? response[0] : response;
    const data: StoreConfig = {
      ...rawData,
      theme: rawData?.theme ?? mergedConfig.theme ?? 'light',
    };
    
    this.config = data;
    return data;
  }

  getCurrentConfig(): StoreConfig | null {
    return this.config;
  }
}