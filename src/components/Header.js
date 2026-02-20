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

  return (
    <header className="header">
      <div className="header-left">
        <button className="logo-link" onClick={handleLogoClick} aria-label="Logo">
          <img className="logo" src={logo} alt="Logo" />
        </button>
      </div>
      <div className="header-right">
        <Link to="/productos" className="nav-link">PRODUCTOS</Link>
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
}
