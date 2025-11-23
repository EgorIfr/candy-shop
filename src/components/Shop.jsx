import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAllProducts } from '../hooks/useAllProducts';
import Header from './Header.jsx';
import WrapperPromo from './WrapperPromo.jsx';
import menuData from '../data/menu.json';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || null;
  const section = searchParams.get('section') || null;
  const category = searchParams.get('category') || null;
  
  const { products, loading, error } = useAllProducts(
    filter,
    section,
    category
  );

  // Получаем название активной категории/секции
  const activeCategoryName = useMemo(() => {
    if (category) {
      for (const menu of menuData) {
        for (const cat of menu.categories || []) {
          if (cat.categoryId && parseInt(cat.categoryId) === parseInt(category)) {
            return cat.title;
          }
        }
      }
    }
    if (section) {
      const menuItem = menuData.find(m => m.sectionId && parseInt(m.sectionId) === parseInt(section));
      return menuItem ? menuItem.title : null;
    }
    return null;
  }, [section, category]);

  const handleFilterChange = (newFilter) => {
    const newParams = {};
    if (newFilter && newFilter !== 'all') {
      newParams.filter = newFilter;
    }
    if (section) newParams.section = section;
    if (category) newParams.category = category;
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const SmoothTransformButton = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        className={`smooth-transform-button ${isHovered ? 'hovered' : ''}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="button-icon">+</span>
        <span className="button-text">ДОБАВИТЬ В КОРЗИНУ</span>
      </button>
    );
  };

  return (
    <>
      <WrapperPromo />
      <Header />
      <main className="main">
        <div className="shop-wrapper">
          <div className="shop-header">
            <div className="shop-title-section">
              <h1 className="shop-title">
                {activeCategoryName || 'Магазин'}
              </h1>
              {(section || category || filter) && (
                <button
                  className="clear-filters-button"
                  onClick={handleClearFilters}
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
            <div className="shop-filters">
              <button
                className={`filter-button ${!filter || filter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                Все товары
              </button>
              <button
                className={`filter-button ${filter === 'new' ? 'active' : ''}`}
                onClick={() => handleFilterChange('new')}
              >
                Новинки
              </button>
              <button
                className={`filter-button ${filter === 'popular' ? 'active' : ''}`}
                onClick={() => handleFilterChange('popular')}
              >
                Популярные
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading">Загрузка товаров...</div>
          )}

          {error && (
            <div className="error-message">
              Ошибка: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <div className="no-products">Товары не найдены</div>
              ) : (
                <div className="shop-products-grid">
                  {products.map((product) => (
                    <div key={product.id} className="shop-product-card">
                      <div className="product-labels">
                        {product.label_text && (
                          <span className="product-label">
                            {product.label_text}
                          </span>
                        )}
                      </div>

                      <div className="product-image-container">
                        <img
                          src={
                            product.image_url ||
                            'https://via.placeholder.com/200x200/FF6B6B/white?text=No+Image'
                          }
                          alt={product.title || 'Product'}
                          className="product-image"
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/200x200/FF6B6B/white?text=No+Image';
                          }}
                        />
                      </div>

                      <h3 className="product-title">
                        {product.title || 'Без названия'}
                      </h3>

                      {product.description && (
                        <p className="product-description">{product.description}</p>
                      )}

                      <div className="product-price-row">
                        <div className="product-price">
                          {product.price ? `${product.price} ₽` : 'Цена не указана'}
                        </div>
                        <SmoothTransformButton />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

