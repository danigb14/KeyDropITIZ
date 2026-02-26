import React from 'react';
import { Link } from 'react-router-dom';
import footerIcons from '../data/footerIcons';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            KeyDrop es un proyecto escolar innovador dedicado a la venta de códigos de videojuegos.
          </p>
          <Link
            to="/about_us"
            className="btn-footer-link"
            onClick={() => localStorage.setItem('lastFooterRoute', '/about_us')}
          >
            Conoce más →
          </Link>
        </div>

        <div className="footer-section">
          <h4>Ubicación</h4>
          <p>Instituto Tecnológico de Iztapalapa</p>
          <Link
            to="/ubicacion"
            className="btn-footer-link"
            onClick={() => localStorage.setItem('lastFooterRoute', '/ubicacion')}
          >
            Ver ubicación y mapa →
          </Link>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>¿Preguntas? Envíanos un mensaje.</p>
          <Link
            to="/contacto"
            className="btn-footer-link"
            onClick={() => localStorage.setItem('lastFooterRoute', '/contacto')}
          >
            Ir al formulario de contacto →
          </Link>
        </div>
      </div>

      <div className="social-links-footer">
        {footerIcons.map((icon) => (
          <a
            key={icon.id}
            href={icon.href}
            target={icon.href.startsWith('http') ? '_blank' : undefined}
            rel={icon.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            title={icon.label}
            aria-label={icon.label}
          >
            <img className="footer-social-icon" src={icon.icon} alt={icon.label} />
          </a>
        ))}
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} KEYDROP - Instituto Tecnológico de Iztapalapa</p>
      </div>
    </footer>
  );
}
