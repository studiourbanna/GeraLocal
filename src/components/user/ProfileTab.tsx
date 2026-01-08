import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../services/api';

const ProfileTab: React.FC = () => {
  const { user, login } = useAuth();
  const { config, updateConfig } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    theme: 'light' as 'light' | 'dark',
    accessibility: 'normal' as 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  });

  useEffect(() => {
    if (user && config) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        theme: (config.theme as any) || 'light',
        accessibility: (config.accessibility as any) || 'normal'
      });
    }
  }, [user, config]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const userUpdateData: any = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password.trim() !== '') {
        userUpdateData.password = formData.password;
      }

      const response = await api.patch(`users/${user.id}`, userUpdateData);
      const updatedUser = response.data;

      await updateConfig({
        ...config,
        theme: formData.theme,
        accessibility: formData.accessibility
      });

      const currentPassword = formData.password.trim() !== '' ? formData.password : user.password;

      login(updatedUser, currentPassword);
      
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
      alert('Perfil e preferências atualizados com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert('Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">

        {/* Header Visual */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-500 relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-indigo-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl font-black text-indigo-600 uppercase">
                {user?.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <form onSubmit={handleUpdateProfile} className="space-y-6">

            {/* DADOS PESSOAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome Completo</label>
                <input
                  type="text" disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">E-mail</label>
                <input
                  type="email" disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {/* SENHA */}
            <div className={`space-y-2 transition-all ${isEditing ? 'opacity-100' : 'opacity-50'}`}>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alterar Senha (opcional)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={!isEditing}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Deixe em branco para manter a atual"
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-indigo-500"
                >
                  <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <hr className="dark:border-gray-700" />

            {/* PREFERÊNCIAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">dark_mode</span> Tema
                </label>
                <select
                  disabled={!isEditing}
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <option value="light">Modo Claro</option>
                  <option value="dark">Modo Escuro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">visibility</span> Acessibilidade
                </label>
                <select
                  disabled={!isEditing}
                  value={formData.accessibility}
                  onChange={(e) => setFormData({ ...formData, accessibility: e.target.value as any })}
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <option value="normal">Visão Padrão</option>
                  <option value="protanopia">Protanopia</option>
                  <option value="deuteranopia">Deuteranopia</option>
                  <option value="tritanopia">Tritanopia</option>
                </select>
              </div>
            </div>

            {/* BOTÕES */}
            <div className="pt-6 flex justify-center gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none uppercase text-xs tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">edit</span> Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 dark:shadow-none"
                  >
                    <span className="material-symbols-outlined">{isSaving ? 'sync' : 'done_all'}</span>
                    {isSaving ? 'Salvando...' : 'Confirmar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user!.name,
                        email: user!.email,
                        password: '',
                        theme: (config?.theme as any) || 'light',
                        accessibility: (config?.accessibility as any) || 'normal'
                      });
                    }}
                    className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;