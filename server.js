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
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

// Endpoint para crear sesión de Stripe Checkout
app.post('/create-checkout-session', async (req, res) => {
  console.log("💳 Petición recibida en /create-checkout-session");
  
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No hay productos en el carrito' });
    }

    // Convertir los items del carrito al formato de Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/carrito`,
    });

    console.log(`✅ Sesión de Stripe creada: ${session.id}`);
    res.json({ id: session.id, url: session.url });
    
  } catch (error) {
    console.error("❌ ERROR AL CREAR SESIÓN DE STRIPE:");
    console.error(`Mensaje: ${error.message}`);
    res.status(500).json({ 
      error: "Error al crear sesión de pago",
      details: error.message 
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