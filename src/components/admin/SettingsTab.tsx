import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../services/api';

const SettingsTab: React.FC = () => {
  const { config, updateConfig } = useTheme();

  const [categories, setCategories] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cep, setCep] = useState('');

  const [localConfig, setLocalConfig] = useState({
    name: '',
    categoryId: '',
    address: {
      street: '',
      number: '',
      city: ''
    }
  });

  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      setLocalConfig(prev => ({
        ...prev,
        address: {
          ...prev.address,
          street: data.logradouro,
          city: `${data.localidade} - ${data.uf}`
        }
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  useEffect(() => {
    api.get('storeCategory').then(setCategories).catch(console.error);

    if (config) {
      setLocalConfig({
        name: config.name || '',
        categoryId: config.categoryId || '',
        address: {
          street: config.address?.street || '',
          number: config.address?.number || '',
          city: config.address?.city || ''
        }
      });
    }
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const selectedCat = categories.find(c => c.id === localConfig.categoryId);

      const dataToSave = {
        ...config,
        ...localConfig,
        storeIcon: selectedCat?.storeIcon || 'storefront'
      };

      await updateConfig(dataToSave);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar no db.json:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* SEÇÃO: IDENTIDADE DA LOJA */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
        <h4 className="text-lg font-black mb-6 flex items-center gap-2 border-b pb-4 dark:border-gray-700 uppercase tracking-tighter">
          <span className="material-symbols-outlined text-blue-500">store</span>
          Identidade da Empresa
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome da Loja</label>
            <input
              type="text"
              value={localConfig.name}
              onChange={(e) => setLocalConfig({ ...localConfig, name: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Segmento de Mercado</label>
            <select
              value={localConfig.categoryId}
              onChange={(e) => setLocalConfig({ ...localConfig, categoryId: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none cursor-pointer"
            >
              <option value="">Selecione uma categoria...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* SEÇÃO: LOCALIZAÇÃO */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700">
        <h4 className="text-lg font-black mb-6 flex items-center gap-2 border-b pb-4 dark:border-gray-700 uppercase tracking-tighter">
          <span className="material-symbols-outlined text-green-600">location_on</span>
          Endereço da Sede
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">CEP</label>
            <div className="relative">
              <input
                type="text"
                value={cep}
                maxLength={9}
                onChange={(e) => setCep(e.target.value)}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                className="w-full p-3 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <span className="material-symbols-outlined absolute left-3 top-3.5 text-gray-400 text-sm">search</span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rua / Logradouro</label>
            <input
              type="text"
              value={localConfig.address.street}
              onChange={(e) => setLocalConfig({ ...localConfig, address: { ...localConfig.address, street: e.target.value } })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white"
            />
          </div>

          <div className="md:col-span-1 space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número</label>
            <input
              type="text"
              value={localConfig.address.number}
              onChange={(e) => setLocalConfig({ ...localConfig, address: { ...localConfig.address, number: e.target.value } })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white"
            />
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cidade / Estado</label>
            <input
              type="text"
              value={localConfig.address.city}
              onChange={(e) => setLocalConfig({ ...localConfig, address: { ...localConfig.address, city: e.target.value } })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* BOTÃO SALVAR */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-black flex items-center gap-2 transition-all disabled:bg-gray-400 shadow-lg shadow-blue-100 dark:shadow-none uppercase text-sm tracking-widest"
        >
          <span className="material-symbols-outlined">{isSaving ? 'sync' : 'cloud_done'}</span>
          {isSaving ? 'Sincronizando...' : 'Salvar Alterações'}
        </button>
        {showSuccess && (
          <span className="text-green-600 font-bold animate-bounce flex items-center gap-1">
            <span className="material-symbols-outlined">verified</span> Sincronizado com API!
          </span>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;