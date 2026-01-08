import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useLocation } from 'react-router-dom';
import { Product } from '../../models/Product';
import { api } from '../../services/api';
import { Category } from '../../models/Category';

const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const successMessage = location.state?.successMessage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.get('products'),
          api.get('categories')
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao buscar dados na API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => String(product.categoryId) === String(selectedCategory));

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-blue-600">storefront</span>
            Nossa Loja
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Explore nossa curadoria de produtos exclusivos</p>
        </header>

        {successMessage && (
          <div className="max-w-md mx-auto bg-green-500 text-white px-6 py-3 rounded-full shadow-lg mb-10 flex items-center justify-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined">check_circle</span>
            {successMessage}
          </div>
        )}

        {/* --- MENU DE FILTROS --- */}
        <nav className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 border shadow-sm
              ${selectedCategory === 'all'
                ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-blue-200 dark:shadow-none'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-500'}`}
          >
            <span className="material-symbols-outlined text-xl">grid_view</span>
            Todos
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 border shadow-sm
                ${selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-blue-200 dark:shadow-none'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-500'}`}
            >
              <span className="material-symbols-outlined text-xl">
                {/* Ícone dinâmico opcional se você salvar o nome do ícone na categoria */}
                label
              </span>
              {cat.name}
            </button>
          ))}
        </nav>

        {/* --- GRID DE PRODUTOS --- */}
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Sincronizando produtos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  Nenhum produto disponível nesta categoria.
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in-up">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;