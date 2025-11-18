import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import menuData from "../data/menu.json";
import Logo from "/logo.jpg";
import Basket from "/basket.svg";
import Search from "/search.svg";
import Account from "/account.svg";
import ArrowDown from "/arrow-down.svg";
import Home from "./Home.jsx";

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="wrapper-header">
      <div className="container">
        <header className="header">
          <img src={Logo} alt="Logo" className="logo" />

          <nav className="navigation">
            <ul className="nav-list">
              {menuData.map((menu, index) => (
                <li
                  key={menu.title}
                  className="nav-item"
                  onMouseEnter={() => setActiveMenu(index)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <a href={menu.link} className="nav-item-link">
                    {menu.title}
                  </a>
                  <img src={ArrowDown} className="arrow-down" alt="" />

                  {activeMenu === index && (
                    <div className="mega-menu-dropdown">
                      <div className="mega-menu-content">
                        {menu.categories.map((category, catIndex) => (
                          <div key={catIndex} className="mega-menu-column">
                            <h4 className="category-title">{category.title}</h4>
                            <div className="category-items">
                              {category.items.map((item) => (
                                <a
                                  key={item.name}
                                  href={item.link}
                                  className="category-item"
                                >
                                  {item.name}
                                </a>
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
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <div className="block-auth">
            <a href="#" className="auth-link">
              <img src={Search} alt="Search" className="img-auth" />
            </a>
            <a href="#" className="auth-link">
              <img src={Account} alt="Account" className="img-auth" />
            </a>
            <a href="#" className="auth-link cart-link">
              <img src={Basket} alt="Basket" className="img-auth" />
            </a>
          </div>
        </header>
      </div>
    </div>
  );
}
