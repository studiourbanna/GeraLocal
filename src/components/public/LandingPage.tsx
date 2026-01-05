import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useLocation } from 'react-router-dom';
import { Product } from '../../models/Product';
import { api } from '../../services/api';

const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('products');
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos na API:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">
        🚀 Nossa Vitrine de Produtos
      </h1>

      {successMessage && (
        <div className="max-w-md mx-auto bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-8 text-center">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">Nenhum produto encontrado no banco de dados. 📦</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default LandingPage;