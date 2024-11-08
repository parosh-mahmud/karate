"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  auth,
  db,
  provider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  doc,
  setDoc,
} from "../../utils/firebase";

export default function SignupModal({
  open = false,
  onClose = () => {},
  setUser,
}) {
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleGenderChange = (event) => setGender(event.target.value);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      await saveUserData(user);
      setUser(user);
      // Show success Snackbar
      setSnackbarMessage("Signup successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Google Sign Up Error:", error);
      // Show error Snackbar
      setSnackbarMessage("Failed to sign up with Google.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = result;
      await saveUserData(user);
      setUser(user);
      // Show success Snackbar
      setSnackbarMessage("Signup successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Email Sign Up Error:", error);
      // Show error Snackbar
      setSnackbarMessage("Failed to sign up. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (user) => {
    const userData = {
      uid: user.uid,
      firstName,
      lastName,
      email: user.email,
      age,
      dateOfBirth,
      gender,
      role: "student",
      profilePicture: user.photoURL || "default-profile.png",
    };
    const userDoc = doc(db, "users", user.uid);
    await setDoc(userDoc, userData, { merge: true });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent className="flex flex-col md:flex-row p-0 overflow-hidden">
        {/* Left Section: Image */}
        <div className="hidden md:block w-full md:w-1/2 relative h-64 md:h-auto">
          <Image
            src="https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612198/IMG_9709_yk3bjm.jpg"
            alt="Signup illustration"
            layout="fill"
            objectFit="cover"
          />
        </div>

        {/* Right Section: Form */}
        <div className="w-full md:w-1/2 p-8 bg-white dark:bg-gray-800 relative">
          <IconButton
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <CloseIcon />
          </IconButton>

          <DialogTitle className="text-2xl font-bold mb-6 text-center md:text-left">
            Sign Up
          </DialogTitle>

          <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
            <form onSubmit={handleSignUp} className="space-y-4">
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                fullWidth
                className="mb-4"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Continue with Google"
                )}
              </Button>
              <div className="flex space-x-4">
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={gender}
                  onChange={handleGenderChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
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
                  "Sign Up"
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>

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
    </Dialog>
  );
}
