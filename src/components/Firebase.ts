// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuz_palBnCg_4tSN7HzbjhjuBiwMLliAE",
  authDomain: "todo-app-669fa.firebaseapp.com",
  projectId: "todo-app-669fa",
  storageBucket: "todo-app-669fa.firebasestorage.app",
  messagingSenderId: "397838178181",
  appId: "1:397838178181:web:e82c2a12dcd4a24c1dd6ec",
  measurementId: "G-8ZHLYLVZRW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
