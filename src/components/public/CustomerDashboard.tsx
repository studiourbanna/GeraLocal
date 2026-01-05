import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
// Importar componentes de lista de favoritos e carrinho

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <p>Por favor, faça login.</p>;

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-50 dark:bg-gray-900">
      {/* Coluna 1: Dados Pessoais */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 dark:text-white">👤 Meus Dados</h2>
        <p className="dark:text-gray-300"><strong>Nome:</strong> {user.name}</p>
        <p className="dark:text-gray-300"><strong>Email:</strong> {user.email}</p>
        <button className="mt-4 text-blue-600 hover:underline">Editar Endereço</button>
      </section>

      {/* Coluna 2: Favoritos */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 dark:text-white">❤️ Favoritos</h2>
        {/* Aqui você mapeia os produtos cujos IDs estão em user.favorites */}
      </section>

      {/* Coluna 3: Carrinho e Checkout */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-2 border-blue-500">
        <h2 className="text-xl font-bold mb-4 dark:text-white">🛒 Meu Carrinho</h2>
        {/* Lista de itens no carrinho com botão de "Finalizar Pedido" */}
        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-4 hover:bg-green-700 transition-colors">
          Fechar Pedido
        </button>
      </section>
    </div>
  );
};

export default CustomerDashboard;