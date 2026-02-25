import React, { useState, useEffect } from 'react';
import '../styles/ProductsPage.css';
import '../styles/components.css';
import { todosLosProductos } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductCard = ({ 
  id, 
  name, 
  image,
  price,
  quantity, 
  isFavorite, 
  onQuantityChange, 
  onAddToCart, 
  onToggleFavorite 
}) => (
  <div className="product-card">
    <div className="product-image-container">
      <img src={image} alt={name} />
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={() => onToggleFavorite(id)}
        aria-label={isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
      >
        ❤️ 
      </button>
    </div>
    <div className="product-info">
      <div className="product-label">{name}</div>
      <div className="product-price">${price.toFixed(2)}</div>
    </div>
    
    <div className="product-controls">
      <div className="quantity-control">
        <button 
          className="qty-btn"
          onClick={() => onQuantityChange(id, quantity - 1)}
          disabled={quantity <= 1}
          aria-label="Disminuir cantidad"
        >
          −
        </button>
        <span className="quantity-display">{quantity}</span>
        <button 
          className="qty-btn"
          onClick={() => onQuantityChange(id, quantity + 1)}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>
      <button 
        className="add-to-cart-btn"
        onClick={() => onAddToCart(id, name, image, price, quantity)}
        aria-label={`Agregar ${quantity} ${name} al carrito`}
      >
        🛒 Agregar
      </button>
    </div>
  </div>
);

export default function ProductsPage() {
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [quantities, setQuantities] = useState({});
  const [favorites, setFavorites] = useState({});

  // Inicializar cantidades a 1
  const getQuantity = (id) => quantities[id] || 1;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      setQuantities(prev => ({
        ...prev,
        [id]: newQuantity
      }));
    }
  };

  const handleAddToCart = (id, name, image, price, quantity) => {
    addToCart({
      id,
      name,
      image,
      price,
      quantity
    });
    alert(`✓ Se agregaron ${quantity} x ${name} al carrito`);
    // Resetear cantidad a 1 después de agregar
    setQuantities(prev => ({
      ...prev,
      [id]: 1
    }));
  };

  const handleToggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <section className="featured-section">
          <h1 className="featured-title">Todos los VideoJuegos</h1>
          <div className="product-grid">
            {todosLosProductos.map((prod) => (
              <ProductCard 
                key={prod.id}
                id={prod.id}
                name={prod.name} 
                image={prod.image}
                price={prod.price}
                quantity={getQuantity(prod.id)}
                isFavorite={favorites[prod.id] || false}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
