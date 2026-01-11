import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validatePassword } from '@/utils/validators';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { login, viewModel } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Email inválido');
            return;
        }
        if (!validatePassword(password)) {
            setError('Senha deve ter pelo menos 6 caracteres');
            return;
        }

        const success = await login(email, password);

        if (!success) {
            setError('Credenciais inválidas');
        } else {
            setError('');

            const loggedUser = viewModel.currentUser;

            if (loggedUser) {
                const welcomeMessage = `Bem-vindo, ${loggedUser.name}!`;

                // Redirecionamento baseado no cargo (role)
                if (loggedUser.role === 'admin') {
                    navigate('/dashboard', { state: { message: welcomeMessage } });
                } else {
                    navigate('/client-dashboard', { state: { message: welcomeMessage } });
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mx-4"
            >
                <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">Login</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-1">E-mail</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-1">Senha</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg text-white font-bold
                       bg-blue-600 hover:bg-blue-700 
                       dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-600 
                       transition-all transform active:scale-95 shadow-md"
                    >
                        Entrar na conta
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Ainda não tem conta? <span className="text-blue-500 cursor-pointer hover:underline">Cadastre-se</span>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;