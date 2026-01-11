import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const Footer: React.FC = () => {
  const { config } = useTheme();

  return (
    <footer className="bg-gray-200 dark:bg-gray-800 p-4 text-center">
      <p>&copy; 2026 
          {config?.name || 'Carregando...'}
        . Todos os direitos reservados. Feito com <a href="https://github.com/studiourbanna/GeraLocal">GeraLocal</a>.</p>
    </footer>
  );
};

export default Footer;