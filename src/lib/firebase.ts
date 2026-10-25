import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// ──────────────────────────────────────────────────────────────
// Firebase configuration
// ──────────────────────────────────────────────────────────────
// Fill these in your .env.local (see .env.example). If they are left
// blank, `isFirebaseConfigured` is false and the app runs fully in
// demo mode: no sign-in, and impact stats live only in local state.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

export const auth = authInstance;
export const db = dbInstance;
export const googleProvider = new GoogleAuthProvider();
