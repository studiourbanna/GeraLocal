import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import ProductCard from './ProductCard';
import { useLocation } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { products } = useStore();
  const location = useLocation();

  // Captura mensagem passada pelo navigate
  const successMessage = location.state?.successMessage;

  // Garante que products seja sempre um array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl mb-8 text-center text-black dark:text-white">
        Bem-vindo à Nossa Loja
      </h1>

      {/* Mensagem de login bem-sucedido */}
      {successMessage && (
        <p className="text-center text-green-600 dark:text-green-400 mb-6 font-semibold">
          {successMessage}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeProducts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 col-span-3">
            Nenhum produto disponível.
          </p>
        ) : (
          safeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default LandingPage;
