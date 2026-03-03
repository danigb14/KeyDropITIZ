import React, { useState, useEffect } from 'react';
import '../styles/ProductsPage.css';
import '../styles/components.css';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

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
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [quantities, setQuantities] = useState({});
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar cantidades a 1
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
    const product = productos.find(p => p.id === id);
    if (product) {
      const isNowFavorite = toggleFavorite(product);
      if (isNowFavorite) {
        alert(`❤️ ${product.name} agregado a favoritos`);
      } else {
        alert(`💔 ${product.name} eliminado de favoritos`);
      }
    }
  };

  // Fetch productos desde la función backend
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Configura REACT_APP_FUNCTIONS_URL en .env si tu función no está en el mismo host
        const base = process.env.REACT_APP_FUNCTIONS_URL || '';
        const res = await fetch(`${base}/getProductos`);
        const contentType = (res.headers.get('content-type') || '').toLowerCase();
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text.substring(0, 500)}`);
        }
        let data;
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          throw new Error('Respuesta no JSON: ' + text.substring(0, 1000));
        }
        if (mounted) setProductos(data || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Error al cargar productos');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="app-container">
      <main className="main-content">
        <section className="featured-section">
          <h1 className="featured-title">Todos los VideoJuegos</h1>
          <div className="product-grid">
            {loading && <div>Cargando productos…</div>}
            {error && <div className="error">Error: {error}</div>}
            {!loading && !error && productos.length === 0 && (
              <div>No hay productos disponibles.</div>
            )}
            {!loading && !error && productos.map((prod) => (
              <ProductCard 
                key={prod.id}
                id={prod.id}
                name={prod.name || prod.productosid || prod.productos}
                image={prod.img || prod.image || ''}
                price={Number(prod.price) || 0}
                quantity={getQuantity(prod.id)}
                isFavorite={isFavorite(prod.id)}
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
