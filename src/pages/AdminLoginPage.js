import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validEmail = 'keydropadmin@gmail.com';
    const validPass = 'Keydrop123';

    if (email === validEmail && password === validPass) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin — Iniciar sesión</h2>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <div className="admin-error">{error}</div>}

        <button type="submit" className="admin-btn">Entrar</button>
      </form>
    </div>
  );
}
