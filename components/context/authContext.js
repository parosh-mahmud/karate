// // components/context/AuthContext.js
// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useMemo,
//   useCallback,
// } from "react";
// import {
//   auth,
//   provider,
//   db,
//   signInWithPopup,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
// } from "../../utils/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { CircularProgress, Box } from "@mui/material";

// const AuthContext = createContext({
//   currentUser: null,
//   role: null,
//   loading: true,
//   login: async () => {},
//   googleLogin: async () => {},
//   signup: async () => {},
//   logout: async () => {},
// });

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setLoading(true);
//       if (user) {
//         setCurrentUser(user);
//         // fetch or default role
//         try {
//           const userDoc = await getDoc(doc(db, "users", user.uid));
//           setRole(userDoc.exists() ? userDoc.data().role : "student");
//         } catch {
//           setRole("student");
//         }
//       } else {
//         setCurrentUser(null);
//         setRole(null);
//       }
//       setLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   // Email/password login
//   const login = useCallback(async (email, pw) => {
//     await signInWithEmailAndPassword(auth, email, pw);
//     // onAuthStateChanged will update currentUser
//   }, []);

//   // Google popup login
//   const googleLogin = useCallback(async () => {
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;
//     // ensure Firestore user doc exists
//     const userRef = doc(db, "users", user.uid);
//     const snap = await getDoc(userRef);
//     if (!snap.exists()) {
//       await setDoc(userRef, {
//         uid: user.uid,
//         email: user.email,
//         role: "student",
//         profilePicture: user.photoURL,
//         createdAt: new Date(),
//       });
//     }
//   }, []);

//   // Email/signup + Firestore write
//   const signup = useCallback(async (email, pw, additionalData = {}) => {
//     const cred = await createUserWithEmailAndPassword(auth, email, pw);
//     const user = cred.user;
//     await setDoc(doc(db, "users", user.uid), {
//       uid: user.uid,
//       email: user.email,
//       role: "student",
//       createdAt: new Date(),
//       ...additionalData,
//     });
//   }, []);

//   const logout = useCallback(() => signOut(auth), []);

//   const value = useMemo(
//     () => ({
//       currentUser,
//       role,
//       loading,
//       login,
//       googleLogin,
//       signup,
//       logout,
//     }),
//     [currentUser, role, loading, login, googleLogin, signup, logout]
//   );

//   if (loading && typeof window !== "undefined") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be inside AuthProvider");
//   return ctx;
// }

import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../lib/firebase"; // Adjust path based on your firebase config location

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    return signOut(auth);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
