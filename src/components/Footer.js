import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>
            KeyDrop es un proyecto escolar innovador dedicado a la venta de códigos de videojuegos.
          </p>
          <Link to="/about_us" className="btn-footer-link">
            Conoce más →
          </Link>
        </div>

        <div className="footer-section">
          <h4>Ubicación</h4>
          <p>Instituto Tecnológico de Iztapalapa</p>
          <Link to="/ubicacion" className="btn-footer-link">
            Ver ubicación y mapa →
          </Link>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <p>¿Preguntas? Envíanos un mensaje.</p>
          <Link to="/contacto" className="btn-footer-link">
            Ir al formulario de contacto →
          </Link>
        </div>
      </div>

      <div className="social-links-footer">
        <a
          href="https://www.facebook.com/share/1D9epsBCJ3/"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
        >
          📘
        </a>
        <a
          href="https://www.instagram.com/keydropvideojuegos?igsh=dzhjaTlrdzRnMzlh"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
        >
          📷
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Twitter/X"
        >
          𝕏
        </a>
        <a href="mailto:keydropvideojuegos@gmail.com" title="Email">
          📧
        </a>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} KEYDROP - Instituto Tecnológico de Iztapalapa</p>
      </div>
    </footer>
  );
}
