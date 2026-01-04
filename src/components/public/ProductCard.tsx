import React from 'react';
import { Product } from '../../models/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition 
                    bg-white dark:bg-gray-800 
                    text-black dark:text-white">
      <img
        src={product.image || '/placeholder.jpg'}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-2">{product.description}</p>
      <p className="text-lg font-semibold text-black dark:text-yellow-400">
        R$ {product.price}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Estoque: {product.stock}
      </p>
    </div>
  );
};

export default ProductCard;
