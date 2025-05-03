// context/AuthContext.js
"use client"; // Mark as client component

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import {
  auth,
  provider, // Assuming Google provider is defined in firebase.js
  db,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, // Add for signup functionality
  signOut,
} from "../../utils/firebase"; // Adjust path if necessary
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import setDoc for potential role setting on signup
import { CircularProgress, Box } from "@mui/material"; // For loading indicator

// Define the shape of the context data (optional but good practice)
const AuthContext = createContext({
  currentUser: null, // Changed from 'user'
  role: null,
  loading: true,
  login: async (email, password) => {},
  googleLogin: async () => {},
  signup: async (email, password, additionalData) => {}, // Added signup
  logout: async () => {},
});

// Create the provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Renamed state
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading until auth state is verified

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      setLoading(true); // Start loading when auth state might be changing
      if (userAuth) {
        setCurrentUser(userAuth); // Set the Firebase user object
        // Fetch user role from Firestore
        try {
          const userDocRef = doc(db, "users", userAuth.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setRole(userDoc.data().role || "student"); // Default to student if role field is missing
          } else {
            console.warn(
              `User document missing for UID: ${userAuth.uid}. Defaulting role to 'student'.`
            );
            // Optionally create the user document here if it's expected after signup
            setRole("student"); // Default role
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null); // Indicate role fetch failed
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false); // Finished checking auth state and fetching role
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once

  // --- Authentication Functions ---
  // Wrap functions in useCallback to maintain stable references unless dependencies change
  // This is often unnecessary for context but good practice if passed down deeply

  const login = useCallback(async (email, password) => {
    // Let the calling component handle errors, just return the promise
    return signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will update the context state automatically
  }, []);

  const googleLogin = useCallback(async () => {
    return signInWithPopup(auth, provider);
    // onAuthStateChanged will update the context state automatically
  }, []);

  // Example Signup function
  const signup = useCallback(async (email, password, additionalData = {}) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Create user document in Firestore after successful signup
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role: "student", // Default role on signup
        createdAt: new Date(),
        ...additionalData, // Include any extra data like displayName if provided
      });
      // Role will be picked up by onAuthStateChanged listener shortly after
    }
    return userCredential; // Return the credential object
  }, []);

  const logout = useCallback(async () => {
    return signOut(auth);
    // onAuthStateChanged will update the context state automatically
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  // when the provider's parent re-renders.
  const value = useMemo(
    () => ({
      currentUser,
      role,
      loading,
      login,
      googleLogin,
      signup,
      logout,
    }),
    [currentUser, role, loading, login, googleLogin, signup, logout]
  ); // Add functions to dependency array

  // Render loading indicator until initial auth check is complete
  if (loading && typeof window !== "undefined") {
    // Check for window to avoid SSR issues if any
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Provide the context value to children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily consume the context in other components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
