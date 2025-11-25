import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import Header from './Header.jsx';
import WrapperPromo from './WrapperPromo.jsx';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    updateQuantity(productId, quantity);
  };

  const handleDecrease = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity - 1);
  };

  const handleIncrease = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  return (
    <>
      <WrapperPromo />
      <Header />
      <main className="main">
        <div className="cart-wrapper">
          <div className="cart-header">
            <h1 className="cart-title">Корзина</h1>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="clear-cart-button">
                Очистить корзину
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h2 className="cart-empty-title">Ваша корзина пуста</h2>
              <p className="cart-empty-text">
                Добавьте товары из каталога, чтобы они появились здесь
              </p>
              <Link to="/shop" className="cart-empty-link">
                Перейти в магазин
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => {
                  const price = parseFloat(item.price) || 0;
                  const itemTotal = price * item.quantity;

                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img
                          src={
                            item.image_url ||
                            'https://via.placeholder.com/150x150/FF6B6B/white?text=No+Image'
                          }
                          alt={item.title || 'Product'}
                          className="cart-item-img"
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/150x150/FF6B6B/white?text=No+Image';
                          }}
                        />
                      </div>

                      <div className="cart-item-info">
                        <h3 className="cart-item-title">
                          {item.title || 'Без названия'}
                        </h3>
                        {item.description && (
                          <p className="cart-item-description">
                            {item.description}
                          </p>
                        )}
                        <div className="cart-item-price">
                          {price.toLocaleString('ru-RU')} ₽ за шт.
                        </div>
                      </div>

                      <div className="cart-item-controls">
                        <div className="cart-item-quantity">
                          <button
                            className="quantity-button"
                            onClick={() =>
                              handleDecrease(item.id, item.quantity)
                            }
                            aria-label="Уменьшить количество"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            className="quantity-input"
                          />
                          <button
                            className="quantity-button"
                            onClick={() =>
                              handleIncrease(item.id, item.quantity)
                            }
                            aria-label="Увеличить количество"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-total">
                          {itemTotal.toLocaleString('ru-RU')} ₽
                        </div>

                        <button
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Удалить товар"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Итого:</span>
                  <span className="cart-summary-value">
                    {getTotalPrice().toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="cart-summary-actions">
                  <Link to="/shop" className="cart-continue-shopping">
                    Продолжить покупки
                  </Link>
                  <button className="cart-checkout-button">
                    Оформить заказ
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
