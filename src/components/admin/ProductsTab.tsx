import React, { useState } from 'react';
import { Product, ProductsTabProps } from '@/models/Product'; // Usando as interfaces refatoradas
import { validateProduct } from '@/utils/validators';

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  categories = [],
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const initialForm: Omit<Product, 'id'> = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: ''
  };

  const [form, setForm] = useState<Omit<Product, 'id'>>(initialForm);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || id;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProduct(form);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (editingId) {
      onUpdate(editingId, form);
      setEditingId(null);
    } else {
      onAdd(form);
    }

    setForm(initialForm);
    setErrors([]);
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setErrors([]);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image || '',
      categoryId: product.categoryId
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* FORMULÁRIO DE CADASTRO/EDIÇÃO */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter dark:text-white">
            <span className="material-symbols-outlined text-blue-600">
              {editingId ? 'edit_square' : 'add_circle'}
            </span>
            {editingId ? 'Ajustar Produto' : 'Novo Item no Catálogo'}
          </h3>
          {editingId && (
            <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Editando ID: {editingId.substring(0, 8)}...
            </span>
          )}
        </div>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-2xl">
            <ul className="text-sm text-red-600 dark:text-red-300 font-medium space-y-1">
              {errors.map((err, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">warning</span> {err}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-8 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome do Produto</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Hambúrguer Artesanal"
              className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Preço Venda (R$)</label>
            <input
              type="number"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              step="0.01"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Estoque Inicial</label>
            <input
              type="number"
              value={form.stock || ''}
              onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
              className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">URL da Imagem</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
              className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-12 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          <div className="md:col-span-12 flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-100 dark:shadow-none uppercase text-xs tracking-widest"
            >
              {editingId ? 'Atualizar Produto' : 'Cadastrar no Estoque'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(initialForm); setErrors([]); }}
                className="px-8 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase text-xs tracking-widest"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* TABELA DE GESTÃO */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
          <h3 className="text-lg font-black uppercase tracking-tighter dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600">inventory</span>
            Controle de Inventário
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produto</th>
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Preço</th>
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Estoque</th>
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {products.map((p) => (
                <tr key={p.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border dark:border-gray-600">
                        <img 
                          src={p.image || 'https://via.placeholder.com/150'} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                        />
                      </div>
                      <div>
                        <div className="font-bold dark:text-white group-hover:text-blue-600 transition-colors">{p.name}</div>
                        <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded-md inline-block">
                          {getCategoryName(p.categoryId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-right font-mono font-black text-green-600">
                    R$ {p.price.toFixed(2)}
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      p.stock < 10 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {p.stock} un
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => { if (confirm('Excluir este produto permanentemente?')) onDelete(p.id) }}
                        className="p-2 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-all"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProductsTab;