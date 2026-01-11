import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { StoreCategory } from '@/models/Store';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { config, updateConfig } = useTheme();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<StoreCategory[]>([]);

  useEffect(() => {
    api.get('storeCategory')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res;
        setCategories(data);
      })
      .catch(err => {
        console.error("Erro ao carregar categorias no Header:", err);
        setCategories([]);
      });
  }, []);

  const currentCategory = categories?.find(cat => cat.id === config?.categoryId);
  const displayIcon = currentCategory?.storeIcon || 'storefront';

  const handleThemeToggle = async () => {
    if (!config) return;
    const newTheme = config.theme === 'light' ? 'dark' : 'light';
    try {
      await updateConfig({ ...config, theme: newTheme });
    } catch (error) {
      console.error("Erro ao alternar tema:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-black dark:text-white transition-all sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-600 text-2xl">
            {displayIcon}
          </span>
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter uppercase leading-none">
            {config?.name || 'Carregando...'}
          </h1>
          <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">
            {currentCategory?.name || 'Painel de Controle'}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={handleThemeToggle}
          className="p-2 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-all"
        >
          <span className="material-symbols-outlined text-xl">
            {config?.theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {user ? (
          <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-800 ml-2 pl-4">
            <div className="hidden sm:block text-right">
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">Operador</p>
              <p className="text-xs font-bold leading-none">{user.name?.split(' ')[0]}</p>
            </div>

            <Link to="/profile" className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-sm border-2 border-transparent hover:border-indigo-500 transition-all">
              {user.name?.charAt(0).toUpperCase()}
            </Link>

            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-black hover:bg-blue-700"
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;