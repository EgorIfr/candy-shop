import { useState } from 'react';
import Logo from '/logo.jpg';
import Basket from '/basket.svg';
import Search from '/search.svg';
import Account from '/account.svg';
import ArrowDown from '/arrow-down.svg';

export default function Header() {
    const [activeMenu, setActiveMenu] = useState(null);

    const menuData = [
        {
            title: 'Наши конфеты',
            categories: [
                {
                    title: 'Шоколадные',
                    items: [
                        { name: 'Шоколадные трюфели', link: '/chocolate-truffles' },
                        { name: 'Шоколадные батончики', link: '/chocolate-bars' },
                        { name: 'Шоколадные конфеты', link: '/chocolate-candies' }
                    ]
                },
                {
                    title: 'Фруктовые',
                    items: [
                        { name: 'Фруктовые жевательные', link: '/fruit-chewy' },
                        { name: 'Мармелад', link: '/marmalade' },
                        { name: 'Фруктовые пастилки', link: '/fruit-pastilles' }
                    ]
                },
            ]
        },
        {
            title: 'Конфеты "Микс"',
            categories: [
                {
                    title: 'Популярные миксы',
                    items: [
                        { name: 'Микс "Сладкая радость"', link: '/sweet-joy-mix' },
                        { name: 'Микс "Фруктовый взрыв"', link: '/fruit-explosion' },
                        { name: 'Микс "Шоколадная фантазия"', link: '/chocolate-fantasy' }
                    ]
                },
            ]
        },
        {
            title: 'Диетические',
            categories: [
                {
                    title: 'Без сахара',
                    items: [
                        { name: 'На стевии', link: '/stevia' },
                        { name: 'На фруктозе', link: '/fructose' },
                        { name: 'Без сахарные шоколадные', link: '/sugar-free-chocolate' }
                    ]
                },
                {
                    title: 'Веганские',
                    items: [
                        { name: 'Веганские шоколадные', link: '/vegan-chocolate' },
                        { name: 'Фруктовые веганские', link: '/vegan-fruit' },
                        { name: 'Ореховые веганские', link: '/vegan-nuts' }
                    ]
                }
            ]
        },
        {
            title: 'Магазин',
            categories: [
                {
                    title: 'О компании',
                    items: [
                        { name: 'О нас', link: '/about' },
                        { name: 'Наше производство', link: '/production' },
                        { name: 'Контакты', link: '/contacts' }
                    ]
                },
            ]
        }
    ];

    return (
        <>
            <div className='wrapper-header'>
                <div className="container">
                    <header className='header'>
                        <img src={Logo} alt="Logo" className="logo"/>

                        <nav className='navigation'>
                            <ul className='nav-list'>
                                {menuData.map((menu, index) => (
                                    <li
                                        key={menu.title}
                                        className='nav-item'
                                        onMouseEnter={() => setActiveMenu(index)}
                                        onMouseLeave={() => setActiveMenu(null)}
                                    >
                                        <a href="#" className='nav-item-link'>
                                            {menu.title}
                                        </a>
                                        <img src={ArrowDown} className='arrow-down' alt=""/>

                                        {/* Mega Menu Dropdown */}
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

                        <div className='block-auth'>
                            <a href="" className="auth-link"><img src={Search} alt="Search" className='img-auth'/></a>
                            <a href="" className="auth-link"><img src={Account} alt="Account" className='img-auth'/></a>
                            <a href="" className="auth-link"><img src={Basket} alt="Basket" className='img-auth'/></a>
                        </div>
                    </header>
                </div>
            </div>
        </>
    )
}