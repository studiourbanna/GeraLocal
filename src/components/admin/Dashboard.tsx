import React, { useState, useEffect } from 'react';

// Importação dos Models refatorados
import { Product, ProductCategory } from '@/models/Product';
import { TabType } from '@/models/Base';

// Importação da API e Contexto
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

// Importação das abas
import ProductsTab from './ProductsTab';
import SettingsTab from './SettingsTab';
import OrdersTab from './OrdersTab';
import ProfileTab from './ProfileTab';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Definição das instâncias de TabType seguindo a nova interface
  const adminTabs: TabType[] = [
    { id: 'orders', name: 'Pedidos' },
    { id: 'products', name: 'Estoque' },
    { id: 'settings', name: 'Loja' },
    { id: 'profile', name: 'Perfil' },
  ];

  // O estado agora guarda o ID (string) da aba ativa
  const [activeTabId, setActiveTabId] = useState<string>(adminTabs[0].id);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

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

  // --- Handlers de Produto (Mantidos com lógica de prev state) ---
  const handleAddProduct = async (data: Omit<Product, 'id'>) => {
    const res = await api.post('products', data);
    setProducts(prev => [...prev, res]);
  };

  const handleUpdateProduct = async (id: string, data: Omit<Product, 'id'>) => {
    const res = await api.put(`products/${id}`, data);
    setProducts(prev => prev.map(p => p.id === id ? res : p));
  };

  const handleDeleteProduct = async (id: string) => {
    await api.delete('products', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F1A] pb-20 transition-colors">
      
      {/* HEADER */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">shield_person</span>
            Admin Console
          </h2>
          <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-full uppercase">
            {user.name}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* NAVEGAÇÃO USANDO A INTERFACE TabType */}
        <nav className="flex flex-wrap gap-2 mb-8 p-1.5 bg-gray-100 dark:bg-gray-900/50 w-fit rounded-2xl border dark:border-gray-800">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTabId === tab.id 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {/* Ícone dinâmico baseado no ID da aba */}
              <span className="material-symbols-outlined text-lg">
                {tab.id === 'orders' ? 'receipt_long' : 
                 tab.id === 'products' ? 'inventory_2' : 
                 tab.id === 'settings' ? 'settings' : 'account_circle'}
              </span>
              {tab.name} {/* Usando a propriedade 'name' do TabType */}
            </button>
          ))}
        </nav>

        {/* ÁREA DE CONTEÚDO (Switch pelo ID) */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
          {activeTabId === 'orders' && <OrdersTab />}
          
          {activeTabId === 'products' && (
            <ProductsTab
              id="tab-products-admin"
              products={products}
              categories={categories}
              onAdd={handleAddProduct}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
            />
          )}

          {activeTabId === 'settings' && <SettingsTab />}
          
          {activeTabId === 'profile' && (
            <ProfileTab
              id="tab-profile-user"
              user={user}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;