import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig } from '../models/StoreConfig';
import { StoreViewModel } from '../viewmodels/StoreViewModel';

interface ThemeContextType {
  config: StoreConfig;
  updateConfig: (updates: Partial<StoreConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModel] = useState(() => new StoreViewModel());
  const [config, setConfig] = useState(viewModel.getConfig());

  const updateConfig = (updates: Partial<StoreConfig>) => {
    viewModel.updateConfig(updates);
    setConfig(viewModel.getConfig());
  };

  useEffect(() => {
    document.documentElement.className = config.theme;
  }, [config.theme]);

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