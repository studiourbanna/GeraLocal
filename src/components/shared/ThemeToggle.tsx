import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { config, updateConfig } = useTheme();

  const toggleTheme = async () => {
    if (!config) return; 
    const newTheme = config.theme === 'light' ? 'dark' : 'light';
    await updateConfig({ theme: newTheme });
  };

  if (!config) {
    return (
      <button
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
        aria-label="Alternar tema"
        disabled
      >
        <Moon size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label="Alternar tema"
    >
      {config.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
