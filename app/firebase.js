// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAPzAI6RFyOaAuCnU7dpWnRJ6fTUMMmF3s",
  authDomain: "quicks-alimnfl.firebaseapp.com",
  projectId: "quicks-alimnfl",
  storageBucket: "quicks-alimnfl.appspot.com",
  messagingSenderId: "665466502682",
  appId: "1:665466502682:web:a559ff6700fe0dff651ba3",
  measurementId: "G-9NJT12DDD4",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
