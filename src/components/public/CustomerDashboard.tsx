import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../models/Product';
import { Order } from '../../models/Order';
import { api } from '../../services/api';
import ProductCard from '../public/ProductCard';

export const CustomerDashboard: React.FC = () => {
  const { user, addToCart, viewModel } = useAuth();

  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment'>('cart');

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [productsData, ordersData] = await Promise.all([
          api.get('products'),
          viewModel.getUserOrders()
        ]);

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

  if (!user) return <div className="p-20 text-center dark:text-white font-bold">⚠️ Faça login.</div>;

  const handlePlaceOrder = async () => {
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
      alert("🎉 Pedido realizado com sucesso!");
      setCheckoutStep('cart');
      setAddress({ street: '', city: '', zip: '' });
      const updatedOrders = await viewModel.getUserOrders();
      setMyOrders(updatedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
      alert("❌ Erro ao processar pedido.");
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

      {/* Coluna 1: Dados e Histórico */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-fit">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined">person</span> Meus Dados
        </h2>
        <div className="space-y-2 dark:text-gray-300 mb-6">
          <p><span className="font-bold text-blue-600">Nome:</span> {user.name}</p>
          <p><span className="font-bold text-blue-600">Email:</span> {user.email}</p>
        </div>
        
        <button className="w-full py-2 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
          <span className="material-symbols-outlined text-sm">edit</span> Editar Perfil
        </button>

        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">receipt_long</span> Meus Pedidos
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {myOrders.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Nenhum pedido realizado.</p>
            ) : (
              myOrders.map(order => (
                <div key={order.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono font-bold dark:text-gray-200">#{order.id.slice(-6)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 uppercase font-bold">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-1">{order.date}</p>
                  <p className="text-sm font-bold text-green-600">R$ {order.total.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Coluna 2: Favoritos */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-y-auto max-h-[85vh]">
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500">favorite</span> Favoritos
        </h2>
        {loading ? <div className="animate-pulse space-y-4"><div className="h-40 bg-gray-200 rounded-lg"></div></div> : (
          <div className="flex flex-col gap-4">
            {favoriteProducts.length === 0 ? <p className="text-gray-500 italic text-center py-10">Sua lista de desejos está vazia.</p> :
              favoriteProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Coluna 3: Carrinho Progressivo */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-2 border-blue-500 h-fit">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-blue-600">
            {checkoutStep === 'cart' ? 'shopping_cart' : checkoutStep === 'address' ? 'local_shipping' : 'payments'}
          </span>
          <h2 className="text-xl font-bold dark:text-white uppercase tracking-tight">
            {checkoutStep === 'cart' ? 'Carrinho' : checkoutStep === 'address' ? 'Entrega' : 'Pagamento'}
          </h2>
        </div>

        {/* STEP 1: CART */}
        {checkoutStep === 'cart' && (
          <>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {cartDetails.length === 0 ? (
                <p className="text-center text-gray-400 py-10 italic">Carrinho vazio</p>
              ) : (
                cartDetails.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold dark:text-white">{item.product.name}</span>
                      <span className="text-xs text-blue-600 font-medium">R$ {item.product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => addToCart(item.product.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-red-100 transition-colors">-</button>
                      <span className="text-sm font-bold dark:text-white">{item.quantity}</span>
                      <button onClick={() => addToCart(item.product.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-green-100 transition-colors">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between items-center mb-6 pt-4 border-t dark:border-gray-700">
              <span className="dark:text-white font-medium">Subtotal</span>
              <span className="text-xl font-black text-green-600">R$ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setCheckoutStep('address')}
              disabled={cartDetails.length === 0}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              Próximo Passo <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </>
        )}

        {/* STEP 2: ADDRESS */}
        {checkoutStep === 'address' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Endereço Completo</label>
              <input
                type="text" placeholder="Rua, número e bairro"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text" placeholder="Cidade"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
              />
              <input
                type="text" placeholder="CEP"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setCheckoutStep('cart')} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg font-bold">Voltar</button>
              <button onClick={() => setCheckoutStep('payment')} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold">Pagamento</button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT */}
        {checkoutStep === 'payment' && (
          <div className="space-y-4">
            <p className="text-sm font-medium dark:text-gray-300 mb-2">Selecione o método:</p>
            <button className="w-full p-4 border-2 border-blue-100 dark:border-gray-700 rounded-xl flex items-center gap-4 dark:text-white hover:border-blue-500 transition-all">
              <span className="material-symbols-outlined text-blue-500">pix</span>
              <div className="text-left"><p className="font-bold">PIX</p><p className="text-[10px] text-gray-500">Desconto de 5%</p></div>
            </button>
            <button className="w-full p-4 border-2 border-blue-100 dark:border-gray-700 rounded-xl flex items-center gap-4 dark:text-white hover:border-blue-500 transition-all">
              <span className="material-symbols-outlined text-blue-500">credit_card</span>
              <div className="text-left"><p className="font-bold">Cartão</p><p className="text-[10px] text-gray-500">Até 12x sem juros</p></div>
            </button>
            
            <div className="flex gap-3 pt-6">
              <button onClick={() => setCheckoutStep('address')} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg font-bold">Voltar</button>
              <button onClick={handlePlaceOrder} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none">Finalizar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerDashboard;