
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// SECURITY NOTE: For a static "No-Build" deployment (like this MVP), 
// environment variables from Vercel are not injected into the browser code.
// We must use the values directly. Firebase config is generally safe to expose client-side
// if you set up Firestore Security Rules in the Firebase Console.

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let configError: string | null = null;

try {
    // Check if critical config keys are present before initializing
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error("Missing Firebase Configuration.");
    }

    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }

    if (app) {
        auth = getAuth(app);
        db = getFirestore(app);
    }
} catch (error: any) {
    configError = `Firebase Initialization Error: ${error.message}`;
    console.error(configError);
}

export { auth, db, configError };
