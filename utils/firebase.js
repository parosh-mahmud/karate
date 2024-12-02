// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage correctly here

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTBFBGTvxWVvTHQc3WDW1zY4GnL2EGcjA",
  authDomain: "jkcombat-27a89.firebaseapp.com",
  projectId: "jkcombat-27a89",
  storageBucket: "jkcombat-27a89.firebasestorage.app",
  messagingSenderId: "670524633825",
  appId: "1:670524633825:web:598e6fd1751912a244bda0",
  measurementId: "G-DBKVCBXP5B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage here
const provider = new GoogleAuthProvider();

// Function to fetch admissions by user UID
export async function fetchAdmissionsByUser(uid) {
  const admissions = [];
  try {
    const q = query(collection(db, "admissions"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      admissions.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error("Error fetching admissions:", error);
    throw error;
  }
  return admissions;
}

export {
  auth,
  db,
  storage,
  provider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
};
