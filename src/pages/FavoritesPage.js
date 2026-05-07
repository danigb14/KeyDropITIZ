import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import '../styles/FavoritesPage.css';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});

  const getProductPrice = (product) => Number(product.price ?? product.precio ?? 0) || 0;
  const getProductImage = (product) => product.image || product.img || product.url || 'https://via.placeholder.com/300x200?text=Sin+imagen';

  const getQuantity = (id) => quantities[id] || 1;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantities(prev => ({
        ...prev,
        [id]: newQuantity
      }));
    } else if (newQuantity > 20) {
      alert('⚠️ No puedes seleccionar más de 20 unidades por producto');
      setQuantities(prev => ({
        ...prev,
        [id]: 20
      }));
    }
  };

  const handleAddToCart = (product) => {
    const quantity = getQuantity(product.id);
    const numericPrice = getProductPrice(product);
    const productImage = getProductImage(product);
    addToCart({
      id: product.id,
      name: product.name,
      image: productImage,
      price: numericPrice,
      quantity
    });
    alert(`✓ Se agregaron ${quantity} x ${product.name} al carrito`);
    // Resetear cantidad a 1 después de agregar
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const handleRemoveFavorite = (productId) => {
    removeFromFavorites(productId);
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <div className="favorites-empty">
          <h1>❤️ Mis Favoritos</h1>
          <p>No tienes productos favoritos aún</p>
          <button className="btn-continue-shopping" onClick={() => navigate('/productos')}>
            Ir a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>❤️ Mis Favoritos</h1>
      <p className="favorites-count">Tienes {favorites.length} producto{favorites.length !== 1 ? 's' : ''} favorito{favorites.length !== 1 ? 's' : ''}</p>

      <div className="favorites-grid">
        {favorites.map((product) => (
          <div key={product.id} className="favorite-card">
            <button 
              className="remove-favorite-btn"
              onClick={() => handleRemoveFavorite(product.id)}
              aria-label="Eliminar de favoritos"
            >
              ❤️
            </button>
            <div className="favorite-image-container">
              <img
                src={getProductImage(product)}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+imagen';
                }}
              />
            </div>
            <div className="favorite-info">
              <h3>{product.name}</h3>
              <p className="favorite-price">${getProductPrice(product).toFixed(2)}</p>
            </div>
            
            <div className="favorite-controls">
              <div className="quantity-control">
                <button 
                  className="qty-btn"
                  onClick={() => handleQuantityChange(product.id, getQuantity(product.id) - 1)}
                  disabled={getQuantity(product.id) <= 1}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="quantity-display">{getQuantity(product.id)}</span>
                <button 
                  className="qty-btn"
                  onClick={() => handleQuantityChange(product.id, getQuantity(product.id) + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
                aria-label={`Agregar ${getQuantity(product.id)} ${product.name} al carrito`}
              >
                🛒 Agregar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="favorites-actions">
        <button className="btn-continue-shopping" onClick={() => navigate('/productos')}>
          Seguir comprando
        </button>
      </div>
    </div>
  );
}
