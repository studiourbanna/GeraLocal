import React, { useState } from 'react';
import { Product, ProductsTabProps } from '../../models/Product';
import { validateProduct } from '../../utils/validators';

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  categories = [],
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const initialForm = {
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
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter dark:text-white">
          <span className="material-symbols-outlined text-blue-600">
            {editingId ? 'edit_square' : 'add_box'}
          </span>
          {editingId ? 'Editar Produto' : 'Novo Produto'}
        </h3>

        {/* EXIBIÇÃO DE ERROS (Onde o valor de 'errors' passa a ser lido) */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-2">
              <span className="material-symbols-outlined">error</span>
              Verifique os campos abaixo:
            </div>
            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nome do Produto</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Categoria</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 dark:text-white cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Selecione uma Categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Preço (R$)</label>
            <input
              type="number"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              required step="0.01"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Qtd. em Estoque</label>
            <input
              type="number"
              value={form.stock || ''}
              onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">URL da Imagem</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Descrição do Produto</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-xl border dark:bg-gray-900 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div className="col-span-full flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-black transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              {editingId ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRODUTO'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(initialForm); setErrors([]); }}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-10 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                CANCELAR
              </button>
            )}
          </div>
        </form>
      </section>

      {/* LISTAGEM */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600">inventory_2</span>
            Estoque Atual
          </h3>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
            {products.length} Itens
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
              <tr>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Detalhes do Produto</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase text-right">Preço</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase text-right">Estoque</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      )}
                      <div>
                        <div className="font-bold dark:text-white">{p.name}</div>
                        <div className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">
                          {getCategoryName(p.categoryId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-green-600 font-black">
                    R$ {p.price.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`text-sm font-bold ${p.stock < 5 ? 'text-red-500' : 'dark:text-gray-300'}`}>
                      {p.stock} un
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        onClick={() => { if (confirm('Excluir este produto?')) onDelete(p.id) }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined">delete</span>
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