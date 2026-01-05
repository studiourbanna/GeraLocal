// src/components/shared/Header.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { getCurrentUser, logout } = useAuth();
  const { config, updateConfig } = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleThemeToggle = () => {
    if (!config) return; // evita erro se ainda não carregou
    const newTheme = config.theme === 'light' ? 'dark' : 'light';
    updateConfig({ theme: newTheme });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
      {/* Logo com link para a página inicial */}
      <Link to="/" className="flex items-center gap-2">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🏬 GeraLocal
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {/* Botão de alternância de tema com ícones */}
        <button
          onClick={handleThemeToggle}
          className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 flex items-center gap-2"
          disabled={!config} // desabilita enquanto não carregou
        >
          {config?.theme === 'light' ? (
            <>
              🌞 <span>Claro</span>
            </>
          ) : (
            <>
              🌙 <span>Escuro</span>
            </>
          )}
        </button>

        {user ? (
          <>
            <span>{user.name}</span>

            {/* Link visível apenas para administradores */}
            {user.role === 'admin' && (
              <Link
                to="/dashboard"
                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                Gerenciar Produtos
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-3 py-1 rounded 
                       bg-blue-500 text-white 
                       hover:bg-blue-600 
                       dark:bg-yellow-500 dark:hover:bg-yellow-600 
                       transition-colors"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
