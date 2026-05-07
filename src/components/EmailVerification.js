import React, { useState, useEffect } from 'react';
import '../styles/LoginPage.css';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export default function EmailVerification({ email, nombre, onVerified, onCancel }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const verifyEmailFunction = httpsCallable(functions, 'verifyEmail');
      const result = await verifyEmailFunction({ email, code });

      if (result.data.success) {
        alert('¡Correo verificado correctamente!');
        onVerified();
      }
    } catch (err) {
      console.error('Error de verificación:', err);
      setError(err.message || 'Error en la verificación del código');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);

    try {
      const resendFunction = httpsCallable(functions, 'resendVerificationEmail');
      const result = await resendFunction({ email, nombre });

      if (result.data.success) {
        alert('Nuevo código enviado al correo');
        setTimeLeft(600); // Reiniciar timer
        setShowResend(false);
        setCode('');
      }
    } catch (err) {
      console.error('Error al reenviar:', err);
      setError(err.message || 'Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Verificar correo electrónico</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Se ha enviado un código de verificación a: <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="code">Código de verificación</label>
            <input
              id="code"
              type="text"
              maxLength="6"
              placeholder="123456"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            {!showResend && (
              <p style={{ fontSize: '14px', color: '#666' }}>
                Código expira en: <strong>{formatTime(timeLeft)}</strong>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading || code.length !== 6}
          >
            {loading ? 'Verificando...' : 'Verificar código'}
          </button>
        </form>

        {showResend && (
          <button
            onClick={handleResend}
            className="btn-login"
            style={{ marginTop: '10px', backgroundColor: '#666' }}
            disabled={loading}
          >
            {loading ? 'Reenviando...' : 'Reenviar código'}
          </button>
        )}

        <button
          onClick={onCancel}
          className="btn-login"
          style={{ marginTop: '10px', backgroundColor: '#999' }}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
