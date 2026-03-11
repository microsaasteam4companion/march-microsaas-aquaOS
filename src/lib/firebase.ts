import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1F6sZ6ioV0toq9JQNZ7QD79HTFeZKbR8",
  authDomain: "petpal-739a5.firebaseapp.com",
  projectId: "petpal-739a5",
  storageBucket: "petpal-739a5.firebasestorage.app",
  messagingSenderId: "604733217785",
  appId: "1:604733217785:web:c5321baedc68ac30e73b28",
  measurementId: "G-VGPPXCG8GK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
