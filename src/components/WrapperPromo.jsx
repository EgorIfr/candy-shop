import Reward from '/reward.svg'
import Smile from '/smile.svg'
import Delivery from '/delivery.svg'


export default function WrapperPromo() {
    return(
        <>
            <div className="wrapper-promo">
                <div className="header-promo">
                    <div className="block-promo"><img src={Reward} alt="" className='img-promo'/><span
                        className='promo-text'>Всемирный рейтинг по конфетам</span></div>
                    <div className="block-promo"><img src={Smile} alt="" className='img-promo'/><span
                        className='promo-text'>Лучшие праздничные конфеты</span></div>
                    <div className="block-promo"><img src={Delivery} alt="" className='img-promo'/><span
                        className='promo-text'>Быстрая доставка по всей стране</span></div>
                </div>
            </div>
        </>
    )
}