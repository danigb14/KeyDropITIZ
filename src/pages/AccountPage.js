import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import '../styles/AccountPage.css';

export default function AccountPage() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="account-container">
      <h1>Información de la Cuenta</h1>
      <div className="account-details">
        <p><strong>Nombre:</strong> {user.displayName || 'No disponible'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
      </div>
    </div>
  );
}