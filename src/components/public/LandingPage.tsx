import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useLocation } from 'react-router-dom';
import { Product } from '../../models/Product';
import { api } from '../../services/api';
import { Category } from '../../models/Category';

const LandingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Estado para categorias
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Estado do filtro
  
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca produtos e categorias em paralelo
        const [productsData, categoriesData] = await Promise.all([
          api.get('products'),
          api.get('categories')
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao buscar dados na API:', error);
      }
    };
    fetchData();
  }, []);

  // Lógica de filtragem
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.categoryId === selectedCategory);

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">
        🚀 Nossa Vitrine de Produtos
      </h1>

      {successMessage && (
        <div className="max-w-md mx-auto bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-8 text-center animate-bounce">
          {successMessage}
        </div>
      )}

      {/* --- MENU DE FILTROS --- */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-2 rounded-full font-semibold transition-all border
            ${selectedCategory === 'all' 
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200'}`}
        >
          Todos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-full font-semibold transition-all border
              ${selectedCategory === cat.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* --- GRID DE PRODUTOS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Nenhum produto encontrado nesta categoria. 📦
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default LandingPage;