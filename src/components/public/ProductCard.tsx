import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCardProps } from '@/models/Product';
import { useAuth } from '@/contexts/AuthContext';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, toggleFavorite, addToCart } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = user?.role === 'admin';
  const isCustomer = !isAdmin;
  const isFavorite = user?.favorites?.includes(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user) {
      toggleFavorite(product.id);
    } else {
      navigate('/login'); 
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    addToCart(product.id, 1);
  };

  return (
    <div className="relative border p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm group hover:shadow-md transition-shadow">
      
      {/* Botão de Favorito */}
      {isCustomer && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-700/90 shadow-sm transition-transform hover:scale-110 flex items-center justify-center"
        >
          <span className={`material-symbols-outlined text-2xl transition-colors ${
            isFavorite ? "text-red-500" : "text-gray-400"
          }`}
          style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      )}

      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-40 object-cover rounded-md mb-4" 
      />
      
      <h3 className="font-bold dark:text-white truncate">{product.name}</h3>
      <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">
        R$ {product.price.toFixed(2)}
      </p>

      {/* Botão de Carrinho */}
      {isCustomer && (
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
          <span className="font-semibold text-sm">Adicionar ao Carrinho</span>
        </button>
      )}

      {/* Indicador exclusivo para o Admin */}
      {isAdmin && (
        <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-700/50 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center text-xs text-gray-500 font-medium flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">visibility</span>
          Visualização Admin
        </div>
      )}
    </div>
  );
};

export default ProductCard;