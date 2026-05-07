# �️ KeyDropITIZ — Documentación Completa del Proyecto

## 📌 ¿Qué es KeyDropITIZ?

**KeyDropITIZ** es una tienda online de claves digitales (licencias de software, juegos, etc.) construida con:

- **Frontend**: React (Create React App)
- **Backend**: Node.js + Express, desplegado como serverless en **Vercel**
- **Base de datos**: **Azure Cosmos DB** (NoSQL) para almacenar productos
- **Pagos**: **Stripe** (Checkout Sessions)
- **Hosting del frontend**: **Firebase Hosting**

---

## 🏗️ Arquitectura del Proyecto

```
KeyDropITIZ/
│
├── 📁 src/                          # Frontend React
│   ├── pages/
│   │   ├── ProductsPage.js          # Lista de productos (consume /api/getProductos)
│   │   └── CartPage.js              # Carrito + checkout (consume /api/create-checkout-session)
│   ├── components/                  # Componentes reutilizables de UI
│   └── App.js                       # Rutas principales
│
├── 📁 vercel-backend/               # Backend Express (se despliega en Vercel)
│   ├── api/
│   │   └── index.js                 # Handler principal adaptado para Vercel serverless
│   ├── lib/
│   │   └── cosmos.js                # Módulo de conexión a Azure Cosmos DB
│   ├── package.json                 # Dependencias del backend
│   ├── vercel.json                  # Configuración de rutas para Vercel
│   └── .gitignore                   # Ignora node_modules y .env
│
├── public/                          # Archivos estáticos del frontend
├── package.json                     # Dependencias del frontend
├── firebase.json                    # Configuración de Firebase Hosting
└── .env.local                       # Variables de entorno locales (NO subir a git)
```

---

## ⚙️ Tecnologías y por qué se usan

| Tecnología | Rol | Por qué |
|------------|-----|---------|
| React | Frontend SPA | UI dinámica y componentes reutilizables |
| Express.js | Backend API REST | Simple, flexible, amplio soporte |
| Vercel | Host del backend | Serverless gratis, fácil deploy desde GitHub |
| Azure Cosmos DB | Base de datos | NoSQL escalable, integración con Azure |
| Stripe | Pasarela de pagos | API robusta para checkout seguro |
| Firebase Hosting | Host del frontend | CDN rápido, fácil integración con React |

---

## 🔌 Endpoints del Backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Estado del servidor (health check) |
| `GET` | `/api/getProductos` | Devuelve todos los productos de Cosmos DB |
| `POST` | `/api/create-checkout-session` | Crea una sesión de pago en Stripe |

### Ejemplo: Crear sesión de checkout
```json
// POST /api/create-checkout-session
// Body:
{
  "items": [
    { "name": "Windows 11 Pro Key", "price": 1500, "quantity": 1 }
  ]
}

// Respuesta:
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

---

## 🔐 Variables de Entorno

### Backend (Vercel Dashboard → Settings → Environment Variables)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe | `sk_test_...` / `sk_live_...` |
| `COSMOS_ENDPOINT` | URL del Cosmos DB | `https://xxx.documents.azure.com:443/` |
| `COSMOS_KEY` | Primary Key de Cosmos DB | `abc123...` |
| `COSMOS_DATABASE` | Nombre de la base de datos | `keydrop-db` |
| `COSMOS_CONTAINER` | Nombre del contenedor/colección | `productos` |

### Frontend (`.env.local` o Vercel/Firebase en tiempo de build)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `REACT_APP_FUNCTIONS_URL` | URL base del backend | `https://tu-repo-backend.vercel.app` |

---

## 🚀 Deploy Paso a Paso

### PARTE 1 — Deploy del Backend en Vercel

#### 1️⃣ Subir el backend a GitHub
```bash
cd vercel-backend
git init
git add .
git commit -m "Initial backend setup for Vercel"
git remote add origin https://github.com/TU_USUARIO/TU_REPO_BACKEND.git
git branch -M main
git push -u origin main
```

#### 2️⃣ Conectar con Vercel
1. Ve a [https://vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio del backend
3. Vercel detectará automáticamente `vercel.json`
4. **No cambies nada** en la configuración de build
5. Click en **Deploy**

#### 3️⃣ Agregar Variables de Entorno en Vercel
Dashboard del proyecto → **Settings** → **Environment Variables**

Agrega las 5 variables de la tabla anterior.
⚠️ Márcalas para **Production, Preview y Development**.

#### 4️⃣ Obtener la URL del backend
Después del deploy, Vercel te dará:
```
https://tu-repo-backend.vercel.app
```
Guarda esta URL, la necesitas para el frontend.

---

### PARTE 2 — Deploy del Frontend en Firebase

#### 5️⃣ Configurar la URL del backend en el frontend

**Local** (`.env.local`):
```env
REACT_APP_FUNCTIONS_URL=https://tu-repo-backend.vercel.app
```

**Firebase Hosting** (en tiempo de build, antes de `firebase deploy`):
```bash
REACT_APP_FUNCTIONS_URL=https://tu-repo-backend.vercel.app npm run build
```

#### 6️⃣ Build y deploy del frontend
```bash
npm run build
firebase deploy --only hosting
```

---

## ✅ Verificación del Sistema

### Probar el backend con curl:
```bash
# Health check
curl https://tu-repo-backend.vercel.app/

# Obtener productos
curl https://tu-repo-backend.vercel.app/api/getProductos

# Crear sesión de checkout
curl -X POST https://tu-repo-backend.vercel.app/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Test Key","price":999,"quantity":1}]}'
```

### Verificar el frontend:
1. Abre la URL de Firebase Hosting
2. La página de productos debe cargar las claves desde Cosmos DB
3. Añadir al carrito y hacer checkout debe redirigir a Stripe

---

## 🔥 Resolución de Problemas

### ❌ Error 500 en `/api/getProductos`
- Verifica que las 5 variables de Cosmos DB estén correctas en Vercel
- Revisa los logs: Vercel Dashboard → Deployments → [deploy] → **Functions**
- Asegúrate de que el contenedor de Cosmos DB existe y tiene datos

### ❌ Error en Stripe (400 / 500)
- Verifica que `STRIPE_SECRET_KEY` esté configurada y sea válida
- En modo test, usa `sk_test_...`; en producción, `sk_live_...`
- Los precios deben estar en **centavos** (ej: `1500` = $15.00)

### ❌ CORS errors en el frontend
- El backend tiene CORS habilitado para todos los orígenes (`*`)
- Si quieres restringir a tu dominio de Firebase, edita `api/index.js`:
  ```js
  app.use(cors({ origin: 'https://tu-app.web.app' }));
  ```

### ❌ `REACT_APP_FUNCTIONS_URL` es undefined
- Las variables de React deben empezar con `REACT_APP_`
- Deben estar definidas **antes** del build (`npm run build`)
- Reinicia el servidor de desarrollo si las cambias en `.env.local`

---

## 🔄 Flujo Completo de una Compra

```
Usuario → ProductsPage
    → GET /api/getProductos → Cosmos DB → Lista de productos

Usuario añade al carrito → CartPage
    → POST /api/create-checkout-session → Stripe API
    → Redirige a Stripe Checkout

Usuario paga en Stripe
    → Stripe redirige a /success o /cancel
```

---

## 📝 Diferencias: Desarrollo Local vs Vercel

| Aspecto | Local (`server.js`) | Vercel (`api/index.js`) |
|---------|---------------------|-------------------------|
| Inicio del servidor | `app.listen(3001)` | `module.exports = app` |
| URL base | `http://localhost:3001` | `https://tu-repo.vercel.app` |
| Ruta productos | `/getProductos` | `/api/getProductos` |
| Ruta checkout | `/create-checkout-session` | `/api/create-checkout-session` |
| Variables de entorno | `.env` local | Vercel Dashboard |

---

## 🎯 Checklist de Deploy

- [ ] Backend subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] 5 variables de entorno configuradas en Vercel
- [ ] Backend desplegado y respondiendo en `/`
- [ ] `REACT_APP_FUNCTIONS_URL` configurada en el frontend
- [ ] Frontend buildeado con `npm run build`
- [ ] Frontend desplegado en Firebase con `firebase deploy`
- [ ] Productos visibles en la tienda
- [ ] Checkout redirige a Stripe correctamente
- [ ] ¡Listo para vender! 🎉
