
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmOhbgF5uASRPS9bprgr_cTq1hcbOZF4A",
  authDomain: "kfm-counsel.firebaseapp.com",
  projectId: "kfm-counsel",
  storageBucket: "kfm-counsel.firebasestorage.app",
  messagingSenderId: "767849621440",
  appId: "1:767849621440:web:cdc8905ecd7057ba398a25",
  measurementId: "G-2PSV0GBV4D"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let configError: string | null = null;

try {
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
