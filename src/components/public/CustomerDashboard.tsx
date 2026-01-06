import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../models/Product';
import { api } from '../../services/api';
import ProductCard from '../public/ProductCard';

export const CustomerDashboard: React.FC = () => {
  const { user, addToCart, viewModel } = useAuth();
  
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const productsData: Product[] = await api.get('products');
        setAllProducts(productsData);

        if (user?.favorites) {
          const filtered = productsData.filter(p => user.favorites?.includes(p.id));
          setFavoriteProducts(filtered);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [user?.favorites]);

  const cartDetails = useMemo(() => {
    if (!user?.cart || allProducts.length === 0) return [];
    return user.cart.map(cartItem => {
      const product = allProducts.find(p => p.id === cartItem.productId);
      return { product, quantity: cartItem.quantity };
    }).filter(item => item.product !== undefined) as { product: Product, quantity: number }[];
  }, [user?.cart, allProducts]);

  const total = useMemo(() => {
    return cartDetails.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cartDetails]);

  if (!user) return <div className="p-20 text-center dark:text-white font-bold">⚠️ Faça login.</div>;

  const handlePlaceOrder = async () => {
    if (!user) return;

    if (!address.street || !address.city || !address.zip) {
      alert("Por favor, preencha todos os campos de endereço!");
      return;
    }

    const orderData = {
      userId: user.id, // TS agora sabe que id existe aqui
      items: cartDetails.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      total: total,
      address: address,
      date: new Date().toLocaleString('pt-BR'),
      status: 'pending' as const
    };

    // 4. viewModel agora está disponível via useAuth()
    const success = await viewModel.placeOrder(orderData);

    if (success) {
      alert("🎉 Pedido realizado com sucesso! Você pode acompanhar o status em breve.");
      setIsCheckingOut(false);
      setAddress({ street: '', city: '', zip: '' });
    } else {
      alert("❌ Ocorreu um erro ao processar seu pedido. Tente novamente.");
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

      {/* Coluna 1: Dados Pessoais */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-fit">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2"><span>👤</span> Meus Dados</h2>
        <div className="space-y-2 dark:text-gray-300">
          <p><span className="font-bold">Nome:</span> {user.name}</p>
          <p><span className="font-bold">Email:</span> {user.email}</p>
        </div>
        <button className="mt-6 w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
          Editar Perfil
        </button>
      </section>

      {/* Coluna 2: Favoritos */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2"><span>❤️</span> Favoritos</h2>
        {loading ? <p className="animate-pulse">Carregando...</p> : (
          <div className="flex flex-col gap-4">
            {favoriteProducts.length === 0 ? <p className="text-gray-500 italic">Lista vazia.</p> :
              favoriteProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Coluna 3: Carrinho e Checkout */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-2 border-blue-500 h-fit">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
          <span>{isCheckingOut ? '📍 Entrega' : '🛒 Carrinho'}</span>
        </h2>

        {!isCheckingOut ? (
          <>
            <div className="min-h-[100px] space-y-3 mb-4 border-b pb-4 dark:border-gray-700 overflow-y-auto max-h-60">
              {cartDetails.length === 0 ? (
                <p className="text-center text-gray-400 py-4">Carrinho vazio</p>
              ) : (
                cartDetails.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center text-sm dark:text-white">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-xs text-gray-500">R$ {item.product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => addToCart(item.product.id, item.quantity - 1)} className="px-2 bg-gray-200 dark:bg-gray-700 rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(item.product.id, item.quantity + 1)} className="px-2 bg-gray-200 dark:bg-gray-700 rounded">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between items-center mb-6 dark:text-white font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">R$ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setIsCheckingOut(true)}
              disabled={cartDetails.length === 0}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
            >
              Prosseguir para Entrega
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <input
              type="text" placeholder="Rua e Número"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text" placeholder="Cidade"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
              />
              <input
                type="text" placeholder="CEP"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button onClick={() => setIsCheckingOut(false)} className="flex-1 py-2 bg-gray-200 rounded font-bold">Voltar</button>
              <button onClick={handlePlaceOrder} className="flex-1 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">Finalizar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerDashboard;