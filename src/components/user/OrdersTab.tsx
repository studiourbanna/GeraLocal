import React, { useState } from 'react';
import { OrdersTabProps, Order, OrderItem } from '@/models/Order';

const OrdersTab: React.FC<OrdersTabProps> = ({ myOrders }) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Função auxiliar para pegar o status atual (o último do array)
  const getCurrentStatus = (order: Order) => {
    return order.status[order.status.length - 1]?.status || 'pending';
  };

  const handlePayment = async (order: Order) => {
    setIsProcessing(order.id);
    try {
      setTimeout(() => {
        alert("Redirecionando para o Mercado Pago...");
        setIsProcessing(null);
      }, 1500);
    } catch (error) {
      console.error(error);
      setIsProcessing(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Meus Pedidos</h2>
        <p className="text-sm text-gray-500 font-medium">Acompanhe o status e pagamentos de suas compras.</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
          <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">history_edu</span>
          <p className="text-gray-400 font-bold italic">Você ainda não realizou nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => {
            const currentStatus = getCurrentStatus(order);
            
            return (
              <div 
                key={order.id} 
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined">package_2</span>
                    </div>
                    <div>
                      <h3 className="font-black dark:text-white text-lg uppercase">
                        #{order.id.slice(-6)}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.date}</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    currentStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    currentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {currentStatus === 'pending' ? 'Aguardando Pagamento' : 
                     currentStatus === 'paid' ? 'Pago' : currentStatus}
                  </span>
                </div>

                {/* Itens Tipados */}
                <div className="space-y-2 mb-6">
                  {order.items.map((item: OrderItem) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong className="text-blue-600">{item.quantity}x</strong> {item.name}
                      </span>
                      <span className="font-bold dark:text-gray-200">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-6 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {currentStatus === 'pending' && (
                      <button 
                        onClick={() => handlePayment(order)}
                        disabled={isProcessing === order.id}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">payments</span>
                        {isProcessing === order.id ? 'Processando...' : 'Pagar Agora'}
                      </button>
                    )}
                    <button className="flex-1 sm:flex-none px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs uppercase tracking-widest">
                      Detalhes
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;