// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCv-l5Kdlk9jjFb9uXR2kVkE5HZv1g3n4M",
  authDomain: "recipefy-b75ba.firebaseapp.com",
  projectId: "recipefy-b75ba",
  storageBucket: "recipefy-b75ba.firebasestorage.app",
  messagingSenderId: "838668041198",
  appId: "1:838668041198:web:7e96c2b94c0dcaaa0d6cff",
  measurementId: "G-T82D75LVHN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
  }
};

export const logout = () => signOut(auth);