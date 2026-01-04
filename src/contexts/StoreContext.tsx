import React, { createContext, useContext, useState } from 'react';
import { Product } from '../models/Product';
import { ProductViewModel } from '../viewmodels/ProductViewModel';

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
  const [products, setProducts] = useState(viewModel.getProducts());

  const addProduct = (product: Omit<Product, 'id'>) => {
    viewModel.addProduct(product);
    setProducts(viewModel.getProducts());
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    viewModel.updateProduct(id, updates);
    setProducts([...viewModel.getProducts()]);
  };

  const deleteProduct = (id: string) => {
    viewModel.deleteProduct(id);
    setProducts(viewModel.getProducts());
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