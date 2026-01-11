import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { CartItem } from '@/models/Cart';
import { TabType } from '@/models/Base'; // Importando a nova interface
import { api } from '@/services/api';

import CartTab from './CartTab';
import FavoritesTab from './FavoritesTab';
import OrdersTab from './OrdersTab';
import ProfileTab from './ProfileTab';

export const UserDashboard: React.FC = () => {
  const { user, addToCart, viewModel } = useAuth();

  // 1. Definição das abas usando a interface TabType
  const customerTabs: TabType[] = [
    { id: 'profile', name: 'Minha Conta' },
    { id: 'favorites', name: 'Favoritos' },
    { id: 'cart', name: 'Meu Carrinho' },
    { id: 'orders', name: 'Meus Pedidos' },
  ];

  // O estado agora armazena o ID da aba ativa
  const [activeTabId, setActiveTabId] = useState<string>(customerTabs[0].id);
  const [loading, setLoading] = useState(true);

  // Estados de Checkout
  const [currentStep, setCurrentStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const [currentAddress, setCurrentAddress] = useState({
    zip: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });

  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  // 2. Instâncias para o CartTab (Conforme sua interface CartTabProps)
  const checkoutStepInstance = [{
    id: 'step-ctrl',
    name: currentStep,
    setCheckoutStep: (step: 'cart' | 'address' | 'payment') => setCurrentStep(step)
  }];

  const addressInstance = [{
    ...currentAddress,
    setAddress: (newAddress: any) => setCurrentAddress(newAddress)
  }];

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [productsRes, ordersData] = await Promise.all([
          api.get('products'),
          viewModel.getUserOrders()
        ]);

        const productsData = productsRes.data || productsRes;
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

  const cartDetails = useMemo((): CartItem[] => {
    if (!user?.cart || allProducts.length === 0) return [];

    // Definimos explicitamente o tipo do array que o map produz
    const mappedItems = user.cart.map((cartItem: { productId: string; quantity: number }) => {
      const product = allProducts.find((p) => p.id === cartItem.productId);
      return {
        id: cartItem.productId,
        product: product,
        quantity: cartItem.quantity,
      };
    });

    // Agora filtramos os itens válidos
    return mappedItems.filter((item: any): item is CartItem =>
      item.product !== undefined && item.product !== null
    );
  }, [user?.cart, allProducts]);

  const total = useMemo(() => {
    return cartDetails.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cartDetails]);

  const handlePlaceOrder = async () => {
    if (!user?.id) return;

    // Criando o objeto respeitando estritamente o tipo Omit<Order, "id">
    const orderData: Omit<Order, "id"> = {
      userId: user.id,
      items: cartDetails.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      total: total,
      address: {
        zip: currentAddress.zip,
        street: currentAddress.street,
        number: currentAddress.number,
        city: currentAddress.city,
        state: currentAddress.state // Certifique-se que o state existe aqui!
      },
      date: new Date().toLocaleString('pt-BR'),
      status: [{ id: '1', status: 'pending' }]
    };

    const success = await viewModel.placeOrder(orderData);
    if (success) {
      // Resetando após o sucesso
      setCurrentStep('cart');
      setCurrentAddress({ zip: '', street: '', number: '', city: '', state: '' });
      setActiveTabId('orders');
      // ... restando da lógica de reload
    }
  };

  if (!user) return <div className="p-20 text-center font-bold">⚠️ Faça login.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors">

      {/* NAVEGAÇÃO RESTRUTURADA */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-8">
            {customerTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTabId === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {tab.id === 'profile' ? 'person_settings' :
                    tab.id === 'favorites' ? 'favorite' :
                      tab.id === 'cart' ? 'shopping_cart' : 'receipt_long'}
                </span>
                {tab.name}
                {tab.id === 'cart' && cartDetails.length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-1">
                    {cartDetails.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTabId === 'profile' && <ProfileTab />}

          {activeTabId === 'favorites' && (
            <FavoritesTab
              id="tab-favorites-user" // Adicionado para satisfazer a herança de Entity
              favoriteProducts={favoriteProducts}
              loading={loading}
            />
          )}

          {activeTabId === 'cart' && (
            <CartTab
              id="user-cart-main"
              cartDetails={cartDetails}
              total={total}
              checkoutStep={checkoutStepInstance}
              address={addressInstance}
              addToCart={addToCart}
              handlePlaceOrder={handlePlaceOrder}
            />
          )}

          {activeTabId === 'orders' && (
            <OrdersTab
              id="tab-orders-user"
              myOrders={myOrders}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;