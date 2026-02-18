import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, contrasena);
      const user = result.user;
      // Actualizar displayName
      await updateProfile(user, { displayName: `${nombre} ${apellido}` });
      // Guardar teléfono en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        nombre,
        apellido,
        telefono,
        createdAt: new Date().toISOString(),
      });
      alert('Registro exitoso. Bienvenido ' + (user.displayName || email));
      navigate('/');
    } catch (error) {
      console.error('Error al crear cuenta', error);
      alert(`Error en registro: ${error.code} - ${error.message}`);
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

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear una cuenta'}
          </button>
        </form>

        <div style={{ marginTop: 12 }}>
          <p>o crea una cuenta con</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-google" onClick={() => alert('Usa Google en la pantalla de login')}>Google</button>
            <button className="btn-google" onClick={() => alert('Social no implementado')}>Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
}
