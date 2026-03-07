# 🚀 INSTRUCCIONES DE DEPLOY - BACKEND VERCEL

## 📦 Lo que tienes que subir al nuevo repo

Copia TODA la carpeta `vercel-backend/` a tu nuevo repositorio. Estructura:

```
tu-repo-backend/
├── api/
│   └── index.js          # ✅ Handler principal (Express adaptado para Vercel)
├── lib/
│   └── cosmos.js         # ✅ Módulo de Azure Cosmos DB
├── package.json          # ✅ Solo dependencias del backend
├── vercel.json          # ✅ Configuración de rutas de Vercel
├── .gitignore           # ✅ Ignorar node_modules y .env
└── README.md            # ✅ Instrucciones de uso
```

## 🔧 Pasos para Deploy

### 1️⃣ Subir código al repo
```bash
cd vercel-backend
git init
git add .
git commit -m "Initial backend setup for Vercel"
git remote add origin https://github.com/TU_USUARIO/TU_REPO_BACKEND.git
git branch -M main
git push -u origin main
```

### 2️⃣ Conectar con Vercel
1. Ve a https://vercel.com/new
2. Importa tu repositorio del backend
3. Vercel detectará automáticamente `vercel.json`
4. **NO CAMBIES NADA** en la configuración de build
5. Click en "Deploy"

### 3️⃣ Configurar Variables de Entorno en Vercel
En el Dashboard de tu proyecto → Settings → Environment Variables, agrega:

| Variable | Valor | Dónde conseguirlo |
|----------|-------|-------------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` o `sk_live_...` | Dashboard de Stripe |
| `COSMOS_ENDPOINT` | `https://....documents.azure.com:443/` | Azure Portal → Cosmos DB → Keys |
| `COSMOS_KEY` | Tu Primary Key | Azure Portal → Cosmos DB → Keys |
| `COSMOS_DATABASE` | Nombre de tu database | Azure Portal → Cosmos DB → Data Explorer |
| `COSMOS_CONTAINER` | Nombre de tu container | Azure Portal → Cosmos DB → Data Explorer |

⚠️ **IMPORTANTE**: Asegúrate de agregar las variables en **Production, Preview y Development**

### 4️⃣ Obtener URL del Backend
Después del deploy, Vercel te dará una URL como:
```
https://tu-repo-backend.vercel.app
```

### 5️⃣ Configurar Frontend para usar el Backend
En tu proyecto principal de React (KeyDropITIZ):

**Opción A - Local (.env.local)**
```env
REACT_APP_FUNCTIONS_URL=https://tu-repo-backend.vercel.app
```

**Opción B - Firebase Hosting**
Si tu frontend está en Firebase, puedes usar variables de entorno en tiempo de build o configurar en firebase.json

**Opción C - Vercel (si despliegas frontend ahí también)**
En el proyecto del frontend en Vercel → Settings → Environment Variables:
```
REACT_APP_FUNCTIONS_URL=https://tu-repo-backend.vercel.app
```

### 6️⃣ Rebuild el Frontend
Después de configurar la variable:
```bash
npm run build
```

## ✅ Verificación

### Probar endpoints directamente:
```bash
# Estado del servidor
curl https://tu-repo-backend.vercel.app/

# Productos
curl https://tu-repo-backend.vercel.app/api/getProductos

# Checkout (necesita POST con body)
curl -X POST https://tu-repo-backend.vercel.app/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Test","price":100,"quantity":1}]}'
```

## 🔥 Si algo sale mal

### Error 500 en /api/getProductos
- Verifica que las variables de Cosmos DB estén correctas
- Revisa los logs en Vercel Dashboard → Deployments → [tu deploy] → Functions

### Error en Stripe
- Verifica que `STRIPE_SECRET_KEY` esté configurada
- Si usas test mode, usa `sk_test_...`

### CORS errors
- El backend ya tiene CORS habilitado para todos los orígenes
- Si quieres restringir, edita `api/index.js` línea 17

## 📝 Diferencias con server.js local

| Local (server.js) | Vercel (api/index.js) |
|-------------------|----------------------|
| `app.listen(PORT)` | `module.exports = app` |
| `/getProductos` | `/api/getProductos` |
| `/create-checkout-session` | `/api/create-checkout-session` |
| Puerto 3001 | Serverless (sin puerto) |

## ✨ Ya Actualizado en el Frontend

✅ `src/pages/CartPage.js` - Ahora usa `REACT_APP_FUNCTIONS_URL`
✅ `src/pages/ProductsPage.js` - Actualizado a `/api/getProductos`

## 🎯 Próximos pasos

1. Deploy el backend en Vercel ✅
2. Copiar la URL del backend
3. Configurar `REACT_APP_FUNCTIONS_URL` en tu frontend
4. Rebuild y redeploy el frontend en Firebase
5. ¡Listo! 🎉
