import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import menuData from '../data/menu.json';
import Logo from '/logo.jpg';
import Basket from '/basket.svg';
import Search from '/search.svg';
import Account from '/account.svg';
import ArrowDown from '/arrow-down.svg';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);
  const headerRef = useRef(null);
  const { getTotalItems, openCart } = useCart();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuEnter = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(index);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <div className="wrapper-header" ref={headerRef}>
      <div className="container">
        <header className="header">
          <a href="/">
            <img src={Logo} alt="Logo" className="logo" />
          </a>

          <nav className="navigation">
            <ul className="nav-list">
              {menuData.map((menu, index) => (
                <li
                  key={menu.title}
                  className="nav-item"
                  onMouseEnter={() => handleMenuEnter(index)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link to={menu.link || '#'} className="nav-item-link">
                    {menu.title}
                  </Link>
                  <img src={ArrowDown} className="arrow-down" alt="" />

                  {activeMenu === index && (
                    <div
                      className="mega-menu-dropdown"
                      onMouseEnter={() => handleMenuEnter(index)}
                      onMouseLeave={handleMenuLeave}
                    >
                      <div className="mega-menu-content">
                        {menu.categories.map((category, catIndex) => (
                          <div key={catIndex} className="mega-menu-column">
                            {category.categoryId ? (
                              <Link
                                to={`/shop?category=${category.categoryId}`}
                                className="category-title-link"
                                onClick={() => setActiveMenu(null)}
                              >
                                <h4 className="category-title">
                                  {category.title}
                                </h4>
                              </Link>
                            ) : (
                              <h4 className="category-title">
                                {category.title}
                              </h4>
                            )}
                            <div className="category-items">
                              {category.items.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.link}
                                  className="category-item"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="block-auth">
            <Link to="/shop" className="auth-link">
              <img src={Search} alt="Search" className="img-auth" />
            </Link>
            {user ? (
              <>
                {isAdmin() && (
                  <Link to="/admin" className="auth-link" title="Админ-панель">
                    Админ
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="auth-link"
                  title="Выйти"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                >
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">
                  Вход
                </Link>
                <Link to="/register" className="auth-link">
                  Регистрация
                </Link>
              </>
            )}
            <button
              onClick={openCart}
              className="auth-link cart-link cart-button"
              aria-label="Открыть корзину"
            >
              <img src={Basket} alt="Basket" className="img-auth" />
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
          </div>
        </header>
      </div>
    </div>
  );
}
