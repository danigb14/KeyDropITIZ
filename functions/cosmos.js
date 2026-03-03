// functions/cosmos.js
// Módulo para interactuar con Azure Cosmos DB NoSQL

require('dotenv').config();
const { CosmosClient } = require('@azure/cosmos');

// Configuración del cliente con variables de entorno
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

if (!endpoint || !key) {
  console.error("❌ ERROR: Faltan variables de entorno COSMOS_ENDPOINT o COSMOS_KEY");
}

const client = new CosmosClient({ endpoint, key });

async function fetchProductos() {
  try {
    const databaseId = process.env.COSMOS_DATABASE;
    const containerId = process.env.COSMOS_CONTAINER;

    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Consulta SQL para obtener todos los ítems
    const querySpec = {
      query: "SELECT * FROM c"
    };

    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();

    console.log(`📦 Cosmos DB: Se recuperaron ${items.length} elementos.`);
    return items;

  } catch (error) {
    console.error("❌ Error al consultar Cosmos DB:", error.message);
    throw error; // Re-lanzamos el error para que server.js lo capture
  }
}

module.exports = {
  fetchProductos,
};