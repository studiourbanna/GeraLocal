import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProductsTab from './ProductsTab';
import SettingsTab from './SettingsTab';

const Dashboard: React.FC = () => {
  const { viewModel } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'products' | 'settings'>('products');

  if (!viewModel.isLoggedIn) return null;

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-black dark:text-white">
      <h2 className="text-2xl mb-4">⚙️ Painel Administrativo</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded transition-colors 
            ${activeTab === 'products' 
              ? 'bg-blue-500 hover:bg-blue-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
        >
          📦 Produtos
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded transition-colors 
            ${activeTab === 'settings' 
              ? 'bg-blue-500 hover:bg-blue-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}
        >
          ⚙️ Configurações
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default Dashboard;
