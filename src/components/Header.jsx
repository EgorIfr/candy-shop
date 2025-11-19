import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Закрытие меню при клике вне области
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(index);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  return (
    <div className="wrapper-header" ref={headerRef}>
      <div className="container">
        <header className="header">
          <img src={Logo} alt="Logo" className="logo" />

          <nav className="navigation">
            <ul className="nav-list">
              {menuData.map((menu, index) => (
                <li
                  key={menu.title}
                  className="nav-item"
                  onMouseEnter={() => handleMenuEnter(index)}
                  onMouseLeave={handleMenuLeave}
                >
                  <Link to={menu.link} className="nav-item-link">
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
                            <h4 className="category-title">{category.title}</h4>
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
            <Link to="/search" className="auth-link">
              <img src={Search} alt="Search" className="img-auth" />
            </Link>
            <Link to="/account" className="auth-link">
              <img src={Account} alt="Account" className="img-auth" />
            </Link>
            <Link to="/cart" className="auth-link cart-link">
              <img src={Basket} alt="Basket" className="img-auth" />
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
}
