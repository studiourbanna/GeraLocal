import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }
    if (!validatePassword(password)) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (!login(email, password)) {
      setError('Credenciais inválidas');
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-primary-light dark:bg-primary-dark text-white p-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;