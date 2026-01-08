import React, { useState } from 'react';
import { Product } from '../../models/Product';
import { validateProduct } from '../../utils/validators';
import { Category } from '../../models/Category'; // Ajuste o caminho conforme seu projeto

interface ProductsTabProps {
  products: Product[];
  categories?: Category[]; 
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (id: string, product: Omit<Product, 'id'>) => void;
  onDelete: (id: string) => void;
}

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
    <div className="space-y-8">
      <section className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">{editingId ? 'edit' : 'add'}</span>
          {editingId ? 'Editar Produto' : 'Novo Produto'}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text" placeholder="Nome do Produto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white" required
          />
          
          {/* O Select agora vai funcionar porque 'categories' foi desestruturado lá em cima */}
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white cursor-pointer"
            required
          >
            <option value="" disabled>Selecione uma Categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number" placeholder="Preço"
            value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white" required step="0.01"
          />
          <input
            type="number" placeholder="Estoque"
            value={form.stock || ''}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white" required
          />
          <input
            type="text" placeholder="URL da Imagem"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white md:col-span-2"
          />
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded dark:bg-gray-800 dark:text-white md:col-span-2" rows={2}
          />

          <div className="col-span-full flex gap-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all">
              {editingId ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setForm(initialForm); }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tabela */}
      <section>
        <h3 className="text-xl font-semibold mb-4">📋 Estoque Atual</h3>
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3 text-right">Preço</th>
                <th className="p-3 text-right">Estoque</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="p-3">
                    <div className="font-bold dark:text-white">{p.name}</div>
                    <div className="text-xs text-blue-500 font-medium uppercase">
                      {getCategoryName(p.categoryId)}
                    </div>
                  </td>
                  <td className="p-3 text-right text-green-600 font-semibold">R$ {p.price.toFixed(2)}</td>
                  <td className="p-3 text-right dark:text-gray-300">{p.stock} un</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button onClick={() => handleEditClick(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                       <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button onClick={() => onDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all">
                       <span className="material-symbols-outlined">delete</span>
                    </button>
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