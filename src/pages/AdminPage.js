import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import { todosLosProductos } from '../data/products';

export default function AdminPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/login');
      return;
    }

    const saved = localStorage.getItem('adminProducts');
    if (saved) setProducts(JSON.parse(saved));
    else setProducts(todosLosProductos.map((p, i) => ({ id: i + 1, name: p.name, image: p.image })));
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('adminProducts', JSON.stringify(products));
  }, [products]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName) return;
    const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const p = { id, name: newName, image: newImage || '' };
    setProducts([p, ...products]);
    setNewName('');
    setNewImage('');
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleEdit = (id, field, value) => {
    setProducts(products.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <button className="admin-logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <section className="admin-add">
        <h3>Agregar producto</h3>
        <form onSubmit={handleAdd} className="admin-add-form">
          <input placeholder="Nombre" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input placeholder="URL imagen (opcional)" value={newImage} onChange={(e) => setNewImage(e.target.value)} />
          <button className="admin-btn" type="submit">Agregar</button>
        </form>
      </section>

      <section className="admin-list">
        <h3>Productos ({products.length})</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <input value={p.name} onChange={(e) => handleEdit(p.id, 'name', e.target.value)} />
                </td>
                <td>
                  <input value={p.image} onChange={(e) => handleEdit(p.id, 'image', e.target.value)} />
                </td>
                <td>
                  <button className="admin-btn admin-delete" onClick={() => handleDelete(p.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
