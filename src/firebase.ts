import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyDLAU8PPHj5u2qNyelq2c_Ys5SmEWHgXo8",
  authDomain: "lexical-dragon-93n78.firebaseapp.com",
  projectId: "lexical-dragon-93n78",
  storageBucket: "lexical-dragon-93n78.firebasestorage.app",
  messagingSenderId: "205729277725",
  appId: "1:205729277725:web:01945af8db5f424f6de3f4"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore (using specific databaseId from config if provided)
const databaseId = "ai-studio-f3a3882b-0be0-494d-af2f-84e550953be1";
export const db = getFirestore(app, databaseId);

export { signInWithPopup, signOut, onAuthStateChanged };
export type { User as FirebaseUser };
