import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import '../src/styles/App.css';

// initialize firebase configuration
import './firebase';
import { auth } from './firebase';

import logo from './assets/logo.png';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutUsPage';
import UbicacionPage from './pages/UbicacionPage';
import ContactoPage from './pages/ContactoPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import AccountPage from './pages/AccountPage';
import Footer from './components/Footer';

// --- COMPONENTES (Header) ---
// Nota: Eventualmente es mejor mover estos a archivos separados en src/components/

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUserClick = () => {
    if (user) {
      navigate('/cuenta');
    } else {
      navigate('/login');
    }
  };

  const scrollToFooter = () => {
    const footer = document.querySelector('.footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img className="logo" src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="header-right">
        <Link to="/productos" className="nav-link">PRODUCTOS</Link>
        <button 
          className="header-icon-btn" 
          aria-label="Contacto"
          onClick={scrollToFooter}
          title="Ir al footer"
        >
          📧
        </button>
        <button className="header-icon-btn" aria-label="Carrito">
          🛒
        </button>
        <button 
          className="header-icon-btn user-btn" 
          aria-label="Cuenta"
          onClick={handleUserClick}
        >
          👤
        </button>
      </div>
    </header>
  );
};


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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about_us" element={<AboutUsPage />} />
            <Route path="/ubicacion" element={<UbicacionPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/cuenta" element={<AccountPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;