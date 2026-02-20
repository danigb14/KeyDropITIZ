import React, { useEffect } from 'react';
import '../styles/InfoPages.css';

export default function AboutUsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="info-page">
      <div className="info-container">
        <h1>About Us</h1>
        
        <div className="info-content">
          <section className="about-section">
            <h2>¿Quiénes Somos?</h2>
            <p>
              <strong>KeyDrop</strong> es un proyecto escolar innovador desarrollado por estudiantes 
              del <strong>Instituto Tecnológico de Iztapalapa</strong>, dedicado a la venta de códigos 
              de videojuegos. Combinamos educación y tecnología para crear una plataforma digital moderna.
            </p>
          </section>

          <section className="about-section">
            <h2>Nuestra Misión</h2>
            <p>
              Ofrecer una plataforma segura, confiable y fácil de usar para la distribución de códigos 
              de videojuegos. Proporcionamos entregas rápidas y una experiencia excepcional, permitiendo 
              que nuestros usuarios disfruten sus juegos favoritos de forma fácil y accesible.
            </p>
          </section>

          <section className="about-section">
            <h2>Nuestra Visión</h2>
            <p>
              Ser la plataforma preferida en México para la compra y distribución de códigos de videojuegos,
              distinguiéndonos por nuestra calidad, seguridad y atención al cliente. Queremos demostrar que
              los proyectos estudiantiles pueden competir con soluciones profesionales de alto nivel.
            </p>
          </section>

          <section className="about-section">
            <h2>Valores Clave</h2>
            <ul className="values-list">
              <li>
                <strong>Seguridad:</strong> Proteges tus datos y transacciones con la máxima confidencialidad.
              </li>
              <li>
                <strong>Confiabilidad:</strong> Garantizamos entrega efectiva de tus códigos sin demoras.
              </li>
              <li>
                <strong>Innovación:</strong> Utilizamos tecnología de punta para mejorar continuamente.
              </li>
              <li>
                <strong>Servicio al Cliente:</strong> Tu satisfacción es nuestra prioridad principal.
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Nuestra Historia</h2>
            <p>
              KeyDrop nació como un proyecto académico en el Instituto Tecnológico de Iztapalapa,
              donde un equipo de estudiantes apasionados por los videojuegos y la tecnología decidieron
              crear una solución que facilitara el acceso a códigos de juegos en México. Lo que comenzó
              como un proyecto escolar se ha convertido en una plataforma funcional y confiable.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
