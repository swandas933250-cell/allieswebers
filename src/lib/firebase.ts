import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Diagnostic log (internal only)
console.log('Firebase initialized for project:', firebaseConfig.projectId);

export const auth = getAuth(app);

// Simple Firestore initialization
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
