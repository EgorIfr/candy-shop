import { useEffect } from 'react';
import { useCart } from '../hooks/useCart.js';

export default function CartDrawer() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    isCartOpen,
    closeCart,
  } = useCart();

  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener('keydown', handleEscape);
      // Блокируем прокрутку body когда корзина открыта
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

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

  const handleCheckout = () => {
    // Здесь можно добавить логику оформления заказа
    console.log('Оформление заказа:', cartItems);
    alert('Функция оформления заказа будет реализована позже');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-drawer-overlay" onClick={closeCart} />

      {/* Drawer */}
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Корзина</h2>
          <button
            className="cart-drawer-close"
            onClick={closeCart}
            aria-label="Закрыть корзину"
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="cart-drawer-empty">
              <div className="cart-drawer-empty-icon">🛒</div>
              <p className="cart-drawer-empty-text">Ваша корзина пуста</p>
            </div>
          ) : (
            <>
              <div className="cart-drawer-items">
                {cartItems.map((item) => {
                  const price = parseFloat(item.price) || 0;
                  const itemTotal = price * item.quantity;

                  return (
                    <div key={item.id} className="cart-drawer-item">
                      <div className="cart-drawer-item-image">
                        <img
                          src={
                            item.image_url ||
                            'https://via.placeholder.com/80x80/FF6B6B/white?text=No+Image'
                          }
                          alt={item.title || 'Product'}
                          className="cart-drawer-item-img"
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/80x80/FF6B6B/white?text=No+Image';
                          }}
                        />
                      </div>

                      <div className="cart-drawer-item-info">
                        <h3 className="cart-drawer-item-title">
                          {item.title || 'Без названия'}
                        </h3>
                        <div className="cart-drawer-item-price">
                          {price.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      <div className="cart-drawer-item-controls">
                        <div className="cart-drawer-item-quantity">
                          <button
                            className="cart-drawer-quantity-button"
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
                            className="cart-drawer-quantity-input"
                          />
                          <button
                            className="cart-drawer-quantity-button"
                            onClick={() =>
                              handleIncrease(item.id, item.quantity)
                            }
                            aria-label="Увеличить количество"
                          >
                            +
                          </button>
                        </div>
                        <div className="cart-drawer-item-total">
                          {itemTotal.toLocaleString('ru-RU')} ₽
                        </div>
                        <button
                          className="cart-drawer-item-remove"
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

              <div className="cart-drawer-summary">
                <div className="cart-drawer-summary-row">
                  <span className="cart-drawer-summary-label">Итого:</span>
                  <span className="cart-drawer-summary-value">
                    {getTotalPrice().toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="cart-drawer-actions">
                  <button
                    className="cart-drawer-clear-button"
                    onClick={clearCart}
                  >
                    Очистить корзину
                  </button>
                  <button
                    className="cart-drawer-checkout-button"
                    onClick={handleCheckout}
                  >
                    Оформить заказ
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
