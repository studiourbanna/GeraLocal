import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/models/Product';
import { ProductViewModel } from '@/viewmodels/ProductViewModel';

interface StoreContextType {
  viewModel: ProductViewModel;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModel] = useState(() => new ProductViewModel());

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const data = viewModel.getProducts();
    setProducts(Array.isArray(data) ? data : []);
  }, [viewModel]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    viewModel.addProduct(product);
    const data = viewModel.getProducts();
    setProducts(Array.isArray(data) ? data : []);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    viewModel.updateProduct(id, updates);
    const data = viewModel.getProducts();
    setProducts(Array.isArray(data) ? [...data] : []);
  };

  const deleteProduct = (id: string) => {
    viewModel.deleteProduct(id);
    const data = viewModel.getProducts();
    setProducts(Array.isArray(data) ? data : []);
  };

  return (
    <StoreContext.Provider value={{ viewModel, products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
