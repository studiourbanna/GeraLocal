import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../models/Product';
import { api } from '../../services/api';
import ProductCard from '../public/ProductCard';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      if (user?.favorites && user.favorites.length > 0) {
        try {
          setLoading(true);
          // Buscamos todos os produtos
          const allProducts: Product[] = await api.get('products');
          // Filtramos apenas os que o ID está na lista de favoritos do usuário
          const filtered = allProducts.filter(p => user.favorites?.includes(p.id));
          setFavoriteProducts(filtered);
        } catch (error) {
          console.error("Erro ao carregar favoritos:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFavoriteProducts([]);
        setLoading(false);
      }
    };

    loadFavoriteProducts();
  }, [user?.favorites]); // Recarrega se a lista de IDs de favoritos mudar

  if (!user) return (
    <div className="p-20 text-center dark:text-white font-bold">
      ⚠️ Por favor, faça login para acessar seu painel.
    </div>
  );

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      
      {/* Coluna 1: Dados Pessoais */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-fit">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
          <span>👤</span> Meus Dados
        </h2>
        <div className="space-y-2 dark:text-gray-300">
          <p><span className="font-bold">Nome:</span> {user.name}</p>
          <p><span className="font-bold">Email:</span> {user.email}</p>
          <p><span className="font-bold">Perfil:</span> <span className="capitalize">{user.role}</span></p>
        </div>
        <button className="mt-6 w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
          Editar Dados e Endereço
        </button>
      </section>

      {/* Coluna 2: Favoritos */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
          <span>❤️</span> Meus Favoritos ({favoriteProducts.length})
        </h2>
        
        {loading ? (
          <p className="text-gray-500 animate-pulse">Carregando seus mimos...</p>
        ) : favoriteProducts.length === 0 ? (
          <p className="text-gray-500 italic">Sua lista está vazia. Explore a loja!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Coluna 3: Carrinho e Checkout */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-2 border-blue-500 h-fit">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
          <span>🛒</span> Meu Carrinho
        </h2>
        
        {/* Espaço reservado para os itens do carrinho que faremos a seguir */}
        <div className="py-10 text-center border-b border-gray-100 dark:border-gray-700 mb-4">
          <p className="text-gray-400">O carrinho será implementado aqui.</p>
        </div>

        <div className="flex justify-between items-center mb-6 dark:text-white font-bold text-lg">
          <span>Total:</span>
          <span>R$ 0,00</span>
        </div>

        <button className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition-transform active:scale-95 shadow-lg">
          Finalizar Compra
        </button>
      </section>
    </div>
  );
};

export default CustomerDashboard;