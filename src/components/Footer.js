import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Quiénes Somos</h4>
          <p>
            Somos una tienda digital dedicada a la venta de códigos de videojuegos,
            ofrecemos entregas rápidas, seguras y confiables. 
            Nuestro compromiso es brindar la mejor experiencia para que disfrutes
            tus juegos favoritos de forma fácil y accesible.
          </p>
        </div>

        <div className="footer-section">
          <h4>Ubicación</h4>
          <p>Av. Telecomunicaciones, S/N </p>
          <p>Colonia Chinampac de Juarez, Ciudad de México</p>
          <p>CP: 09208</p>
        </div>

        <div className="footer-section">
          <h4>Contáctanos</h4>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter/X
            </a>
            <a href="mailto:info@miempresa.com">Email</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} KEYDROP</p>
      </div>
    </footer>
  );
}
