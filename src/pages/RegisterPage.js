import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/LoginPage.css';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_V2_SITE_KEY || '';
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setCaptchaError('');

    if (!recaptchaSiteKey) {
      setCaptchaError('Falta configurar REACT_APP_RECAPTCHA_V2_SITE_KEY en .env.local');
      return;
    }

    if (!captchaToken) {
      setCaptchaError('Completa la casilla de reCAPTCHA antes de continuar.');
      return;
    }

    setLoading(true);

    try {
      // Crear usuario en Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, contrasena);
      const user = result.user;

      // Actualizar displayName
      await updateProfile(user, { displayName: `${nombre} ${apellido}` });

      // Guardar datos del usuario en Firestore (sin marcar como verificado aún)
      await setDoc(doc(db, 'users', user.uid), {
        email,
        nombre,
        apellido,
        telefono,
        emailVerified: false,
        recaptchaToken: captchaToken,
        createdAt: new Date().toISOString(),
      });

      // Verificación nativa de Firebase Auth (sin Cloud Functions / Blaze)
      await sendEmailVerification(user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });

      await signOut(auth);

      alert('Cuenta creada. Te enviamos un enlace de verificación a tu correo. Veríficalo antes de iniciar sesión.');
      navigate('/login');

    } catch (error) {
      console.error('Error al crear cuenta', error);
      alert(`Error en registro: ${error.code || 'UNKNOWN'} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Crear una cuenta</h1>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              type="text"
              required
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Número de teléfono</label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
            Este sitio está protegido por reCAPTCHA y se aplican la
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"> Política de privacidad</a> y
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer"> Términos de servicio</a> de Google.
          </p>

          <div style={{ marginBottom: '15px' }}>
            <ReCAPTCHA
              sitekey={recaptchaSiteKey}
              onChange={(token) => {
                setCaptchaToken(token || '');
                if (token) {
                  setCaptchaError('');
                }
              }}
              onExpired={() => {
                setCaptchaToken('');
              }}
            />
          </div>

          {captchaError && (
            <p style={{ color: '#d32f2f', fontSize: '12px', marginBottom: '12px' }}>
              {captchaError}
            </p>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear una cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
