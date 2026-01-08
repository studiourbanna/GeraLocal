import React, { useState } from 'react';
import { OrdersTabProps, Order } from '../../models/Order';
import { api } from '../../services/api';


const OrdersTab: React.FC<OrdersTabProps> = ({ myOrders }) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handlePayment = async (order: Order) => {
    setIsProcessing(order.id);
    try {
      console.log(`Iniciando pagamento do pedido ${order.id} via Mercado Pago...`);
      
      setTimeout(() => {
        alert("Redirecionando para o Checkout Seguro do Mercado Pago...");
        // window.location.href = init_point; 
        setIsProcessing(null);
      }, 1500);

    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
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
          {myOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header do Card */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined">package_2</span>
                  </div>
                  <div>
                    <h3 className="font-black dark:text-white text-lg">#{order.id.slice(-6).toUpperCase()}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.date}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status === 'pending' ? 'Aguardando Pagamento' : 
                     order.status === 'paid' ? 'Pago / Em Preparação' : order.status}
                  </span>
                </div>
              </div>

              {/* Itens do Pedido (Resumo) */}
              <div className="space-y-2 mb-6">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <strong className="text-blue-600">{item.quantity}x</strong> {item.name}
                    </span>
                    <span className="font-bold dark:text-gray-200">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Footer do Card */}
              <div className="pt-6 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Total do Pedido</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                    R$ {order.total.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => handlePayment(order)}
                      disabled={isProcessing === order.id}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">payments</span>
                      {isProcessing === order.id ? 'Processando...' : 'Pagar Agora'}
                    </button>
                  )}
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selo Mercado Pago */}
      <div className="mt-10 flex flex-col items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pagamentos processados por</p>
        <img 
          src="https://logospng.org/download/mercado-pago/logo-mercado-pago-2048.png" 
          alt="Mercado Pago" 
          className="h-6 object-contain"
        />
      </div>
    </div>
  );
};

export default OrdersTab;