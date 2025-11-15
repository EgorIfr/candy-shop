import { useState } from 'react'
import Reward from '/reward.svg'
import Smile from '/smile.svg'
import Delivery from '/delivery.svg'

import Logo from '/logo.svg'
import Basket from '/basket.svg'
import Search from '/search.svg'
import Account from '/account.svg'
import ArrowDown from '/arrow-down.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

        <div className="wrapper-promo">
            <div className="promo">
                <div className="block-promo"><img src={Reward} alt="" className='img-promo' /><span className='promo-text'>Всемирный рейтинг по конфетам</span></div>
                <div className="block-promo"><img src={Smile} alt="" className='img-promo' /><span className='promo-text'>Лучшие праздничные конфеты</span></div>
                <div className="block-promo"><img src={Delivery} alt="" className='img-promo' /><span className='promo-text'>Быстрая доставка по всей стране</span></div>
            </div>
        </div>

        <div className='wrapper-header'>
            <div className="container">
                <header className='header'>
                    <img src={Logo} alt="Logo" className="logo"/>
                    <nav className='navigation'>
                        <ul className='nav-list'>
                            <li className='nav-item'><a href="#" className='nav-item-link'>Наши конфеты</a><img src={ArrowDown} className='arrow-down' alt=""/></li>
                            <li className='nav-item'><a href="#" className='nav-item-link'>Конфеты "Микс"</a><img src={ArrowDown} className='arrow-down' alt=""/></li>
                            <li className='nav-item'><a href="#" className='nav-item-link'>Диетические</a><img src={ArrowDown} className='arrow-down' alt=""/></li>
                            <li className='nav-item'><a href="#" className='nav-item-link'>Магазин</a><img src={ArrowDown} className='arrow-down' alt=""/></li>
                        </ul>
                    </nav>
                    <div className='block-auth'>
                        <img src={Search} alt="Search" className='img-auth'/>
                        <img src={Account} alt="Account" className='img-auth'/>
                        <img src={Basket} alt="Basket" className='img-auth'/>
                    </div>
                </header>
            </div>
        </div>
    </>
  )
}

export default App
