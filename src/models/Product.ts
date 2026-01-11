import { Entity } from './Base';

export interface Product extends Entity {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId: string;
}

export interface ProductCategory extends Entity {
  name: string;
}

export interface ProductsTabProps extends Entity {
  products: Product[];
  categories: ProductCategory[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (id: string, product: Omit<Product, 'id'>) => void;
  onDelete: (id: string) => void;
}

export interface ProductCardProps {
  product: Product;
}