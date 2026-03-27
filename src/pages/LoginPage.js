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
    const normalizedUsuario = usuario.trim().toLowerCase();
    const normalizedContrasena = contrasena.trim();
    
    if (normalizedUsuario === adminEmail && normalizedContrasena === adminPassword) {
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
            <button
              className="btn-google"
              onClick={handleGoogleSignIn}
              aria-label="Iniciar sesión con Google"
              title="Iniciar sesión con Google"
            >
              <svg
                className="google-icon"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M17.64 9.2045c0-.6382-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8427 2.0782-1.7968 2.7155v2.2582h2.9082c1.7027-1.5682 2.6841-3.8795 2.6841-6.6146z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.4673-.8068 5.9564-2.1805l-2.9082-2.2582c-.8068.54-1.8377.8591-3.0482.8591-2.3441 0-4.3282-1.5827-5.0359-3.7091H.9573v2.3327C2.4382 15.9832 5.4818 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.9641 10.7127c-.18-.54-.2823-1.1168-.2823-1.7127s.1023-1.1727.2823-1.7127V4.9545H.9573C.3477 6.1691 0 7.5445 0 9s.3477 2.8309.9573 4.0455l3.0068-2.3328z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.3459l2.5814-2.5814C13.4632.8918 11.4273 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9545l3.0068 2.3328c.7077-2.1264 2.6918-3.7091 5.0359-3.7091z"
                />
              </svg>
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
