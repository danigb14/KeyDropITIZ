import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import '../src/styles/App.css';

// initialize firebase configuration
import './firebase';

import logo from './assets/logo.png';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import Footer from './components/Footer';

// --- COMPONENTES (Header) ---
// Nota: Eventualmente es mejor mover estos a archivos separados en src/components/

const Header = () => (
  <header className="header">
    <div className="header-left">
      <Link to="/" className="logo-link">
        <img className="logo" src={logo} alt="Logo" />
      </Link>
    </div>
    <div className="header-right">
      <Link to="/productos" className="nav-link">PRODUCTOS</Link>
      <button className="header-icon-btn" aria-label="Carrito">
        🛒
      </button>
      <button className="header-icon-btn user-btn" aria-label="Cuenta">
        👤
      </button>
    </div>
  </header>
);


// --- APP PRINCIPAL ---

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        
        {/* Contenido Principal */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;