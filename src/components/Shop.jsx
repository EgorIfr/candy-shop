import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAllProducts } from '../hooks/useAllProducts';
import { useCart } from '../hooks/useCart.js';
import Header from './Header.jsx';
import WrapperPromo from './WrapperPromo.jsx';
import ProductCard from './ProductCard.jsx';
import ShopFilters from './ShopFilters.jsx';
import ShopSearch from './ShopSearch.jsx';
import ShopSort from './ShopSort.jsx';
import ShopCategoryFilter from './ShopCategoryFilter.jsx';
import menuData from '../data/menu.json';
import { filterProductsBySearch, sortProducts } from '../utils/productUtils';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filter = searchParams.get('filter') || null;
  const section = searchParams.get('section') || null;
  const category = searchParams.get('category') || null;

  const { products, loading, error } = useAllProducts(
    filter,
    section,
    category
  );

  const { addToCart } = useCart();

  // Получаем название активной категории/секции
  const activeCategoryName = useMemo(() => {
    if (category) {
      for (const menu of menuData) {
        for (const cat of menu.categories || []) {
          if (
            cat.categoryId &&
            parseInt(cat.categoryId) === parseInt(category)
          ) {
            return cat.title;
          }
        }
      }
    }
    if (section) {
      const menuItem = menuData.find(
        (m) => m.sectionId && parseInt(m.sectionId) === parseInt(section)
      );
      return menuItem ? menuItem.title : null;
    }
    return null;
  }, [section, category]);

  // Обработчики фильтрации
  const handleFilterChange = useCallback(
    (newFilter) => {
      const newParams = {};
      if (newFilter && newFilter !== 'all') {
        newParams.filter = newFilter;
      }
      if (section) newParams.section = section;
      if (category) newParams.category = category;
      setSearchParams(newParams);
    },
    [section, category, setSearchParams]
  );

  const handleClearFilters = useCallback(() => {
    setSearchParams({});
    setSearchQuery('');
    setSortBy('default');
  }, [setSearchParams]);

  const handleCategoryChange = useCallback(
    (newCategory) => {
      const newParams = {};
      if (filter) newParams.filter = filter;
      if (section) newParams.section = section;
      if (newCategory) newParams.category = newCategory;
      setSearchParams(newParams);
    },
    [filter, section, setSearchParams]
  );

  // Фильтрация и сортировка товаров
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Фильтрация по поисковому запросу
    result = filterProductsBySearch(result, searchQuery);

    // Сортировка
    result = sortProducts(result, sortBy);

    return result;
  }, [products, searchQuery, sortBy]);

  // Обработчик добавления в корзину
  const handleAddToCart = useCallback(
    (product) => {
      addToCart(product);
    },
    [addToCart]
  );

  const hasActiveFilters = Boolean(
    section || category || filter || searchQuery || sortBy !== 'default'
  );

  return (
    <>
      <WrapperPromo />
      <Header />
      <main className="main">
        <div className="shop-wrapper">
          <div className="shop-header">
            <div className="shop-title-section">
              <h1 className="shop-title">{activeCategoryName || 'Магазин'}</h1>
            </div>
          </div>

          {/* Панель фильтров и поиска */}
          <div className="shop-controls">
            <div className="shop-controls-top">
              <ShopSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <div className="shop-controls-right">
                <ShopCategoryFilter
                  selectedCategory={category}
                  onCategoryChange={handleCategoryChange}
                />
                <ShopSort sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            </div>
            <ShopFilters
              activeFilter={filter}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Состояния загрузки и ошибок */}
          {loading && <div className="loading">Загрузка товаров...</div>}

          {error && <div className="error-message">Ошибка: {error}</div>}

          {/* Список товаров */}
          {!loading && !error && (
            <>
              {filteredAndSortedProducts.length === 0 ? (
                <div className="no-products">
                  {searchQuery
                    ? `Товары по запросу "${searchQuery}" не найдены`
                    : 'Товары не найдены'}
                </div>
              ) : (
                <>
                  {searchQuery && (
                    <div className="search-results-info">
                      Найдено товаров: {filteredAndSortedProducts.length}
                    </div>
                  )}
                  <div className="shop-products-grid">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
