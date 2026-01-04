import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProductsTab from './ProductsTab';
import SettingsTab from './SettingsTab';

const Dashboard: React.FC = () => {
  const { viewModel } = useAuth();
  const [activeTab, setActiveTab] = React.useState('products');

  if (!viewModel.isLoggedIn) return null;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Painel Administrativo</h2>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-primary-light dark:bg-primary-dark text-white' : 'bg-gray-200'}`}
        >
          Produtos
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-primary-light dark:bg-primary-dark text-white' : 'bg-gray-200'}`}
        >
          Configurações
        </button>
      </div>
      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </div>
  );
};

export default Dashboard;