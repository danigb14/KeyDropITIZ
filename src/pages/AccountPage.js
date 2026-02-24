import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import '../styles/AccountPage.css';

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setImageError(false);
      } else {
        navigate('/', { replace: true });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return <div className="account-container"><p>Cargando...</p></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="account-container">
      <h1>Información de la Cuenta</h1>
      <div className="account-profile-pic">
        {user.photoURL && !imageError ? (
          <img 
            src={user.photoURL} 
            alt="Foto de perfil" 
            className="profile-image"
            onError={handleImageError}
          />
        ) : (
          <div className="profile-avatar">
            {getInitials(user.displayName)}
          </div>
        )}
      </div>
      <div className="account-details">
        <p><strong>Nombre:</strong> {user.displayName || 'No disponible'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
        <p><strong>Email verificado:</strong> {user.emailVerified ? 'Sí' : 'No'}</p>
      </div>
      <button className="btn-logout" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}