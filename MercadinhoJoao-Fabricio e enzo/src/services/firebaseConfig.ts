// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5dYNJYLZhVGpvr14BzFOvZCCKVxYJNns",
  authDomain: "atividade04-05-26.firebaseapp.com",
  projectId: "atividade04-05-26",
  storageBucket: "atividade04-05-26.firebasestorage.app",
  messagingSenderId: "987144582071",
  appId: "1:987144582071:web:c7c0a9c9f0af71b23f6e32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);