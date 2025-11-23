import { useState, useEffect } from 'react';

export const useAllProducts = (filter = null, section = null, category = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        let url = `${API_URL}/api/products`;
        
        // Если нужен фильтр на новинки без других фильтров, используем эндпоинт featured
        if (filter === 'new' && !section && !category) {
          url = `${API_URL}/api/featured`;
        } else {
          // Строим URL с параметрами
          const params = new URLSearchParams();
          if (filter) params.append('filter', filter);
          if (section) params.append('section', section);
          if (category) params.append('category', category);
          
          if (params.toString()) {
            url += '?' + params.toString();
          }
        }
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка загрузки товаров: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        const errorMessage = err.message || 'Не удалось подключиться к серверу. Убедитесь, что сервер запущен на порту 3001.';
        setError(errorMessage);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, section, category]);

  return {
    products,
    loading,
    error,
  };
};

