import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth(); 
  const { config, updateConfig } = useTheme();
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    if (!config) return;
    const newTheme = config.theme === 'light' ? 'dark' : 'light';
    updateConfig({ theme: newTheme });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors sticky top-0 z-50 shadow-md">
      {/* Logo e Nome da Loja */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined text-blue-600 text-3xl">storefront</span>
        <h1 className="text-xl font-black tracking-tighter uppercase">
          {config?.name || 'Carregando...'}
        </h1>
      </Link>

      <div className="flex items-center gap-3">
        {/* Toggle de Tema com Material Icons */}
        <button
          onClick={handleThemeToggle}
          title={`Mudar para tema ${config?.theme === 'light' ? 'escuro' : 'claro'}`}
          className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all group"
          disabled={!config}
        >
          <span className="material-symbols-outlined text-xl transition-colors group-hover:text-blue-500">
            {config?.theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {user ? (
          <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-700 ml-2 pl-4">
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Olá,</p>
              <p className="text-sm font-bold leading-none">{user.name.split(' ')[0]}</p>
            </div>

            {/* Acesso Dinâmico baseado no Role com Ícones */}
            {user.role === 'admin' ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all uppercase"
              >
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                <span className="hidden sm:inline">Admin</span>
              </Link>
            ) : (
              <Link
                to="/client-dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-all uppercase"
              >
                <span className="material-symbols-outlined text-sm">person</span>
                <span className="hidden sm:inline">Meu Painel</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="p-2 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Sair"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;