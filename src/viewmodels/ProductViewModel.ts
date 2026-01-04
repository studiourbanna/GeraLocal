import { Product } from '../models/Product';
import { storageService } from '../services/storage';

export class ProductViewModel {
  private products: Product[] = [];

  constructor() {
    const data = storageService.getProducts();
    // garante que products seja sempre array
    this.products = Array.isArray(data) ? data : [];
  }

  getProducts(): Product[] {
    // reforço: sempre retorna array
    return Array.isArray(this.products) ? this.products : [];
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = { ...product, id: Date.now().toString() };
    this.products.push(newProduct);
    this.save();
  }

  updateProduct(id: string, updates: Partial<Product>) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      this.save();
    }
  }

  deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    this.save();
  }

  private save() {
    // garante que salva sempre array
    storageService.saveProducts(Array.isArray(this.products) ? this.products : []);
  }
}
