import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useDarkMode } from '../context/DarkModeContext';
import '../styles/AccessibilityPanel.css';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    highContrast,
    toggleHighContrast,
    voiceEnabled,
    toggleVoice,
    voiceLang,
    setVoiceLang,
    voiceRate,
    setVoiceRate,
    speak,
    stopSpeech,
  } = useAccessibility();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleReadPage = () => {
    const pageText = document.body.innerText;
    if (pageText) {
      speak(pageText.substring(0, 5000)); // Limitar a 5000 caracteres
    }
  };

  return (
    <>
      {/* Boton en header */}
      <button
        className="header-icon-btn accessibility-header-btn"
        onClick={togglePanel}
        aria-label="Abrir panel de accesibilidad"
        title="Accesibilidad"
      >
        ♿
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="accessibility-panel">
          <div className="accessibility-header">
            <h2>Accesibilidad</h2>
            <button
              className="close-btn"
              onClick={togglePanel}
              aria-label="Cerrar panel"
            >
              ✕
            </button>
          </div>

          <div className="accessibility-content">
            {/* Modo Oscuro */}
            <section className="accessibility-section">
              <h3>🌙 Modo Oscuro</h3>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  aria-label="Activar modo oscuro"
                />
                <span>Activar Modo Oscuro</span>
              </label>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {isDarkMode ? '✓ Modo oscuro activo' : 'Modo claro activo'}
              </p>
            </section>

            {/* Tamaño de Letra */}
            <section className="accessibility-section">
              <h3>📝 Tamaño de Letra</h3>
              <div className="font-size-controls">
                <button
                  className="control-btn"
                  onClick={decreaseFontSize}
                  aria-label="Disminuir tamaño"
                  title="Menos"
                >
                  A−
                </button>
                <span className="font-size-display">{fontSize}%</span>
                <button
                  className="control-btn"
                  onClick={increaseFontSize}
                  aria-label="Aumentar tamaño"
                  title="Más"
                >
                  A+
                </button>
                <button
                  className="reset-btn"
                  onClick={resetFontSize}
                  aria-label="Restablecer tamaño"
                >
                  Restablecer
                </button>
              </div>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Tamaño actual: {fontSize}%
              </p>
            </section>

            {/* Contraste */}
            <section className="accessibility-section">
              <h3>🎨 Contraste</h3>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={toggleHighContrast}
                  aria-label="Activar alto contraste"
                />
                <span>Contraste Alto</span>
              </label>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {highContrast ? '✓ Contraste alto activo' : 'Contraste normal'}
              </p>
            </section>

            {/* Lectura de Voz */}
            <section className="accessibility-section">
              <h3>🔊 Lectura de Voz</h3>
              
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={toggleVoice}
                  aria-label="Activar lectura de voz"
                />
                <span>Activar Lectura</span>
              </label>

              {voiceEnabled && (
                <>
                  <div className="voice-controls">
                    <label htmlFor="voice-lang">Idioma:</label>
                    <select
                      id="voice-lang"
                      value={voiceLang}
                      onChange={(e) => setVoiceLang(e.target.value)}
                      className="voice-select"
                    >
                      <option value="es-ES">Español (España)</option>
                      <option value="es-MX">Español (México)</option>
                      <option value="en-US">English (USA)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="fr-FR">Français</option>
                      <option value="de-DE">Deutsch</option>
                    </select>
                  </div>

                  <div className="voice-controls">
                    <label htmlFor="voice-rate">
                      Velocidad: {voiceRate.toFixed(1)}x
                    </label>
                    <input
                      id="voice-rate"
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceRate}
                      onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                      className="voice-slider"
                    />
                  </div>

                  <button
                    className="read-btn"
                    onClick={handleReadPage}
                    aria-label="Leer página"
                  >
                    🔊 Leer esta página
                  </button>

                  <button
                    className="stop-btn"
                    onClick={stopSpeech}
                    aria-label="Detener lectura"
                  >
                    ⏹ Detener
                  </button>
                </>
              )}
            </section>

            {/* Información */}
            <section className="accessibility-section">
              <p className="accessibility-info">
                💡 Estas configuraciones se guardan automáticamente en tu navegador.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="accessibility-overlay"
          onClick={togglePanel}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AccessibilityPanel;
