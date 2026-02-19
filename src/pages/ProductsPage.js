import React, { useState } from 'react';
import '../styles/ProductsPage.css';
import '../styles/components.css';
import { todosLosProductos } from '../data/products';

const ProductCard = ({ 
  id, 
  name, 
  image, 
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
    <div className="product-label">{name}</div>
    
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
        onClick={() => onAddToCart(id, name, quantity)}
        aria-label={`Agregar ${quantity} ${name} al carrito`}
      >
        🛒 Agregar
      </button>
    </div>
  </div>
);

export default function ProductsPage() {
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

  const handleAddToCart = (id, name, quantity) => {
    // Aquí puedes conectar a un carrito global o almacenamiento
    alert(`✓ Se agregaron ${quantity} x ${name} al carrito`);
    console.log(`Agregado: ${quantity}x ${name}`);
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
            {todosLosProductos.map((prod, index) => (
              <ProductCard 
                key={index}
                id={index}
                name={prod.name} 
                image={prod.image}
                quantity={getQuantity(index)}
                isFavorite={favorites[index] || false}
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
