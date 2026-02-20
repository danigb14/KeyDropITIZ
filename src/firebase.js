// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH4zjyPb_6epmFD4VygTleAXV3X4pyjsU",
  authDomain: "keydrop-84729.firebaseapp.com",
  projectId: "keydrop-84729",
  storageBucket: "keydrop-84729.firebasestorage.app",
  messagingSenderId: "929557853791",
  appId: "1:929557853791:web:7035eb073f822654d20dea",
  measurementId: "G-350KB7K4R7"
};

// Google OAuth Client ID
export const GOOGLE_CLIENT_ID = "929557853791-aup0isi1vd2a44jcff30hbf7ka8d1k78.apps.googleusercontent.com";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
