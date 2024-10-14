// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm9aLKraofIHRKCH_sBXJg9ieLUSrk-78",
  authDomain: "combat-fd364.firebaseapp.com",
  projectId: "combat-fd364",
  storageBucket: "combat-fd364.appspot.com",
  messagingSenderId: "427463023275",
  appId: "1:427463023275:web:0949d75d5bb9d7e917b5ee",
  measurementId: "G-LJ3ZP0K8ZJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
