import React from 'react';
import { FavoritesTabProps } from '@/models/Favorite';
import ProductCard from '../public/ProductCard';

const FavoritesTab: React.FC<FavoritesTabProps> = ({ favoriteProducts, loading }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Header da Aba */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">
            Meus Desejos
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Produtos que você salvou para comprar depois.
          </p>
        </div>
        
        {favoriteProducts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-900/30">
            <p className="text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">favorite</span>
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item salvo' : 'itens salvos'}
            </p>
          </div>
        )}
      </div>

      {/* Estado de Carregamento */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Lista de Favoritos */}
          {favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-gray-300">heart_broken</span>
              </div>
              <h3 className="text-lg font-bold dark:text-white">Sua lista está vazia</h3>
              <p className="text-gray-400 text-sm max-w-xs text-center mt-2">
                Explore a loja e clique no ícone de coração para salvar seus produtos favoritos aqui.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
              >
                Explorar Produtos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product) => (
                <div key={product.id} className="relative group">
                  {/* Reaproveitamos o ProductCard para manter a consistência visual */}
                  <ProductCard product={product} />
                  
                  {/* Badge de "Favorito" flutuante para reforçar o contexto da aba */}
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                      <span className="material-symbols-outlined text-red-500 text-base leading-none">
                        favorite
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Dica de Segurança */}
      <div className="mt-12 p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl flex items-center gap-4">
        <span className="material-symbols-outlined text-indigo-600">info</span>
        <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">
          <strong>Dica:</strong> Os itens nos favoritos não reservam estoque. Finalize sua compra para garantir seus produtos!
        </p>
      </div>
    </div>
  );
};

export default FavoritesTab;