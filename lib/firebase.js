//lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
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
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref, // Add this
  uploadBytes, // Add this
  getDownloadURL, // Add this
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEEA-dH1ae0qog8Z_vD4Fj_-aLgzrsy0Y",
  authDomain: "nirapod-lenden.firebaseapp.com",
  databaseURL:
    "https://nirapod-lenden-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nirapod-lenden",
  storageBucket: "nirapod-lenden.firebasestorage.app",
  messagingSenderId: "67130296684",
  appId: "1:67130296684:web:18b0f3607979110c16cb49",
  measurementId: "G-J2XRJJTS4C",
};

// ✅ Prevent multiple initializations
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

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
  ref, // Add this
  uploadBytes, // Add this
  getDownloadURL, // Add this
  collection,
  serverTimestamp,
  query,
  where,
  uploadBytesResumable,
};
