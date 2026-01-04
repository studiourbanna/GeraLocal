import React from 'react';
import { useStore } from '../../contexts/StoreContext';
import ProductCard from './ProductCard';

const LandingPage: React.FC = () => {
  const { products } = useStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-8 text-center">Bem-vindo à Nossa Loja</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;