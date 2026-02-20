import React, { useState, useEffect } from 'react';
import '../styles/InfoPages.css';

export default function ContactoPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      // Limpiar estado al desmontar
    };
  }, []);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [formStatus, setFormStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.email && formData.asunto && formData.mensaje) {
      console.log('Datos de contacto:', formData);
      setFormStatus('success');
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
      setTimeout(() => {
        setFormStatus('');
      }, 5000);
    } else {
      setFormStatus('error');
    }
  };

  return (
    <div className="info-page">
      <div className="info-container">
        <h1>Contacto</h1>
        
        <div className="info-content">
          <section className="contact-section">
            <div className="contact-grid">
              {/* Información de Contacto */}
              <div className="contact-info">
                <h2>Información de Contacto</h2>

                <div className="contact-item">
                  <h3>📧 Email</h3>
                  <a href="mailto:keydropvideojuegos@gmail.com">
                    keydropvideojuegos@gmail.com
                  </a>
                </div>

                <div className="contact-item">
                  <h3>📍 Ubicación</h3>
                  <p>Instituto Tecnológico de Iztapalapa</p>
                  <p>Av. Telecomunicaciones, S/N</p>
                  <p>Ciudad de México, CP: 09208</p>
                </div>

                <div className="contact-item">
                  <h3>🕐 Horario</h3>
                  <p><strong>Lunes a Viernes:</strong> 9:00 AM - 5:00 PM</p>
                  <p><strong>Chat en línea:</strong> 24/7</p>
                </div>

                <div className="contact-item">
                  <h3>📱 Redes Sociales</h3>
                  <div className="social-links-contact">
                    <a 
                      href="https://www.facebook.com/share/1D9epsBCJ3/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📘 Facebook
                    </a>
                    <a 
                      href="https://www.instagram.com/keydropvideojuegos?igsh=dzhjaTlrdzRnMzlh"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📷 Instagram
                    </a>
                    <a 
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      𝕏 Twitter/X
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulario de Contacto */}
              <div className="contact-form-container">
                <h2>Envíanos un Mensaje</h2>
                <p className="form-description">
                  Completa el siguiente formulario y nos pondremos en contacto contigo lo antes posible.
                </p>

                <form onSubmit={handleSubmitForm} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="(+52) 555-1234"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="asunto">Asunto *</label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleInputChange}
                      placeholder="¿Cuál es tu consulta?"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mensaje">Mensaje *</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos más detalles..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  {formStatus === 'success' && (
                    <div className="form-status success">
                      ✓ Mensaje enviado correctamente. Nos pondremos en contacto pronto.
                    </div>
                  )}

                  {formStatus === 'error' && (
                    <div className="form-status error">
                      ✕ Por favor completa todos los campos obligatorios (*).
                    </div>
                  )}

                  <button type="submit" className="submit-btn">
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
