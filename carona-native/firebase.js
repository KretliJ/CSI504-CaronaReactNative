import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBruJFeia1RnZShEC7aGLTEjz2QxrwQSO0",
  authDomain: "caronasapp-7ee45.firebaseapp.com",
  projectId: "caronasapp-7ee45",
  storageBucket: "caronasapp-7ee45.appspot.com",
  messagingSenderId: "54333728120",
  appId: "1:54333728120:web:15921f6c399d83cb9ad48d",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { db };
