import { useState, memo } from 'react';

const SmoothTransformButton = memo(({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      className={`smooth-transform-button ${isHovered ? 'hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Добавить в корзину"
    >
      <span className="button-icon">+</span>
      <span className="button-text">ДОБАВИТЬ В КОРЗИНУ</span>
    </button>
  );
});

SmoothTransformButton.displayName = 'SmoothTransformButton';

const ProductCard = memo(({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="shop-product-card">
      <div className="product-labels">
        {product.label_text && (
          <span className="product-label">{product.label_text}</span>
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
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/200x200/FF6B6B/white?text=No+Image';
          }}
        />
      </div>

      <h3 className="product-title">{product.title || 'Без названия'}</h3>

      {product.description && (
        <p className="product-description">{product.description}</p>
      )}

      <div className="product-price-row">
        <div className="product-price">
          {product.price ? `${Number(product.price).toLocaleString('ru-RU')} ₽` : 'Цена не указана'}
        </div>
        <SmoothTransformButton onClick={handleAddToCart} />
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

