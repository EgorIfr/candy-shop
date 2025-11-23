import Reward from '/reward.svg';
import Smile from '/smile.svg';
import Delivery from '/delivery.svg';

export default function WrapperPromo() {
  return (
    <div className="wrapper-promo">
      <div className="header-promo">
        <div className="block-promo">
          <img src={Reward} className="img-promo" />
          <span className="promo-text">Всемирный рейтинг по конфетам</span>
        </div>

        <div className="block-promo">
          <img src={Smile} className="img-promo" />
          <span className="promo-text">Лучшие праздничные конфеты</span>
        </div>

        <div className="block-promo">
          <img src={Delivery} className="img-promo" />
          <span className="promo-text">Быстрая доставка по всей стране</span>
        </div>
      </div>
    </div>
  );
}
