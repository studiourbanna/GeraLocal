import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig } from '../models/StoreConfig';
import { StoreViewModel } from '../viewmodels/StoreViewModel';

interface ThemeContextType {
  config: StoreConfig | null;
  updateConfig: (updates: Partial<StoreConfig>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModel] = useState(() => new StoreViewModel());
  const [config, setConfig] = useState<StoreConfig | null>(null);

  // Carrega configuração inicial da loja
  useEffect(() => {
    (async () => {
      try {
        const initialConfig = await viewModel.getConfig();
        setConfig(initialConfig);

        if (initialConfig?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (err) {
        console.error('Erro ao carregar configuração inicial', err);
      }
    })();
  }, [viewModel]);

  const updateConfig = async (updates: Partial<StoreConfig>) => {
    try {
      const updatedConfig = await viewModel.updateConfig(updates);
      const safeConfig = { ...updatedConfig, theme: updatedConfig?.theme ?? 'light' };
      setConfig(safeConfig);

      if (safeConfig.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      console.error('Erro ao atualizar configuração', err);

      // fallback local: mesmo se a API falhar, atualiza o tema em memória
      const fallbackTheme = updates.theme ?? 'light';
      setConfig(prev => ({ ...(prev ?? {} as StoreConfig), ...updates, theme: fallbackTheme }));

      if (fallbackTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };


  return (
    <ThemeContext.Provider value={{ config, updateConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
