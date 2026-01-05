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
    if (!config) return;
    const newTheme = config.theme === 'light' ? 'dark' : 'light';
    // Isso disparará o PUT para storeConfig/1 via sua api.ts
    updateConfig({ theme: newTheme });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition-colors sticky top-0 z-50 shadow-sm">
      {/* Nome da Loja Dinâmico */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="store">🏬</span>
          <h1 className="text-xl font-bold tracking-tight">
            {config?.name || 'GeraLocal'}
          </h1>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {/* Toggle de Tema */}
        <button
          onClick={handleThemeToggle}
          title={`Mudar para tema ${config?.theme === 'light' ? 'escuro' : 'claro'}`}
          className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 hover:ring-2 hover:ring-blue-400 transition-all"
          disabled={!config}
        >
          {config?.theme === 'light' ? '🌞' : '🌙'}
        </button>

        {user ? (
          <div className="flex items-center gap-4 border-l border-gray-400 dark:border-gray-600 pl-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Olá,</p>
              <p className="text-sm font-bold leading-none">{user.name}</p>
            </div>

            {user.role === 'admin' && (
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Painel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              Sair
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-yellow-500 dark:text-black transition-all"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;