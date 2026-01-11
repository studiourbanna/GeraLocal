import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validators';
import { useNavigate } from 'react-router-dom';

const PasswordlessLogin: React.FC = () => {
  const { login, viewModel } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    const success = await login(email, 'passwordless-token'); 
    
    if (!success) {
      setError('Não foi possível autenticar este e-mail.');
    } else {
      const loggedUser = viewModel.currentUser;

      if (loggedUser) {
        const welcomeMessage = `Bem-vindo de volta, ${loggedUser.name}!`;
        
        const targetPath = loggedUser.role === 'admin' ? '/dashboard' : '/client-dashboard';
        
        setMessage('Login realizado com sucesso! Redirecionando...');
        
        setTimeout(() => {
          navigate(targetPath, { state: { successMessage: welcomeMessage } });
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Acesso por E-mail</h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 text-sm">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
            Digite seu e-mail para receber um acesso direto à sua conta.
          </p>

          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-bold
                       bg-indigo-600 hover:bg-indigo-700 
                       dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-600 
                       transition-all shadow-md active:scale-95"
          >
            Acessar agora
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors"
          >
            Voltar para login com senha
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordlessLogin;