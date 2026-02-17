import React from 'react';
import '../styles/ProductsPage.css';
import '../styles/components.css';
import { todosLosProductos } from '../data/products';

const ProductCard = ({ name, image }) => (
  <div className="product-card">
    <img src={image} alt={name} />
    <div className="product-label">{name}</div>
  </div>
);

export default function ProductsPage() {
  return (
    <div className="app-container">
      <main className="main-content">
        <section className="featured-section">
          <h1 className="featured-title">Todos los VideoJuegos</h1>
          <div className="product-grid">
            {todosLosProductos.map((prod, index) => (
              <ProductCard key={index} name={prod.name} image={prod.image} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
