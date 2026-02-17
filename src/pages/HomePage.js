import React from 'react';
import { todosLosProductos } from '../data/products';

const Carousel = ({ current, onPrev, onNext, currentIndex, totalBanners }) => (
  <section className="carousel">
    <div className="carousel-container">
      <button className="carousel-btn carousel-btn-prev" onClick={onPrev} aria-label="Banner anterior">
        ◀
      </button>
      <div className="carousel-track single">
        <div className="carousel-slide">
          <img src={current.src} alt={current.alt} />
        </div>
      </div>
      <button className="carousel-btn carousel-btn-next" onClick={onNext} aria-label="Banner siguiente">
        ▶
      </button>
    </div>
    <div className="carousel-dots">
      {Array.from({ length: totalBanners }).map((_, idx) => (
        <div
          key={idx}
          className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
        />
      ))}
    </div>
  </section>
);

const ProductCard = ({ name, image }) => (
  <div className="product-card">
    <img src={image} alt={name} />
    <div className="product-label">{name}</div>
  </div>
);

const FeaturedGames = ({ games }) => (
  <section className="featured-section">
    <h2 className="featured-title">Los mejores juegos están aquí, ¡Entra al live!</h2>
    <div className="featured-grid">
      {games.map((game, index) => (
        <ProductCard key={index} name={game.name} image={game.image} />
      ))}
    </div>
  </section>
);

export default function HomePage() {
  const bannerContext = require.context(
    '../assets/Banners_FastPass',
    false,
    /\.(png|jpe?g|gif)$/
  );
  const allBanners = bannerContext.keys().map(bannerContext);

  const bannerItems = React.useMemo(
    () => allBanners.map((src, idx) => ({ src, alt: `Banner ${idx + 1}` })),
    [allBanners]
  );

  const [currentBanner, setCurrentBanner] = React.useState(() => {
    const initial = bannerItems[Math.floor(Math.random() * bannerItems.length)];
    return initial || { src: '', alt: '' };
  });

  const [currentIndex, setCurrentIndex] = React.useState(
    bannerItems.length > 0 ? Math.floor(Math.random() * bannerItems.length) : 0
  );

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % bannerItems.length;
      setCurrentBanner(bannerItems[next]);
      return next;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + bannerItems.length) % bannerItems.length;
      setCurrentBanner(bannerItems[next]);
      return next;
    });
  };

  React.useEffect(() => {
    if (bannerItems.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 10000);
    return () => clearInterval(interval);
  }, [bannerItems, currentIndex]);

  const juegosFeatured = [...todosLosProductos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <main className="main-content">
      <Carousel 
        current={currentBanner}
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={currentIndex}
        totalBanners={bannerItems.length}
      />
      
      <FeaturedGames games={juegosFeatured} />
    </main>
  );
}
