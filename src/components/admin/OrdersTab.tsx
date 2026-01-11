import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('orders').then(setOrders).catch(console.error);
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800">
          <p className="text-green-600 dark:text-green-400 text-sm font-bold uppercase">Total Recebido</p>
          <h4 className="text-3xl font-black text-green-700 dark:text-green-300">R$ {totalRevenue.toFixed(2)}</h4>
        </div>
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase">Pedidos Realizados</p>
          <h4 className="text-3xl font-black text-blue-700 dark:text-blue-300">{orders.length}</h4>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t dark:border-gray-700">
                <td className="p-4 font-mono text-xs">#{order.id}</td>
                <td className="p-4 font-bold">{order.userName}</td>
                <td className="p-4 text-sm text-gray-500">{order.date}</td>
                <td className="p-4 text-right font-bold text-green-600">R$ {order.total.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">Pago</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTab;