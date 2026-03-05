import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/SuccessPage.css';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Limpiar el carrito después de una compra exitosa
    clearCart();
    
    // Mostrar el popup
    setShowPopup(true);

    // Redirigir a la página principal después de 5 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [clearCart, navigate]);

  const handleClose = () => {
    setShowPopup(false);
    navigate('/');
  };

  return (
    <div className="success-container">
      {showPopup && (
        <div className="popup-overlay" onClick={handleClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">✅</div>
            <h1>¡Compra Exitosa!</h1>
            <div className="prueba-badge">PRUEBA</div>
            <p>Tu pago se ha procesado correctamente.</p>
            {sessionId && (
              <p className="session-id">
                ID de Sesión: <span>{sessionId.slice(0, 20)}...</span>
              </p>
            )}
            <button className="btn-close-popup" onClick={handleClose}>
              Cerrar
            </button>
            <p className="redirect-text">
              Serás redirigido automáticamente en 5 segundos...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
