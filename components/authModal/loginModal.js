"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  auth,
  signInWithPopup,
  provider,
  signInWithEmailAndPassword,
} from "../../utils/firebase";
import { useAuth } from "@/context/AuthContext"; // Updated path
export default function LoginModal({
  open = false,
  onClose = () => {},
  onSwitchToSignup = () => {},
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { login, googleLogin } = useAuth(); // ✅ Use login methods from context

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await googleLogin(); // ✅ Login via context
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Google Login Error:", error);
      setSnackbarMessage("Failed to login with Google.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password); // ✅ Login via context
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Email Login Error:", error);
      setSnackbarMessage("Invalid email or password.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent className="p-8 relative">
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle className="text-2xl font-bold mb-6 text-center">
          Login
        </DialogTitle>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            className="mb-4"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Continue with Google"
            )}
          </Button>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
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

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
}
