import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ArrowRight from '/arrow-right.svg';

// Кастомные стрелки для слайдера
const PrevArrow = ({ onClick }) => (
  <button
    className="slick-arrow slick-prev-custom"
    onClick={onClick}
    aria-label="Previous slide"
  >
    <img src={ArrowRight} alt="Previous" className="arrow-icon arrow-left" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    className="slick-arrow slick-next-custom"
    onClick={onClick}
    aria-label="Next slide"
  >
    <img src={ArrowRight} alt="Next" className="arrow-icon arrow-right" />
  </button>
);

export default function Featured() {
  const { products, loading, error, refetch } = useProducts();

  useEffect(() => {
    console.log('Products data:', products);
    if (products && products.length > 0) {
      console.log('First product:', products[0]);
    }
  }, [products]);

  const SmoothTransformButton = ({
    defaultText = '+',
    hoverText = 'ДОБАВИТЬ В КОРЗИНУ',
    onClick,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        className={`smooth-transform-button ${isHovered ? 'hovered' : ''}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="button-icon">{defaultText}</span>
        <span className="button-text">{hoverText}</span>
      </button>
    );
  };

  const sliderSettings = {
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    pauseOnFocus: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    swipeToSlide: true,
    touchThreshold: 5,
    responsive: [
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: 3,
          speed: 500
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: 2,
          speed: 500
        } 
      },
      { 
        breakpoint: 480, 
        settings: { 
          slidesToShow: 1,
          speed: 400
        } 
      },
    ],
  };

  if (loading) {
    return (
      <div className="featured-collection-wrapper">
        <div className="featured-collection-header">
          <div className="featured-collection-nav">
            <h1 className="featured-collection-new">Новинки</h1>
          </div>
        </div>
        <div className="loading">Загрузка товаров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-collection-wrapper">
        <div className="featured-collection-header">
          <div className="featured-collection-nav">
            <h1 className="featured-collection-new">Новинки</h1>
          </div>
        </div>
        <div className="error-message">
          Ошибка: {error}
          <button onClick={refetch} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-collection-wrapper">
      <div className="featured-collection-header">
        <div className="featured-collection-nav">
          <h1 className="featured-collection-new">Новинки</h1>
        </div>
      </div>

      <div className="featured-slider-container">
        {!products || products.length === 0 ? (
          <div className="no-products">Нет новинок</div>
        ) : (
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <div key={product.id} className="featured-product-card">
                <div className="product-labels">
                  <span className="product-label">
                    {product.label_text || 'New'}
                  </span>
                </div>

                <div className="product-image-container">
                  <img
                    src={
                      product.image_url ||
                      'https://via.placeholder.com/200x200/FF6B6B/white?text=No+Image'
                    }
                    alt={product.title || 'Product'}
                    className="product-image"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/200x200/FF6B6B/white?text=No+Image';
                    }}
                  />
                </div>

                <h3 className="product-title">
                  {product.title || 'Без названия'}
                </h3>

                <div className="product-price-row">
                  <div className="product-price">
                    {product.price ? `${product.price} ₽` : 'Цена не указана'}
                  </div>
                  <SmoothTransformButton />
                </div>
              </div>
            ))}
          </Slider>
        )}
        <div className="show-more-container">
          <Link to="/shop?filter=new" className="show-more-link">
            Показать больше
          </Link>
        </div>
      </div>
    </div>
  );
}
