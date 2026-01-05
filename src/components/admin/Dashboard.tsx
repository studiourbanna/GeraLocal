import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProductsTab from './ProductsTab';
import SettingsTab from './SettingsTab';
import { Product } from '../../models/Product';
import { api } from '../../services/api'; // Certifique-se de importar sua api

const Dashboard: React.FC = () => {
  const { viewModel } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);

  // CARREGAR: Busca do db.json via API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.get('products');
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos do servidor:', error);
      }
    };
    loadProducts();
  }, []);

  const addProduct = async (newProductData: Omit<Product, 'id'>) => {
    try {
      // O JSON Server gera o ID automaticamente se você não enviar um
      const savedProduct = await api.post('products', newProductData);
      setProducts([...products, savedProduct]);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const updateProduct = async (id: string, updatedData: Omit<Product, 'id'>) => {
    try {
      const updatedProduct = await api.put(`products/${id}`, updatedData);
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      try {
        await api.delete('products', id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
      }
    }
  };

  if (!viewModel.isLoggedIn) return null;

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-6">⚙️ Painel Administrativo</h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors 
            ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        >
          📦 Gerenciar Estoque
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors 
            ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        >
          ⚙️ Configurações
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700">
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
          />
        )}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default Dashboard;