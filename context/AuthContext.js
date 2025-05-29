"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, provider, db } from "@/lib/firebase";
import { CircularProgress, Box } from "@mui/material";

// Define user roles
const USER_ROLES = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
};

const DEFAULT_ROLE = USER_ROLES.STUDENT;

const AuthContext = createContext({
  currentUser: null,
  role: null,
  loading: true,
  isAdmin: false,
  isInstructor: false,
  login: async () => {},
  googleLogin: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data including role
  const fetchUserData = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setRole(userData.role || DEFAULT_ROLE);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
      return null;
    }
  };

  // Update user document in Firestore
  const updateUserDocument = async (userId, data) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        {
          ...data,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating user document:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          const userData = await fetchUserData(user);
          setRole(userData?.role || DEFAULT_ROLE);
        } else {
          setCurrentUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserData(result.user);
      return result.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const googleLogin = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: DEFAULT_ROLE,
          profilePicture: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return user;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (email, password, additionalData = {}) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = credential.user;

      // Update profile if name provided
      if (additionalData.displayName) {
        await updateProfile(user, {
          displayName: additionalData.displayName,
        });
      }

      // Create user document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: additionalData.displayName || null,
        role: DEFAULT_ROLE,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData,
      });

      return user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(
    async (userData) => {
      try {
        if (!currentUser) throw new Error("No user logged in");

        // Update auth profile if display name or photo provided
        if (userData.displayName || userData.photoURL) {
          await updateProfile(currentUser, {
            displayName: userData.displayName || currentUser.displayName,
            photoURL: userData.photoURL || currentUser.photoURL,
          });
        }

        // Update Firestore document
        await updateUserDocument(currentUser.uid, userData);

        // Refresh user data
        await fetchUserData(currentUser);
      } catch (error) {
        console.error("Profile update error:", error);
        throw error;
      }
    },
    [currentUser]
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setRole(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      role,
      loading,
      error,
      isAdmin: role === USER_ROLES.ADMIN,
      isInstructor: role === USER_ROLES.INSTRUCTOR,
      login,
      googleLogin,
      signup,
      logout,
      updateUserProfile,
    }),
    [
      currentUser,
      role,
      loading,
      error,
      login,
      googleLogin,
      signup,
      logout,
      updateUserProfile,
    ]
  );

  if (loading && typeof window !== "undefined") {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export roles for use in other components
export { USER_ROLES };
