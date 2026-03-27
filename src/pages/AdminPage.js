import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import { todosLosProductos } from '../data/products';

export default function AdminPage() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_FUNCTIONS_URL || 'http://localhost:3001';
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState('');
  const [stripeData, setStripeData] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState('');

  const buildStripeDashboardUrl = () => {
    const base = API_URL.replace(/\/$/, '');
    const normalizedBase = base.endsWith('/api') ? base.slice(0, -4) : base;
    return `${normalizedBase}/api/admin/stripe-dashboard?days=30`;
  };

  const fetchStripeDashboard = async () => {
    setStripeLoading(true);
    setStripeError('');

    try {
      let response = await fetch(buildStripeDashboardUrl());

      if (!response.ok && response.status === 404 && window.location.hostname === 'localhost') {
        response = await fetch('http://localhost:3001/api/admin/stripe-dashboard?days=30');
      }

      const contentType = response.headers.get('content-type') || '';

      if (!contentType.includes('application/json')) {
        const raw = await response.text();
        const shortPreview = raw.slice(0, 120).replace(/\s+/g, ' ').trim();
        throw new Error(`El backend no devolvio JSON. Revisa REACT_APP_FUNCTIONS_URL. Respuesta: ${shortPreview}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo cargar el dashboard de Stripe');
      }

      setStripeData(data);
    } catch (error) {
      setStripeError(error.message || 'Error cargando Stripe');
    } finally {
      setStripeLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'usd') => (
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount || 0)
  );

  const formatDate = (unixTime) => (
    new Date(unixTime * 1000).toLocaleString('es-CL')
  );

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/admin/login');
      return;
    }

    const saved = localStorage.getItem('adminProducts');
    if (saved) setProducts(JSON.parse(saved));
    else setProducts(todosLosProductos.map((p, i) => ({ id: i + 1, name: p.name, image: p.image })));

    fetchStripeDashboard();
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
    navigate('/admin/login');
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

      <section className="admin-stripe">
        <div className="admin-stripe-head">
          <h3>Stripe Dashboard en Admin</h3>
          <button type="button" className="admin-btn" onClick={fetchStripeDashboard} disabled={stripeLoading}>
            {stripeLoading ? 'Actualizando...' : 'Actualizar métricas'}
          </button>
        </div>

        {stripeError && <p className="admin-error">{stripeError}</p>}

        {!stripeError && !stripeData && stripeLoading && (
          <p className="admin-stripe-note">Cargando dashboard de Stripe...</p>
        )}

        {!stripeError && stripeData && (
          <>
            <p className="admin-stripe-note">
              Última actualización: {formatDate(stripeData.generatedAt)} | Período: últimos {stripeData.periodDays} días
            </p>

            <div className="admin-kpi-grid">
              <article className="admin-kpi-card">
                <h4>Ventas Brutas</h4>
                <strong>{formatCurrency(stripeData.kpis.grossVolume, stripeData.currency)}</strong>
              </article>
              <article className="admin-kpi-card">
                <h4>Reembolsos</h4>
                <strong>{formatCurrency(stripeData.kpis.refundedVolume, stripeData.currency)}</strong>
              </article>
              <article className="admin-kpi-card">
                <h4>Ventas Netas</h4>
                <strong>{formatCurrency(stripeData.kpis.netVolume, stripeData.currency)}</strong>
              </article>
              <article className="admin-kpi-card">
                <h4>Cobros Exitosos</h4>
                <strong>{stripeData.kpis.successfulCharges}</strong>
              </article>
              <article className="admin-kpi-card">
                <h4>Cobros Fallidos</h4>
                <strong>{stripeData.kpis.failedCharges}</strong>
              </article>
              <article className="admin-kpi-card">
                <h4>Clientes Nuevos</h4>
                <strong>{stripeData.kpis.newCustomers}</strong>
              </article>
              <article className="admin-kpi-card">
                <h4>Suscripciones Activas</h4>
                <strong>{stripeData.kpis.activeSubscriptions}</strong>
              </article>
              <article className="admin-kpi-card">
                <h4>Balance Disponible</h4>
                <strong>{formatCurrency(stripeData.kpis.availableBalance, stripeData.currency)}</strong>
              </article>
              <article className="admin-kpi-card">
                <h4>Balance Pendiente</h4>
                <strong>{formatCurrency(stripeData.kpis.pendingBalance, stripeData.currency)}</strong>
              </article>
            </div>

            <div className="admin-payments-block">
              <h4>Pagos recientes</h4>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Modo</th>
                  </tr>
                </thead>
                <tbody>
                  {stripeData.recentPayments.length === 0 && (
                    <tr>
                      <td colSpan="6">No hay pagos recientes.</td>
                    </tr>
                  )}
                  {stripeData.recentPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{formatCurrency(payment.amount, payment.currency)}</td>
                      <td>{payment.status}</td>
                      <td>{payment.customer}</td>
                      <td>{formatDate(payment.created)}</td>
                      <td>{payment.livemode ? 'Live' : 'Test'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
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
