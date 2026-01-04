import { Product } from '../models/Product';
import { storageService } from '../services/storage';

export class ProductViewModel {
  private products: Product[] = [];

  constructor() {
    this.products = storageService.getProducts();
  }

  getProducts(): Product[] {
    return this.products;
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
    storageService.saveProducts(this.products);
  }
}