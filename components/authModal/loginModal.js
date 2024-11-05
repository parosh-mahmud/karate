"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import {
  auth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "..//../utils/firebase"; // Adjust import path if needed

export default function LoginModal({
  open = false,
  onClose = () => {},
  onSwitchToSignup = () => {},
  setUser,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      setUser && setUser(user);
      onClose();
    } catch (error) {
      setError("Failed to login with Google");
      console.error("Google Login Error:", error);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      setUser && setUser(user);
      onClose();
    } catch (error) {
      setError("Invalid email or password");
      console.error("Email Login Error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent className="p-8">
        <DialogTitle className="text-2xl font-bold mb-6">Login</DialogTitle>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            className="mb-4"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
            Login
          </Button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:underline"
          >
            Sign up now!
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
