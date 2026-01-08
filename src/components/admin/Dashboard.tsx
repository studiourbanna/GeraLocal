import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProductsTab from './ProductsTab';
import SettingsTab from './SettingsTab';
import OrdersTab from './OrdersTab';
import ProfileTab from './ProfileTab';
import { Product, Category } from '../../models/Product';
import { api } from '../../services/api';

type TabType = 'products' | 'settings' | 'orders' | 'profile';

const Dashboard: React.FC = () => {
  const { user, viewModel } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.get('products'),
          api.get('categories')
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  const addProduct = async (newProductData: Omit<Product, 'id'>) => {
    try {
      const savedProduct = await api.post('products', newProductData);
      setProducts([...products, savedProduct]);
    } catch (error) { console.error(error); }
  };

  const updateProduct = async (id: string, updatedData: Omit<Product, 'id'>) => {
    try {
      const updatedProduct = await api.put(`products/${id}`, updatedData);
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
    } catch (error) { console.error(error); }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Excluir produto?')) {
      try {
        await api.delete('products', id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) { console.error(error); }
    }
  };

  if (!viewModel.isLoggedIn) return null;

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-black dark:text-white transition-colors">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-blue-600">dashboard</span> 
          PAINEL ADMIN
        </h2>
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
          <span className="material-symbols-outlined text-blue-600">person</span>
          <span className="text-sm font-bold uppercase">{user?.name}</span>
        </div>
      </header>

      {/* --- MENU DE NAVEGAÇÃO --- */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { id: 'orders', label: 'Pedidos', icon: 'receipt_long' },
          { id: 'products', label: 'Estoque', icon: 'inventory_2' },
          { id: 'settings', label: 'Loja', icon: 'settings' },
          { id: 'profile', label: 'Meu Perfil', icon: 'account_circle' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm
              ${activeTab === tab.id 
                ? 'bg-blue-600 text-white scale-105 shadow-blue-200 dark:shadow-none' 
                : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            <span className="material-symbols-outlined">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- CONTEÚDO DINÂMICO --- */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            categories={categories}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
          />
        )}
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
};

export default Dashboard;