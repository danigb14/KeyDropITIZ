// server.js
// 1. Parche para Node.js v18 (Soluciona el error 'crypto is not defined')
if (typeof global.crypto === 'undefined') {
  global.crypto = require('node:crypto');
}

// 2. Carga de variables de entorno
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { fetchProductos } = require('./functions/cosmos');
const Stripe = require('stripe');

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); // Permite que tu React (puerto 3000) se comunique con este servidor
app.use(express.json());

// --- RUTAS ---

// Ruta base para verificar que el servidor corre
app.get('/', (req, res) => {
  res.send('🚀 Servidor de KeyDrop activo y conectado a Cosmos DB');
});

// Endpoint que consume tu React
app.get('/getProductos', async (req, res) => {
  console.log("📥 Petición recibida en /getProductos");
  
  try {
    const productos = await fetchProductos();
    
    if (!productos || productos.length === 0) {
      console.warn("⚠️ Cosmos DB respondió pero el contenedor parece estar vacío.");
      return res.json([]);
    }

    console.log(`✅ Éxito: Se enviaron ${productos.length} productos al frontend.`);
    res.json(productos);
    
  } catch (error) {
    console.error("❌ ERROR EN LA CONEXIÓN A AZURE:");
    console.error(`Mensaje: ${error.message}`);
    
    // Si el error es de autenticación (llave incorrecta)
    if (error.message.includes("401")) {
      console.error("🔑 Tip: Revisa que tu COSMOS_KEY en el .env sea la correcta.");
    }
    
    res.status(500).json({ 
      error: "Error al obtener datos de Azure Cosmos DB",
      details: error.message 
    });
  }
});

app.get('/api/admin/stripe-dashboard', async (req, res) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return res.status(500).json({
        error: 'Falta STRIPE_SECRET_KEY en variables de entorno',
      });
    }

    const stripe = new Stripe(stripeSecretKey);
    const days = Number(req.query.days) > 0 ? Number(req.query.days) : 30;
    const since = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);

    const [balance, charges, paymentIntents, customers, subscriptions] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.charges.list({ limit: 100, created: { gte: since } }),
      stripe.paymentIntents.list({ limit: 20, created: { gte: since } }),
      stripe.customers.list({ limit: 100, created: { gte: since } }),
      stripe.subscriptions.list({ limit: 100, status: 'all' }),
    ]);

    const succeededCharges = charges.data.filter((c) => c.status === 'succeeded');
    const failedCharges = charges.data.filter((c) => c.status === 'failed');

    const grossAmount = succeededCharges.reduce((sum, c) => sum + (c.amount || 0), 0);
    const refundedAmount = succeededCharges.reduce((sum, c) => sum + (c.amount_refunded || 0), 0);
    const availableBalance = (balance.available || []).reduce((sum, b) => sum + (b.amount || 0), 0);
    const pendingBalance = (balance.pending || []).reduce((sum, b) => sum + (b.amount || 0), 0);
    const activeSubscriptions = subscriptions.data.filter((s) => s.status === 'active').length;

    const currency =
      (balance.available && balance.available[0] && balance.available[0].currency) ||
      (succeededCharges[0] && succeededCharges[0].currency) ||
      'usd';

    const recentPayments = paymentIntents.data.map((pi) => ({
      id: pi.id,
      amount: (pi.amount_received || pi.amount || 0) / 100,
      currency: pi.currency || currency,
      status: pi.status,
      customer: typeof pi.customer === 'string' ? pi.customer : (pi.customer && pi.customer.id) || 'Sin cliente',
      created: pi.created,
      livemode: pi.livemode,
    }));

    res.json({
      generatedAt: Math.floor(Date.now() / 1000),
      periodDays: days,
      currency,
      kpis: {
        grossVolume: grossAmount / 100,
        refundedVolume: refundedAmount / 100,
        netVolume: (grossAmount - refundedAmount) / 100,
        successfulCharges: succeededCharges.length,
        failedCharges: failedCharges.length,
        newCustomers: customers.data.length,
        activeSubscriptions,
        availableBalance: availableBalance / 100,
        pendingBalance: pendingBalance / 100,
      },
      recentPayments,
    });
  } catch (error) {
    console.error('❌ Error al obtener dashboard de Stripe:', error.message);
    res.status(500).json({
      error: 'No se pudo obtener dashboard de Stripe',
      details: error.message,
    });
  }
});

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('============================================');
  console.log(`📡 BACKEND LISTO: http://localhost:${PORT}`);
  console.log(`🎮 LISTO PARA RECIBIR PETICIONES DE REACT`);
  console.log('============================================');
});


