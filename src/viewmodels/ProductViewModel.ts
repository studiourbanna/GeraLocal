import { Product } from '../models/Product';
import { api } from '../services/api';

export class ProductViewModel {
  private products: Product[] = [];

  async getProducts(): Promise<Product[]> {
    const data = await api.get('products');
    this.products = Array.isArray(data) ? data : [];
    return this.products;
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const savedProduct = await api.post('products', product);
    this.products.push(savedProduct);
    return savedProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const updatedProduct = await api.put(`products/${id}`, updates);
    this.products = this.products.map(p => p.id === id ? updatedProduct : p);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete('products', id);
    this.products = this.products.filter(p => p.id !== id);
  }
}