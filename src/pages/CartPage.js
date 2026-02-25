import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    // TODO: Implementar proceso de checkout
    alert('Función de pago en desarrollo');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h1>🛒 Carrito de Compras</h1>
          <p>Tu carrito está vacío</p>
          <button className="btn-continue-shopping" onClick={() => navigate('/productos')}>
            Ir a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>🛒 Carrito de Compras</h1>
      <div className="cart-summary">
        <span>Total de productos: {getCartCount()}</span>
        <button className="btn-clear-cart" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              {item.price && <p className="cart-item-price">${item.price.toFixed(2)}</p>}
            </div>
            <div className="cart-item-controls">
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
                aria-label="Eliminar del carrito"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <h2>Total: ${getCartTotal().toFixed(2)}</h2>
        </div>
        <div className="cart-actions">
          <button className="btn-continue-shopping" onClick={() => navigate('/productos')}>
            Seguir comprando
          </button>
          <button className="btn-checkout" onClick={handleCheckout}>
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
}
