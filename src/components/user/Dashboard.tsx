import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../models/Product';
import { Order } from '../../models/Order';
import { api } from '../../services/api';

import CartTab from './CartTab';
import FavoritesTab from './FavoritesTab';
import OrdersTab from './OrdersTab';
import ProfileTab from './ProfileTab';

type CustomerTabs = 'cart' | 'favorites' | 'orders' | 'profile';

export const CustomerDashboard: React.FC = () => {
  const { user, addToCart, viewModel } = useAuth();

  const [activeTab, setActiveTab] = useState<CustomerTabs>('cart');
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment'>('cart');

  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [productsRes, ordersData] = await Promise.all([
          api.get('products'),
          viewModel.getUserOrders()
        ]);

        const productsData = productsRes.data || productsRes; // Proteção contra formatos de resposta
        setAllProducts(productsData);
        setMyOrders(ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        if (user.favorites) {
          const filtered = (productsData as Product[]).filter(p => user.favorites?.includes(p.id));
          setFavoriteProducts(filtered);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, viewModel]);

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

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      alert("Erro: Usuário não identificado.");
      return;
    }

    const orderData = {
      userId: user.id, 
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

    const success = await viewModel.placeOrder(orderData);
    if (success) {
      setCheckoutStep('cart');
      setAddress({ street: '', city: '', zip: '' });
      setActiveTab('orders'); 
      const updatedOrders = await viewModel.getUserOrders();
      setMyOrders(updatedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  if (!user) return <div className="p-20 text-center dark:text-white font-bold">⚠️ Faça login para acessar seu painel.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">

      {/* NAVEGAÇÃO POR ABAS (Estilo Admin) */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-8">
            {[
              { id: 'cart', label: 'Meu Carrinho', icon: 'shopping_cart' },
              { id: 'favorites', label: 'Favoritos', icon: 'favorite' },
              { id: 'orders', label: 'Meus Pedidos', icon: 'receipt_long' },
              { id: 'profile', label: 'Minha Conta', icon: 'person_settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CustomerTabs)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                {tab.label}
                {tab.id === 'cart' && cartDetails.length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-bounce">
                    {cartDetails.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO DINÂMICO */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">

        {activeTab === 'cart' && (
          <CartTab
            cartDetails={cartDetails}
            total={total}
            checkoutStep={checkoutStep}
            setCheckoutStep={setCheckoutStep}
            address={address}
            setAddress={setAddress}
            addToCart={addToCart}
            handlePlaceOrder={handlePlaceOrder}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesTab
            favoriteProducts={favoriteProducts}
            loading={loading}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            myOrders={myOrders}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab />
        )}

      </main>
    </div>
  );
};

export default CustomerDashboard;