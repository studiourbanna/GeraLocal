import React from 'react';
import { Product } from '../../models/Product';
import { useAuth } from '../../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, toggleFavorite, addToCart } = useAuth();

  const isFavorite = user?.favorites?.includes(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleFavorite(product.id);
    } else {
      alert("Faça login para favoritar produtos!");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Por favor, faça login para comprar!");
      return;
    }
    // Adiciona 1 unidade por padrão ao clicar no card
    addToCart(product.id, 1);
  };

  return (
    <div className="relative border p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm group">
      {/* Botão de Favorito */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-700/80 shadow-md transition-transform hover:scale-110"
      >
        <span className={isFavorite ? "text-red-500" : "text-gray-400"}>
          {isFavorite ? '❤️' : '🤍'}
        </span>
      </button>

      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
      <h3 className="font-bold dark:text-white">{product.name}</h3>
      <p className="text-blue-600 font-bold">R$ {product.price.toFixed(2)}</p>

      <button
        onClick={handleAddToCart}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <span>🛒</span> Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default ProductCard;
