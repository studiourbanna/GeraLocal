import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Product } from '../../models/Product';
import { validateProduct } from '../../utils/validators';

const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    category: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProduct(form);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (editing) {
      updateProduct(editing.id, form);
      setEditing(null);
    } else {
      addProduct(form);
    }
    setForm({ name: '', description: '', price: 0, stock: 0, image: '', category: '' });
    setErrors([]);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm(product);
  };

  // Garantir que products seja sempre um array
  const safeProducts: Product[] = Array.isArray(products) ? products : [];

  return (
    <div>
      <h3 className="text-xl mb-4">Gerenciar Produtos</h3>
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Preço"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Estoque"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Imagem URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded col-span-2"
          />
        </div>
        {errors.length > 0 && (
          <ul className="text-red-500 mt-2">
            {errors.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        )}
        <button type="submit" className="mt-4 bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded">
          {editing ? 'Atualizar' : 'Adicionar'} Produto
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({ name: '', description: '', price: 0, stock: 0, image: '', category: '' }); }}
            className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </form>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2">Nome</th>
            <th className="p-2">Preço</th>
            <th className="p-2">Estoque</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {safeProducts.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-2 text-center text-gray-500">
                Nenhum produto encontrado.
              </td>
            </tr>
          ) : (
            safeProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-2">{product.name}</td>
                <td className="p-2">R$ {product.price}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                    Editar
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTab;