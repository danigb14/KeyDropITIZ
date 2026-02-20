import React, { useEffect } from 'react';
import '../styles/InfoPages.css';

export default function UbicacionPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mapLocation = 'https://maps.google.com/?q=Av.+Telecomunicaciones,+Colonia+Chinampac+de+Juarez,+Ciudad+de+México,+09208';

  return (
    <div className="info-page">
      <div className="info-container">
        <h1>Ubicación</h1>
        
        <div className="info-content">
          <section className="location-section">
            <h2>Instituto Tecnológico de Iztapalapa</h2>
            
            <div className="location-details">
              <div className="location-info">
                <div className="info-item">
                  <h3>📍 Dirección</h3>
                  <p>Av. Telecomunicaciones, S/N</p>
                  <p>Colonia Chinampac de Juárez</p>
                  <p>Ciudad de México</p>
                  <p><strong>Código Postal: 09208</strong></p>
                </div>

                <div className="info-item">
                  <h3>🕐 Horario de Atención</h3>
                  <p><strong>Lunes a Viernes:</strong> 9:00 AM - 5:00 PM</p>
                  <p><strong>Sábado y Domingo:</strong> Cerrado</p>
                  <p className="note">Disponible en línea 24/7</p>
                </div>

                <div className="info-item">
                  <h3>📧 Contacto</h3>
                  <p>
                    <a href="mailto:keydropvideojuegos@gmail.com">
                      keydropvideojuegos@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="map-container">
                <iframe
                  title="Google Maps - Instituto Tecnológico de Iztapalapa"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.7421416600773!2d-99.05548712570213!3d19.38031478188793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fd0614558e4b%3A0x3760847a107a0b9f!2sTecNM%20%7C%20Tecnol%C3%B3gico%20Nacional%20de%20M%C3%A9xico%20Campus%20Iztapalapa!5e0!3m2!1ses!2smx!4v1771613390780!5m2!1ses!2smx"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="map-button-container">
              <a 
                href={mapLocation}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-maps-large"
              >
                📍 Abrir en Google Maps
              </a>
            </div>

            <section className="directions-section">
              <h2>Cómo Llegar</h2>
              
              <div className="directions-grid">
                <div className="direction-item">
                  <h3>🚇 Este de Metro</h3>
                  <p>
                    Estación: <strong>Guelatao</strong> (Línea A)<br/>
                    A 800 metros del Instituto
                  </p>
                </div>

                <div className="direction-item">
                  <h3>🚌 Por Autobús</h3>
                  <p>
                    Líneas disponibles:<br/>
                    <strong>52, 88, 133</strong><br/>
                    Parada: Av. Telecomunicaciones
                  </p>
                </div>

                <div className="direction-item">
                  <h3>🚗 Por Auto</h3>
                  <p>
                    ✓ Estacionamiento disponible dentro del Instituto
                  </p>
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
