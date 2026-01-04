import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsTab: React.FC = () => {
  const { config, updateConfig } = useTheme();

  return (
    <div>
      <h3 className="text-xl mb-4">Configurações da Loja</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Nome da Loja</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Tema</label>
          <select
            value={config.theme}
            onChange={(e) => updateConfig({ theme: e.target.value as 'light' | 'dark' })}
            className="p-2 border rounded"
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Acessibilidade</label>
          <select
            value={config.accessibility}
            onChange={(e) => updateConfig({ accessibility: e.target.value as 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' })}
            className="p-2 border rounded"
          >
            <option value="normal">Normal</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;