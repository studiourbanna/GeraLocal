import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { config, updateConfig } = useTheme();

  const toggleTheme = () => {
    if (!config) return; // evita erro se ainda não carregou
    updateConfig({ theme: config.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label="Alternar tema"
      disabled={!config} // desabilita enquanto não há config
    >
      {config?.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
