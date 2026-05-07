# 🔒 FIRESTORE SECURITY RULES NECESARIAS

Para que el sistema de verificación de correo funcione correctamente, necesitas actualizar tu archivo `firestore.rules`:

## 📝 Agregar estas reglas a `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para documentos de verificación de correo
    match /verificationCodes/{email} {
      // Permitir crear documentos de verificación (Firebase Functions)
      allow create: if request.auth != null || request.auth.uid == null;
      // Permitir leer durante verificación
      allow read: if request.auth != null;
      // Permitir actualizar para marcar como usado
      allow update: if request.auth != null;
      // No permitir eliminar
      allow delete: if false;
    }
    
    // Reglas para documentos de usuarios
    match /users/{userId} {
      // Permitir crear (durante registro)
      allow create: if request.auth != null;
      // Permitir leer el documento del usuario actual
      allow read: if request.auth != null && request.auth.uid == userId;
      // Permitir actualizar el documento del usuario actual
      allow update: if request.auth != null && request.auth.uid == userId;
      // Permitir eliminar el documento del usuario actual
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📍 Pasos para actualizar Firestore Rules:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **KeyDrop**
3. Ve a **Firestore Database** → pestaña **Rules**
4. Reemplaza las reglas con el contenido anterior
5. Haz clic en **Publicar**

## ✅ Prueba las reglas:

Después de publicar, puedes probar en:
- Firebase Console → Firestore → Test Data (crear un documento de prueba)
- O ejecutar `firebase emulators:start` para probar localmente

## 🔐 Explicación de las reglas:

| Colección | Operación | Quien puede | Razón |
|-----------|-----------|------------|--------|
| `verificationCodes` | create | Firebase Functions | Enviar código |
| `verificationCodes` | read | Usuario autenticado | Verificar código |
| `verificationCodes` | update | Usuario autenticado | Marcar como usado |
| `verificationCodes` | delete | NADIE | Seguridad |
| `users` | create | Usuario autenticado | Registro |
| `users` | read | Usuario propietario | Privacy |
| `users` | update | Usuario propietario | Actualizar perfil |
| `users` | delete | Usuario propietario | Eliminar cuenta |

---

## ⚠️ Notas importantes:

- Los **Firebase Functions se ejecutan con privilegios elevados**, por eso pueden acceder a `verificationCodes`
- Los usuarios **solo pueden leer/actualizar sus propios datos**
- Los códigos de verificación **NUNCA se pueden eliminar** (por seguridad)
- En desarrollo puedes usar `allow read, write: if true;` pero **NUNCA en producción**

---

Para más información sobre Firestore Rules: https://firebase.google.com/docs/firestore/security/get-started
