import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Configuration for Firebase project mosat-5dc4f
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mosat-5dc4f.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mosat-5dc4f',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mosat-5dc4f.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase has a valid, non-placeholder API key
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('MockKey') && 
  !firebaseConfig.apiKey.includes('YourActual') &&
  firebaseConfig.apiKey.trim().length > 10 &&
  firebaseConfig.projectId === 'mosat-5dc4f'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

try {
  if (isFirebaseConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (err) {
  console.warn('[MoSAT Firebase] Initialization fallback to local storage:', err);
}

export { app, auth, db, googleProvider, firebaseConfig };
