// functions/cosmos.js
// Módulo para interactuar con Azure Cosmos DB

require('dotenv').config(); // carga las variables del .env cuando se ejecuta localmente
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

async function fetchProductos() {
  const db = client.database(process.env.COSMOS_DATABASE);
  const cont = db.container(process.env.COSMOS_CONTAINER);
  const { resources } = await cont.items
    .query('SELECT * FROM c')
    .fetchAll();
  return resources;
}

module.exports = {
  fetchProductos,
};