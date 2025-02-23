import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWAnAo0DauVcjLgdAuO-OSTxVNrQm9tWk",
  authDomain: "verify-1a561.firebaseapp.com",
  projectId: "verify-1a561",
  storageBucket: "verify-1a561.firebasestorage.app",
  messagingSenderId: "287147244506",
  appId: "1:287147244506:web:2e20779a3f703e3e61dee3",
  measurementId: "G-LYG9FYTF7G",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
