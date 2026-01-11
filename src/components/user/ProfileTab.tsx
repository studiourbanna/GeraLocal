import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ProfileTab: React.FC = () => {
  const { user, viewModel } = useAuth(); 

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        password: user.password || ''
      });
    }
  }, [user, isEditing]);

  const handleToggleEdit = () => {
    setShowSuccess(false);
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const success = await viewModel.updateUser(user.id, formData);
      
      if (success) {
        setShowSuccess(true);
        setIsEditing(false);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Falha ao atualizar dados.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Minha Conta</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gerencie suas informações pessoais</p>
        </div>
        
        {!isEditing && (
          <button 
            onClick={handleToggleEdit}
            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Editar
          </button>
        )}
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl flex items-center gap-3 text-green-700 dark:text-green-400 animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined">verified</span>
          <p className="text-xs font-bold uppercase tracking-tight">Perfil atualizado com sucesso!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <input 
              type="text" 
              disabled={!isEditing}
              className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all font-medium"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail (Login)</label>
            <input 
              type="email" 
              disabled
              className="w-full p-4 rounded-2xl border bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 text-gray-400 cursor-not-allowed outline-none font-medium"
              value={user?.email || ''}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4 pt-4 animate-in fade-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={handleToggleEdit}
              className="flex-1 p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Confirmar Mudanças'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileTab;