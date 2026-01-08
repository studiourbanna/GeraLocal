export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductsTabProps {
  products: Product[];
  categories?: Category[]; 
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (id: string, product: Omit<Product, 'id'>) => void;
  onDelete: (id: string) => void;
}

export interface FavoritesTabProps {
  favoriteProducts: Product[];
  loading: boolean;
}