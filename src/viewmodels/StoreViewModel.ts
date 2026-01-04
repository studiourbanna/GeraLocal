import { StoreConfig } from '../models/StoreConfig';
import { storageService } from '../services/storage';

export class StoreViewModel {
  private config: StoreConfig;

  constructor() {
    this.config = storageService.getStoreConfig();
  }

  getConfig(): StoreConfig {
    return this.config;
  }

  updateConfig(updates: Partial<StoreConfig>) {
    this.config = { ...this.config, ...updates };
    storageService.saveStoreConfig(this.config);
  }
}