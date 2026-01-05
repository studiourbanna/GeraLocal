import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail } from '../../utils/validators';
import { useNavigate } from 'react-router-dom';

const PasswordlessLogin: React.FC = () => {
  const { login, getCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    // Simulação de login sem senha
    const success = await login(email, ''); // pode ser adaptado conforme sua lógica
    if (!success) {
      setError('Não foi possível autenticar');
    } else {
      setError('');
      setMessage('Login realizado com sucesso!');

      const user = getCurrentUser();
      if (user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4">Login sem Senha</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded 
                     bg-white text-black 
                     dark:bg-gray-700 dark:text-white 
                     dark:placeholder-gray-400"
          required
        />
        <button
          type="submit"
          className="w-full p-2 rounded text-white 
                     bg-blue-500 hover:bg-blue-600 
                     dark:bg-yellow-500 dark:hover:bg-yellow-600 
                     transition-colors"
        >
          Enviar Link
        </button>
      </form>
    </div>
  );
};

export default PasswordlessLogin;
