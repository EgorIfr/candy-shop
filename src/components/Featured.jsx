import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';

export default function Featured() {
  const { products, loading, error, refetch } = useProducts();

  const SmoothTransformButton = ({
    defaultText = '+',
    hoverText = 'ДОБАВИТЬ В КОРЗИНУ',
    onClick,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        className={`smooth-transform-button ${isHovered ? 'hovered' : ''}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="button-icon">{defaultText}</span>
        <span className="button-text">{hoverText}</span>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="featured-collection-wrapper">
        <div className="featured-collection-header">
          <div className="featured-collection-nav">
            <h1 className="featured-collection-new">Новинки</h1>
          </div>
        </div>
        <div className="loading">Загрузка товаров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-collection-wrapper">
        <div className="featured-collection-header">
          <div className="featured-collection-nav">
            <h1 className="featured-collection-new">Новинки</h1>
          </div>
        </div>
        <div className="error-message">
          Ошибка: {error}
          <button onClick={refetch} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-collection-wrapper">
      <div className="featured-collection-header">
        <div className="featured-collection-nav">
          <h1 className="featured-collection-new">Новинки</h1>
        </div>
      </div>

      <div className="carousel-wrapper">
        {products.length === 0 ? (
          <div className="no-products">Нет новинок</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="carousel-block">
              <div className="product-labels">
                <span className="product-label">
                  {product.label_text || 'New'}
                </span>
              </div>

              <img
                src={product.image_url || '/images/placeholder.jpg'}
                alt={product.title}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />

              <div className="product-card">
                <div className="product-title">{product.title}</div>
                <div className="product-price">
                  {product.price ? `${product.price} ₽` : 'Цена не указана'}
                </div>
                <SmoothTransformButton />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
