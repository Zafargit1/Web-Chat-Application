import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLSsVdWkxGhkFqnav3cbbjHTlRdonSItM",
  authDomain: "chat-a1fbf.firebaseapp.com",
  projectId: "chat-a1fbf",
  storageBucket: "chat-a1fbf.firebasestorage.app",
  messagingSenderId: "500290972524",
  appId: "1:500290972524:web:0ff2d24343eebd61002149"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()