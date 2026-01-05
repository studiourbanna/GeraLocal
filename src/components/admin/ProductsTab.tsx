import React, { useState } from 'react';
import { Product } from '../../models/Product';
import { validateProduct } from '../../utils/validators';

interface ProductsTabProps {
  products: Product[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (id: string, product: Omit<Product, 'id'>) => void;
  onDelete: (id: string) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  
  const initialForm = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    category: ''
  };

  const [form, setForm] = useState<Omit<Product, 'id'>>(initialForm);

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
      category: product.category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Formulário de Cadastro/Edição */}
      <section className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          {editingId ? '✏️ Editar Produto' : '➕ Novo Produto'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text" placeholder="Nome do Produto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded dark:bg-gray-800" required
          />
          <input
            type="text" placeholder="Categoria"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-2 border rounded dark:bg-gray-800"
          />
          <input
            type="number" placeholder="Preço"
            value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
            className="p-2 border rounded dark:bg-gray-800" required step="0.01"
          />
          <input
            type="number" placeholder="Estoque"
            value={form.stock || ''}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
            className="p-2 border rounded dark:bg-gray-800" required
          />
          <input
            type="text" placeholder="URL da Imagem"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="p-2 border rounded dark:bg-gray-800 md:col-span-2"
          />
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded dark:bg-gray-800 md:col-span-2" rows={2}
          />

          {errors.length > 0 && (
            <div className="col-span-full text-red-500 text-sm">
              {errors.map((err, i) => <p key={i}>• {err}</p>)}
            </div>
          )}

          <div className="col-span-full flex gap-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold transition-all">
              {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setForm(initialForm); }}
                className="bg-gray-500 text-white px-6 py-2 rounded"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tabela de Listagem */}
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
              {products.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-500">Nenhum produto em estoque.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="p-3 font-medium">{p.name} <span className="text-xs text-gray-400 block">{p.category}</span></td>
                    <td className="p-3 text-right text-green-600 font-semibold">R$ {p.price.toFixed(2)}</td>
                    <td className="p-3 text-right">{p.stock} un</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:underline">Editar</button>
                      <button onClick={() => onDelete(p.id)} className="text-red-500 hover:underline">Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProductsTab;