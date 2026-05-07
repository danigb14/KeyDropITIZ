require("dotenv").config();

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");
const logger = require("firebase-functions/logger");

initializeApp();

const getMailer = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new HttpsError(
      "failed-precondition",
      "Faltan EMAIL_USER o EMAIL_PASSWORD en variables de entorno de Functions"
    );
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
};

// Generar un código aleatorio de 6 dígitos
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Función para enviar el código de verificación
exports.sendVerificationEmail = onCall(async (request) => {
  try {
    const { email, nombre } = request.data;

    if (!email || !nombre) {
      throw new HttpsError("invalid-argument", "Email y nombre son requeridos");
    }

    // Generar código de verificación
    const code = generateVerificationCode();

    // Guardar el código en Firestore con fecha de expiración (10 minutos)
    const db = getFirestore();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Enviar correo
    const transporter = getMailer();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de verificación - KeyDrop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verificación de correo electrónico</h2>
          <p>Hola ${nombre},</p>
          <p>Para completar el registro de tu cuenta, por favor usa el siguiente código:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #333; letter-spacing: 5px;">${code}</h1>
          </div>
          <p><strong>Este código expirará en 10 minutos.</strong></p>
          <p>Si no solicitaste este código, por favor ignora este correo.</p>
          <br>
          <p>Saludos,<br>El equipo de KeyDrop</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Guardar el código en Firestore solo si el envío fue exitoso
    await db.collection("verificationCodes").doc(email).set({
      code,
      createdAt: new Date(),
      expiresAt,
      used: false,
    });

    logger.info(`Código de verificación enviado a ${email}`);

    return {
      success: true,
      message: "Código de verificación enviado al correo",
    };
  } catch (error) {
    logger.error("Error al enviar correo de verificación:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", `Error al enviar correo: ${error.message}`);
  }
});

// Función para verificar el código
exports.verifyEmail = onCall(async (request) => {
  try {
    const { email, code } = request.data;

    if (!email || !code) {
      throw new HttpsError("invalid-argument", "Email y código son requeridos");
    }

    const db = getFirestore();
    const verificationDoc = await db
      .collection("verificationCodes")
      .doc(email)
      .get();

    if (!verificationDoc.exists) {
      throw new HttpsError("not-found", "No se encontró un código de verificación para este correo");
    }

    const data = verificationDoc.data();

    // Verificar si el código ha expirado
    if (new Date() > data.expiresAt.toDate()) {
      throw new HttpsError("deadline-exceeded", "El código de verificación ha expirado");
    }

    // Verificar si ya fue usado
    if (data.used) {
      throw new HttpsError("failed-precondition", "Este código ya fue utilizado");
    }

    // Verificar si el código es correcto
    if (data.code !== code) {
      throw new HttpsError("permission-denied", "Código de verificación incorrecto");
    }

    // Marcar el código como usado
    await db.collection("verificationCodes").doc(email).update({
      used: true,
      verifiedAt: new Date(),
    });

    logger.info(`Correo verificado: ${email}`);

    return {
      success: true,
      message: "Correo verificado correctamente",
    };
  } catch (error) {
    logger.error("Error al verificar correo:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", `Error en verificación: ${error.message}`);
  }
});

// Función para resend del código
exports.resendVerificationEmail = onCall(async (request) => {
  try {
    const { email, nombre } = request.data;

    if (!email || !nombre) {
      throw new HttpsError("invalid-argument", "Email y nombre son requeridos");
    }

    // Generar nuevo código
    const code = generateVerificationCode();

    // Actualizar el código en Firestore
    const db = getFirestore();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Enviar correo con nuevo código
    const transporter = getMailer();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Nuevo código de verificación - KeyDrop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nuevo código de verificación</h2>
          <p>Hola ${nombre},</p>
          <p>Se ha generado un nuevo código de verificación:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #333; letter-spacing: 5px;">${code}</h1>
          </div>
          <p><strong>Este código expirará en 10 minutos.</strong></p>
          <br>
          <p>Saludos,<br>El equipo de KeyDrop</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    await db.collection("verificationCodes").doc(email).set({
      code,
      createdAt: new Date(),
      expiresAt,
      used: false,
    });

    logger.info(`Nuevo código de verificación reenviado a ${email}`);

    return {
      success: true,
      message: "Nuevo código enviado al correo",
    };
  } catch (error) {
    logger.error("Error al reenviar correo:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", `Error al reenviar correo: ${error.message}`);
  }
});
