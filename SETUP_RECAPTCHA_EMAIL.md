# 📧 Guía de Configuración: reCAPTCHA v3 y Verificación de Correo

## 🔧 Pasos de Configuración Necesarios

### 1. **Obtener las claves de reCAPTCHA v3**

1. Ir a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Hacer clic en "+" para crear un nuevo sitio
3. Configurar:
   - **Label**: KeyDrop
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**: localhost, tu-dominio.com
4. Aceptar los términos y crear
5. Copiar las claves:
   - **Site Key** (pública)
   - **Secret Key** (privada para el backend)

#### En `src/App.js`, reemplazar:
```javascript
reCaptchaKey="YOUR_RECAPTCHA_V3_PUBLIC_KEY"
```

Con tu Site Key:
```javascript
reCaptchaKey="6Lcv...tu_site_key_aqui"
```

---

### 2. **Configurar Gmail para enviar correos**

#### Opción A: Usar Gmail con contraseña de aplicación (Recomendado)

1. Ir a [Google Account Security](https://myaccount.google.com/security)
2. Habilitar "Verificación en dos pasos" si no está habilitada
3. Ir a [App Passwords](https://myaccount.google.com/apppasswords)
4. Seleccionar:
   - **App**: Mail
   - **Device**: Windows Computer (u otro)
5. Copiar la contraseña generada (16 caracteres)

#### En `functions/.env`, crear el archivo con:
```
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

#### Opción B: Usar otro proveedor de email (SendGrid, Mailgun, etc.)

Modificar `functions/sendVerificationEmail.js` en la configuración de `nodemailer`:
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.tuproveedor.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

---

### 3. **Configurar variables de entorno en Firebase**

Ejecutar en la terminal de `functions/`:

```bash
# Configurar las variables de entorno en Firebase
firebase functions:config:set email.user="tu-email@gmail.com" email.password="xxxx xxxx xxxx xxxx"
```

O si prefieres usar un archivo `.env`:

1. Crear `functions/.env` con:
```
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

2. Instalar `dotenv` (ya está instalado):
```bash
npm install dotenv
```

3. Actualizar `functions/sendVerificationEmail.js` al inicio:
```javascript
require('dotenv').config();
```

---

### 4. **Actualizar Firestore Security Rules**

En `firestore.rules`, agregar:
```javascript
match /verificationCodes/{document=**} {
  allow create, read, update: if request.auth != null;
  allow delete: if false;
}

match /users/{userId} {
  allow create, read, update, delete: if request.auth.uid == userId;
}
```

---

### 5. **Desplegar Firebase Functions**

```bash
cd functions
firebase deploy --only functions
```

---

## 🔄 Flujo de Registro

1. **Usuario llena el formulario** de registro
2. **reCAPTCHA v3** valida automáticamente (sin que el usuario vea nada)
3. **Se crea la cuenta** en Firebase Auth
4. **Se envía código de verificación** al correo del usuario
5. **Modal de verificación** pide que ingrese el código (válido 10 minutos)
6. **Se verifica el código** y se marca el email como verificado
7. **Registro completado** ✅

---

## 📱 Componentes Creados

### `src/components/EmailVerification.js`
- Modal para ingresar código de verificación
- Timer de 10 minutos
- Botón para reenviar código
- Manejo de errores

### `src/pages/RegisterPage.js`
- Integración de reCAPTCHA v3
- Flujo completo de registro y verificación
- Token de reCAPTCHA almacenado en Firestore

### `functions/sendVerificationEmail.js`
- Función `sendVerificationEmail` - envía código al registrarse
- Función `verifyEmail` - valida el código ingresado
- Función `resendVerificationEmail` - reenvía el código

---

## 🧪 Pruebas Locales

Para probar localmente:

```bash
# Terminal 1: Frontend
npm start

# Terminal 2: Firebase Emulator (opcional)
firebase emulators:start --only functions

# Terminal 3: En functions/ para ver logs
firebase functions:log
```

Para desarrollo sin reCAPTCHA real, puedes usar `reCaptchaKey="test"` en desarrollo.

---

## ⚠️ Importante

- **Nunca commitear** el archivo `.env` con credenciales reales a GitHub
- **Agregar `.env` a `.gitignore`** en la carpeta `functions/`
- **Las claves de reCAPTCHA** están específicas por dominio
- **Cambiar las claves** cuando pases a producción

---

## 🐛 Solución de Problemas

### "Error: EMAIL_USER o EMAIL_PASSWORD no definidos"
→ Verificar que `.env` existe en `functions/` y está correctamente configurado

### "Error: reCAPTCHA key is invalid"
→ Verificar que la Site Key en `App.js` es correcta y el dominio está registrado

### "No se recibe el correo"
→ Verificar: contraseña de aplicación de Gmail, habilitar acceso de apps menos seguras, revisar spam

### "Código de verificación no funciona"
→ Verificar que `verificationCodes` está en las Firestore Rules

---

## 📝 Variables de Entorno Finales

```
# En functions/.env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=contraseña-de-aplicacion

# En src/App.js
reCaptchaKey="6Lcv...tu_site_key_aqui"
```

---

¡Listo! El sistema está implementado. Solo necesitas configurar las variables de entorno. 🚀
