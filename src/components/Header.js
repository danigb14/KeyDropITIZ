import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/logo.png';

export default function Header() {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/login');
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
