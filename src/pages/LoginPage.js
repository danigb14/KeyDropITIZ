import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Verificar si son credenciales de admin
    const adminEmail = 'keydropadmin@gmail.com';
    const adminPassword = 'Keydrop123';
    
    if (usuario === adminEmail && contrasena === adminPassword) {
      // Es admin
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
      return;
    }
    
    // TODO: Conectar con autenticación de Firebase para usuarios normales
    console.log('Intentando login con:', { usuario, contrasena });
    alert('Función de login aún en desarrollo para usuarios normales');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        // Si el usuario ya está autenticado, redirigir a /cuenta
        setUser(u);
        navigate('/cuenta');
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Usuario autenticado
      const signedUser = result.user;
      setUser(signedUser);
      navigate('/cuenta'); // Redirigir a la página de cuenta
    } catch (error) {
      console.error('Error en Google Sign-In', error);
      alert(`No se pudo iniciar sesión con Google: ${error.code} - ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Iniciar Sesión</h1>

        {user ? (
          <div className="logged-in-box">
            <p>Has iniciado sesión como {user.displayName || user.email}</p>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
          {error && <div className="admin-error" style={{marginBottom: '20px', color: '#e53935'}}>{error}</div>}
          
          {/* Campo Usuario */}
          <div className="form-group">
            <label htmlFor="usuario">Usuario o Email:</label>
            <input
              type="text"
              id="usuario"
              placeholder="Ingresa tu usuario o email"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña:</label>
            <div className="password-input-container">
              <input
                type={mostrarContrasena ? 'text' : 'password'}
                id="contrasena"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
                {mostrarContrasena ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Botón Login */}
          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
          </form>
        )}

        {/* Enlaces Adicionales */}
        <div className="login-links">
          <Link to="/forgot-password" className="link-forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Google Sign-In */}
        {!user && (
          <div className="google-signin">
            <p>O inicia sesión con</p>
            <button className="btn-google" onClick={handleGoogleSignIn}>
              Iniciar sesión con Google
            </button>
          </div>
        )}

        {/* Botón de Google Sign-In */}
        <div className="g-signin2" data-onsuccess="onSignIn"></div>

        {/* Crear Cuenta */}
        <div className="create-account">
          <p>¿No tienes cuenta?</p>
          <Link to="/register" className="link-create-account">
            Crear una cuenta aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
