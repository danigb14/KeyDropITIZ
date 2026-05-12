import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('keyDropFontSize');
    return saved ? parseInt(saved) : 100;
  });

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('keyDropHighContrast');
    return saved ? JSON.parse(saved) : false;
  });

  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('keyDropVoiceEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  const [voiceLang, setVoiceLang] = useState(() => {
    const saved = localStorage.getItem('keyDropVoiceLang');
    return saved || 'es-ES';
  });

  const [voiceRate, setVoiceRate] = useState(() => {
    const saved = localStorage.getItem('keyDropVoiceRate');
    return saved ? parseFloat(saved) : 1;
  });

  // Guardar fontSize
  useEffect(() => {
    localStorage.setItem('keyDropFontSize', fontSize.toString());
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  // Guardar highContrast
  useEffect(() => {
    localStorage.setItem('keyDropHighContrast', JSON.stringify(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Guardar voice settings
  useEffect(() => {
    localStorage.setItem('keyDropVoiceEnabled', JSON.stringify(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem('keyDropVoiceLang', voiceLang);
  }, [voiceLang]);

  useEffect(() => {
    localStorage.setItem('keyDropVoiceRate', voiceRate.toString());
  }, [voiceRate]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancelar cualquier lectura anterior
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      utterance.rate = voiceRate;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const value = {
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
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
