import React, { useState, useEffect } from 'react';
import '../styles/ProductsPage.css';
import '../styles/components.css';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

// --- COMPONENTE HIJO: TARJETA DE PRODUCTO ---
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
      <img src={image || 'https://via.placeholder.com/150'} alt={name} />
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={() => onToggleFavorite(id)}
        aria-label={isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
    <div className="product-info">
      <div className="product-label">{name}</div>
      <div className="product-price">${Number(price).toFixed(2)}</div>
    </div>
    
    <div className="product-controls">
      <div className="quantity-control">
        <button 
          className="qty-btn"
          onClick={() => onQuantityChange(id, quantity - 1)}
          disabled={quantity <= 1}
        >
          −
        </button>
        <span className="quantity-display">{quantity}</span>
        <button 
          className="qty-btn"
          onClick={() => onQuantityChange(id, quantity + 1)}
        >
          +
        </button>
      </div>
      <button 
        className="add-to-cart-btn"
        onClick={() => onAddToCart(id, name, image, price, quantity)}
      >
        🛒 Agregar
      </button>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL: PÁGINA DE PRODUCTOS ---
export default function ProductsPage() {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [quantities, setQuantities] = useState({});
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('alphabetical');

  // URL del Backend (Asegúrate de que coincida con tu servidor Node)
  const API_URL = process.env.REACT_APP_FUNCTIONS_URL || 'http://localhost:3001';

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/getProductos`);
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      // Ordenar productos alfabéticamente de A a Z
      const sortedData = (data || []).sort((a, b) => {
        const nameA = (a.name || a.titulo || '').toLowerCase();
        const nameB = (b.name || b.titulo || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setProductos(sortedData);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los videojuegos. ¿Está encendido el servidor backend?");
    } finally {
      setLoading(false);
    }
  };

  const getQuantity = (id) => quantities[id] || 1;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantities(prev => ({ ...prev, [id]: newQuantity }));
    } else if (newQuantity > 20) {
      alert('⚠️ Máximo 20 unidades');
    }
  };

  const handleAddToCart = (id, name, image, price, quantity) => {
    addToCart({ id, name, image, price, quantity });
    alert(`✓ ${quantity} x ${name} añadidos.`);
    setQuantities(prev => ({ ...prev, [id]: 1 }));
  };

  const handleToggleFavorite = (id) => {
    const product = productos.find(p => p.id === id);
    if (product) {
      toggleFavorite(product);
    }
  };

  const applySort = (data, type) => {
    const sorted = [...data];
    
    switch(type) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = Number(a.price || a.precio || 0);
          const priceB = Number(b.price || b.precio || 0);
          return priceA - priceB;
        });
      
      case 'alphabetical':
        return sorted.sort((a, b) => {
          const nameA = (a.name || a.titulo || '').toLowerCase();
          const nameB = (b.name || b.titulo || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
      
      case 'random':
        return sorted.sort(() => Math.random() - 0.5);
      
      default:
        return sorted;
    }
  };

  const handleSortChange = (type) => {
    setSortType(type);
    setProductos(applySort(productos, type));
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <section className="featured-section">
          <h1 className="featured-title">Todos los VideoJuegos</h1>
          
          {!loading && !error && (
            <div className="filters-container">
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${sortType === 'price-asc' ? 'active' : ''}`}
                  onClick={() => handleSortChange('price-asc')}
                >
                  💰 Menor a Mayor
                </button>
                <button 
                  className={`filter-btn ${sortType === 'alphabetical' ? 'active' : ''}`}
                  onClick={() => handleSortChange('alphabetical')}
                >
                  🔤 A a la Z
                </button>
                <button 
                  className={`filter-btn ${sortType === 'random' ? 'active' : ''}`}
                  onClick={() => handleSortChange('random')}
                >
                  🎲 Aleatorio
                </button>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="loading-state">
              <p>Cargando catálogo desde Cosmos DB...</p>
            </div>
          )}

          {error && (
            <div className="error-message" style={{ color: 'red', textAlign: 'center' }}>
              <p>{error}</p>
              <button onClick={fetchData}>Reintentar</button>
            </div>
          )}

          {!loading && !error && (
            <div className="product-grid">
              {productos.length === 0 ? (
                <p>No hay productos en el contenedor de Cosmos.</p>
              ) : (
                productos.map((prod) => (
                  <ProductCard 
                    key={prod.id}
                    id={prod.id}
                    // Mapeo flexible por si los nombres en Cosmos varían
                    name={prod.name || prod.titulo || 'Sin nombre'}
                    image={prod.image || prod.img || prod.url}
                    price={prod.price || prod.precio || 0}
                    quantity={getQuantity(prod.id)}
                    isFavorite={isFavorite(prod.id)}
                    onQuantityChange={handleQuantityChange}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}