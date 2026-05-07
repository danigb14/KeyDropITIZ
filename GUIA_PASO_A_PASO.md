# 🚀 GUÍA COMPLETA: CONFIGURACIÓN PASO A PASO

## 📋 TABLA DE CONTENIDOS
1. [Obtener claves de reCAPTCHA v3](#1-obtener-claves-de-recaptcha-v3)
2. [Configurar Gmail](#2-configurar-gmail)
3. [Crear archivos de entorno](#3-crear-archivos-de-entorno)
4. [Actualizar Firestore Rules](#4-actualizar-firestore-rules)
5. [Desplegar Firebase Functions](#5-desplegar-firebase-functions)
6. [Probar localmente](#6-probar-localmente)
7. [Solucionar problemas](#7-solucionar-problemas)

---

## 1. Obtener claves de reCAPTCHA v3

### Paso 1.1: Acceder a Google reCAPTCHA Console
1. Abre: https://www.google.com/recaptcha/admin
2. Si no estás logueado, inicia sesión con tu cuenta de Google

### Paso 1.2: Crear un nuevo sitio
1. Haz clic en **"+"** (crear nuevo)
2. Rellena los campos:
   - **Label**: `KeyDrop` (o el nombre de tu app)
   - **reCAPTCHA type**: Selecciona **reCAPTCHA v3**
   - **Domains**: Agrega estos dominios:
     - `localhost`
     - `127.0.0.1`
     - tu-dominio.com (cuando tengas un dominio)

### Paso 1.3: Copiar tus claves
1. Verás dos claves:
   - **Site key** (pública) - para el frontend
   - **Secret key** (privada) - para el backend
2. **Copia la Site Key** → la usarás en el siguiente paso

---

## 2. Configurar Gmail

### Paso 2.1: Habilitar autenticación de dos factores
1. Ve a: https://myaccount.google.com/security
2. Desplázate a "Verificación en dos pasos"
3. Si está deshabilitada, haz clic en **"Activar"** y sigue los pasos

### Paso 2.2: Generar contraseña de aplicación
1. Ve a: https://myaccount.google.com/apppasswords
2. En **"Selecciona la app"**: Elige **Mail**
3. En **"Selecciona el dispositivo"**: Elige **Windows Computer** (o tu dispositivo)
4. Haz clic en **"Generar"**
5. Google te mostrará una contraseña de 16 caracteres
6. **Copia esa contraseña** → la usarás en el siguiente paso

---

## 3. Crear archivos de entorno

### Paso 3.1: Crear `.env.local` en la raíz del proyecto

**Ruta**: `c:\Users\danie\Desktop\KeyDropITIZ\.env.local`

Contenido:
```env
REACT_APP_RECAPTCHA_KEY=AQUI_TU_SITE_KEY
```

Ejemplo:
```env
REACT_APP_RECAPTCHA_KEY=6LcvXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Paso 3.2: Crear `.env` en la carpeta functions

**Ruta**: `c:\Users\danie\Desktop\KeyDropITIZ\functions\.env`

Contenido:
```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

Ejemplo:
```env
EMAIL_USER=juan.perez@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### ⚠️ IMPORTANTE
- **NUNCA** compartir estos archivos `.env`
- **NUNCA** hacer commit de `.env` a GitHub
- Ya están en `.gitignore`, pero verificar siempre

---

## 4. Actualizar Firestore Rules

### Paso 4.1: Acceder a Firestore Rules
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **keydrop-84729**
3. En el lado izquierdo: **Firestore Database**
4. Haz clic en la pestaña **Rules**

### Paso 4.2: Reemplazar las reglas
1. Selecciona TODO el texto actual (Ctrl+A)
2. Reemplázalo con el contenido de `FIRESTORE_RULES.md` (en este proyecto)
3. Haz clic en **Publicar**

Deberías ver: "Reglas publicadas" en verde ✅

---

## 5. Desplegar Firebase Functions

### Paso 5.1: Abrir terminal en la carpeta functions
```bash
cd c:\Users\danie\Desktop\KeyDropITIZ\functions
```

### Paso 5.2: Desplegar
```bash
firebase deploy --only functions
```

Deberías ver al final:
```
✔  Deploy complete!
```

---

## 6. Probar localmente

### Opción A: Probar con servidor real (Firebase Functions)
```bash
# Terminal 1: Frontend
cd c:\Users\danie\Desktop\KeyDropITIZ
npm start

# Se abrirá en http://localhost:3000
# Ve a http://localhost:3000/register
# Prueba el registro
```

### Opción B: Probar con emulador local (más rápido)
```bash
# Terminal 1: Frontend
npm start

# Terminal 2: Firebase Emulator
firebase emulators:start --only functions

# Terminal 3: Ver logs
firebase functions:log
```

### Pasos de prueba:
1. Abre http://localhost:3000/register
2. Llena el formulario con:
   - Email: `test@gmail.com`
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Teléfono: `123456789`
   - Contraseña: `Password123!`
3. Haz clic en "Crear una cuenta"
4. Debería:
   - Pasar reCAPTCHA v3 (invisible)
   - Crear la cuenta
   - Mostrar modal de verificación
   - Enviar código a tu email (real)
5. Revisa tu email y copia el código
6. Ingresa el código en el modal
7. Si todo funciona: ✅ Registro exitoso

---

## 7. Solucionar problemas

### "No se recibe el correo"
```
✗ El correo no llega

Verificar:
1. ¿La contraseña de Gmail es correcta? (contraseña de APP, no normal)
2. ¿El email en functions/.env es correcto?
3. Revisar la carpeta de SPAM/PROMOCIONES en Gmail
4. Ver los logs: firebase functions:log
```

### "Error: reCAPTCHA key is invalid"
```
✗ reCAPTCHA no funciona

Verificar:
1. ¿La Site Key está correcta en .env.local?
2. ¿El dominio localhost está en la consola de reCAPTCHA?
3. Recargar la página del navegador (Ctrl+Shift+R)
```

### "Error: verificationCodes no encontrado"
```
✗ No puedo verificar el código

Verificar:
1. ¿Las Firestore Rules fueron publicadas?
2. ¿La colección verificationCodes existe en Firestore?
3. Ver Firebase Console → Firestore → Data
```

### "Error: EMAIL_USER o EMAIL_PASSWORD no definidos"
```
✗ Firebase Functions no encuentra las credenciales

Verificar:
1. ¿El archivo functions/.env existe?
2. ¿Las variables están definidas?
3. ¿Se ejecutó: firebase deploy --only functions ?
4. Esperar 2-3 minutos después del deploy
```

---

## ✅ CHECKLIST FINAL

- [ ] Obtuve Site Key de reCAPTCHA v3
- [ ] Obtuve contraseña de aplicación de Gmail
- [ ] Creé `.env.local` en la raíz con la Site Key
- [ ] Creé `functions/.env` con credenciales de Gmail
- [ ] Actualicé Firestore Rules
- [ ] Ejecuté `firebase deploy --only functions`
- [ ] Probé el registro en `http://localhost:3000/register`
- [ ] Recibí el código de verificación en mi email
- [ ] Ingresé el código y se verificó correctamente ✅

---

## 📞 Si algo no funciona:

1. **Lee el error** en la consola del navegador (F12 → Console)
2. **Revisa los logs** de Firebase: `firebase functions:log`
3. **Verifica Firestore** en Firebase Console → Data
4. **Prueba el emulador**: `firebase emulators:start`
5. **Reinicia todo**: mata Node y vuelve a empezar

---

## 🎉 ¡Listo!

Si llegaste aquí y todo funciona, felicidades 🎊

Tu sistema de registro con reCAPTCHA v3 y verificación de correo está operativo.

¿Preguntas? Revisa `IMPLEMENTACION_RESUMEN.md` o `SETUP_RECAPTCHA_EMAIL.md`
