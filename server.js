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

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('============================================');
  console.log(`📡 BACKEND LISTO: http://localhost:${PORT}`);
  console.log(`🎮 LISTO PARA RECIBIR PETICIONES DE REACT`);
  console.log('============================================');
});