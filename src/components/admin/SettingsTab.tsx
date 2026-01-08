import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface LocalConfigState {
  name: string;
  theme: 'light' | 'dark';
  accessibility: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

const SettingsTab: React.FC = () => {
  const { config, updateConfig } = useTheme();

  const [localConfig, setLocalConfig] = useState<LocalConfigState>({
    name: '',
    theme: 'light',
    accessibility: 'normal'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (config) {
    const root = window.document.documentElement;
    
    if (config.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (config.accessibility && config.accessibility !== 'normal') {
      root.classList.add(config.accessibility);
    }
  }
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Salva no banco de dados (db.json) via ViewModel
      await updateConfig(localConfig);

      // 2. Aplicação visual imediata da acessibilidade
      const root = window.document.documentElement; // Pega a tag <html>

      // Remove todas as possíveis classes de daltonismo antes de aplicar a nova
      root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');

      // Se a configuração não for 'normal', aplica a classe correspondente
      if (localConfig.accessibility !== 'normal') {
        root.classList.add(localConfig.accessibility);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!config) return <p className="p-6 dark:text-white">Carregando configurações do servidor...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-black dark:text-white">
      <h3 className="text-xl font-bold mb-6">⚙️ Configurações da Loja (Database)</h3>
      <div className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Nome da Loja</label>
          <input
            type="text"
            value={localConfig.name}
            onChange={(e) => setLocalConfig({ ...localConfig, name: e.target.value })}
            className="p-2 border rounded w-full bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Tema</label>
            <select
              value={localConfig.theme}
              onChange={(e) => setLocalConfig({
                ...localConfig,
                theme: e.target.value as 'light' | 'dark'
              })}
              className="p-2 border rounded w-full bg-white text-black dark:bg-gray-700 dark:text-white"
            >
              <option value="light">Claro 🌞</option>
              <option value="dark">Escuro 🌙</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Acessibilidade</label>
            <select
              value={localConfig.accessibility}
              onChange={(e) => setLocalConfig({
                ...localConfig,
                accessibility: e.target.value as any
              })}
              className="p-2 border rounded w-full bg-white text-black dark:bg-gray-700 dark:text-white"
            >
              <option value="normal">Normal</option>
              <option value="protanopia">Protanopia</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="tritanopia">Tritanopia</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold disabled:bg-gray-400 transition-colors"
          >
            {isSaving ? 'Salvando no DB...' : '💾 Salvar no Database'}
          </button>
          {showSuccess && <span className="text-green-600 font-medium">✅ Sincronizado com db.json!</span>}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;