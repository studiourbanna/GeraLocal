import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { config } = useTheme();
  const { viewModel, logout } = useAuth();

  return (
    <header className="bg-primary-light dark:bg-primary-dark text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{config.name}</h1>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {viewModel.isLoggedIn && (
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;