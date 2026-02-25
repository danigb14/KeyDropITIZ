import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/logo.png';

export default function Header() {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    const last = localStorage.getItem('lastFooterRoute');
    if (last) navigate(last);
    else navigate('/');
  };

  const handleConocenosClick = () => {
    const footer = document.getElementById('site-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth' });
    else {
      // Fallback: intentar navegar a la raíz si no existe el footer en esta ruta
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="logo-link" onClick={handleLogoClick} aria-label="Logo">
          <img className="logo" src={logo} alt="Logo" />
        </button>
      </div>
      <div className="header-right">
        <Link to="/productos" className="nav-link">PRODUCTOS</Link>
        <button className="nav-link header-conocenos" onClick={handleConocenosClick}>ABOUT US</button>
        <button className="header-icon-btn" aria-label="Carrito">
          🛒
        </button>
      </div>
    </header>
  );
}
