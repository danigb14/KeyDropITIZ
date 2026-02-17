import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Conectar con autenticación de Firebase
    console.log('Intentando login con:', { usuario, contrasena });
    alert('Función de login aún en desarrollo');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Iniciar Sesión</h1>

        <form onSubmit={handleLogin}>
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

        {/* Enlaces Adicionales */}
        <div className="login-links">
          <Link to="/forgot-password" className="link-forgot-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

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
