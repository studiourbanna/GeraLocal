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
      const initialConfig = await viewModel.getConfig();
      setConfig(initialConfig);
      document.documentElement.className = initialConfig.theme;
    })();
  }, [viewModel]);

  const updateConfig = async (updates: Partial<StoreConfig>) => {
    const updatedConfig = await viewModel.updateConfig(updates);
    setConfig(updatedConfig);
    document.documentElement.className = updatedConfig.theme;
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
