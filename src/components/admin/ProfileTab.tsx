import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { api } from '@/services/api';
import { ProfileTabProps } from '@/models/User';

const ProfileTab: React.FC<ProfileTabProps> = ({ id }) => {
  // ✅ Importamos updateUserLocally em vez de login
  const { user, updateUserLocally } = useAuth();
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
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        theme: (config.theme as 'light' | 'dark') || 'light',
        accessibility: (config.accessibility as any) || 'normal'
      });
    }
  }, [user, config]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const userUpdateData: Record<string, string> = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password.trim() !== '') {
        userUpdateData.password = formData.password;
      }

      // 1. Atualiza no Backend (Patch para atualizar apenas campos enviados)
      const response = await api.patch(`users/${user.id}`, userUpdateData);
      
      // No json-server, o patch retorna o objeto atualizado. 
      // Garantimos que pegamos os dados corretos da resposta.
      const updatedUser = response.data || response;

      // 2. Atualiza as Preferências de Tema no Contexto de Tema
      if (config) {
        await updateConfig({
          ...config,
          theme: formData.theme,
          accessibility: formData.accessibility
        });
      }

      // 3. ✅ ATUALIZAÇÃO LOCAL: Sincroniza o AuthContext e o ViewModel
      // Isso fará com que o Header e outros componentes reflitam a mudança na hora
      updateUserLocally(updatedUser);

      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
      alert('Perfil e preferências atualizados com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert('Erro ao salvar alterações. Verifique sua conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  // Mantemos o JSX idêntico, garantindo apenas os fallbacks visuais
  return (
    <div id={id} className="max-w-2xl mx-auto py-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">

        <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-500 relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-indigo-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl font-black text-indigo-600 uppercase">
                {user?.name?.charAt(0) ?? '?'}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Nome Completo</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">E-mail</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            <div className={`space-y-2 transition-all ${isEditing ? 'opacity-100' : 'opacity-50'}`}>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Alterar Senha (opcional)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={!isEditing}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isEditing ? "Deixe em branco para manter a atual" : "••••••••"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">palette</span> Tema
                </label>
                <select
                  disabled={!isEditing}
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value as 'light' | 'dark' })}
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="normal">Visão Padrão</option>
                  <option value="protanopia">Protanopia</option>
                  <option value="deuteranopia">Deuteranopia</option>
                  <option value="tritanopia">Tritanopia</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex justify-center gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none uppercase text-xs tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">edit</span> Editar Perfil
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">{isSaving ? 'sync' : 'save'}</span>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Resetamos o form para os valores originais do usuário
                      if (user && config) {
                        setFormData({
                          name: user.name ?? '',
                          email: user.email ?? '',
                          password: '',
                          theme: (config.theme as 'light' | 'dark') || 'light',
                          accessibility: (config.accessibility as any) || 'normal'
                        });
                      }
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