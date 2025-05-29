// components/authModal/SignupModal.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Assuming path alias @ is configured
import { doc, setDoc } from "firebase/firestore";
// Heroicons (outline, v1 style as per previous context)
// If you're using Heroicons v2 (e.g. @heroicons/react/24/outline), adjust imports
import {
  XIcon, // Close icon
  EyeIcon,
  EyeOffIcon,
  UserIcon as PersonIcon, // Renamed to avoid conflict if you have a UserIcon
  MailIcon,
  LockClosedIcon,
} from "@heroicons/react/outline";

// Simple Google Icon SVG (Heroicons doesn't have a direct Google brand icon)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const Spinner = ({ size = "w-5 h-5", color = "border-white" }) => (
  <div
    className={`animate-spin rounded-full ${size} border-b-2 ${color}`}
  ></div>
);

export default function SignupModal({ open = false, onClose = () => {} }) {
  const { signup, googleLogin } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error' or 'warning'

  const togglePasswordVisibility = () => setShowPassword((s) => !s);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 6000); // Auto-hide after 6 seconds
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setIsLoading(true);
    try {
      await googleLogin();
      showSnackbar("Google signup successful! Welcome.", "success");
      onClose();
    } catch (err) {
      console.error("Google Signup Error:", err);
      showSnackbar(
        err.message || "Google signup failed. Please try again.",
        "error"
      );
    } finally {
      setIsGoogleLoading(false);
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      showSnackbar("Please fill in all required fields.", "warning");
      return;
    }
    setIsLoading(true);
    try {
      await signup(email, password, {
        displayName: fullName,
        profilePicture: null, // Default or let AuthContext handle this
      });
      showSnackbar("Signup successful! Welcome.", "success");
      onClose();
    } catch (err) {
      console.error("Email Signup Error:", err);
      let errorMessage = "Email signup failed. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please try logging in.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      // Reset form fields when modal closes
      setFullName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setIsLoading(false);
      setIsGoogleLoading(false);
      setSnackbarOpen(false); // Close snackbar if it was open
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
        onClick={onClose} // Close on backdrop click
      ></div>

      {/* Modal Panel */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
      >
        <div className="relative bg-brandBackground dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl lg:max-w-4xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
          {/* Illustration Side */}
          <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-gradient-to-br from-brandAccent/80 to-brandAccentHover/90 dark:from-brandAccent/70 dark:to-brandAccentHover/80 p-8 lg:p-12">
            <div className="text-center text-white">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/nirapod-lenden.firebasestorage.app/o/galleryImages%2Fd2e102e8-0844-4960-9a4f-613d3761b384-iphoneimage.jpg?alt=media&token=ee28b2be-b1d2-4ab3-bedf-f6210d1ee895"
                alt="Signup illustration"
                width={300}
                height={300}
                className="object-contain rounded-lg mb-6 mx-auto"
              />
              <h2 className="text-2xl lg:text-3xl font-bold font-header mb-3">
                Join JK Combat Academy
              </h2>
              <p className="text-sm lg:text-base opacity-90">
                Unlock your potential. Start your martial arts journey with us
                today!
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 relative flex flex-col">
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-brandTextSecondary hover:text-brandTextPrimary dark:text-slate-400 dark:hover:text-slate-100 transition-colors z-10 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <XIcon className="w-6 h-6" />
            </button>

            <div className="text-center md:text-left mb-6">
              <h2
                id="signup-modal-title"
                className="text-2xl sm:text-3xl font-bold text-brandTextPrimary dark:text-slate-100 font-header"
              >
                Create Account
              </h2>
              <p className="text-sm text-brandTextSecondary dark:text-slate-400 mt-1">
                Begin your martial arts journey.
              </p>
            </div>

            <form
              onSubmit={handleSignUp}
              className="space-y-5 flex-grow overflow-y-auto pr-1" // Added pr-1 for scrollbar space
            >
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-semibold text-brandTextPrimary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <Spinner color="border-brandAccent" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              <div className="flex items-center space-x-2 my-6">
                <hr className="flex-grow border-slate-300 dark:border-slate-600" />
                <span className="text-xs font-medium text-brandTextMuted dark:text-slate-500">
                  OR SIGN UP WITH EMAIL
                </span>
                <hr className="flex-grow border-slate-300 dark:border-slate-600" />
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PersonIcon className="h-5 w-5 text-brandTextMuted dark:text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus sm:text-sm"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-brandTextMuted dark:text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-brandTextMuted dark:text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus sm:text-sm"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-brandTextMuted dark:text-slate-400 hover:text-brandTextSecondary dark:hover:text-slate-300"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-brandTextOnAccent bg-brandAccent hover:bg-brandAccentHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading && !isGoogleLoading ? <Spinner /> : "Create Account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-brandTextSecondary dark:text-slate-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  /* TODO: Implement switch to Login Modal */ onClose(); /* Example: openLoginModal(); */
                }}
                className="font-medium text-brandAccent hover:text-brandAccentHover dark:text-brandAccentFocus dark:hover:text-brandAccentFocus/80 underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      {snackbarOpen && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-lg text-sm font-medium text-white
            ${snackbarSeverity === "success" ? "bg-green-600" : ""}
            ${snackbarSeverity === "error" ? "bg-red-600" : ""}
            ${snackbarSeverity === "warning" ? "bg-yellow-500 text-black" : ""}
            transition-all duration-300 ease-in-out ${
              snackbarOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
        >
          {snackbarMessage}
          <button
            onClick={() => setSnackbarOpen(false)}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-current hover:bg-white/20 rounded-full"
            aria-label="Close snackbar"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
