import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera,
} from "@mui/icons-material";
import { auth, db, storage } from "..//../utils/firebase"; // Adjust path as needed
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

export default function ProfileModal({ open, onClose, user }) {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (open && user) {
      const fetchUserData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData({ ...docSnap.data(), email: user.email });
        }
      };
      fetchUserData();
    }
  }, [open, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    let profilePictureURL = userData.profilePicture;

    try {
      if (file) {
        // Convert file to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve) => (reader.onload = resolve));

        // Send image to Cloudinary through API route
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await response.json();

        if (response.ok) {
          profilePictureURL = data.url;
        } else {
          console.error("Error uploading image:", data.error);
          setLoading(false);
          return;
        }
      }

      // Update Firebase Auth profile with new display name and photo URL
      const displayName = `${userData.firstName} ${userData.lastName}`;
      await updateProfile(user, {
        displayName: displayName,
        photoURL: profilePictureURL,
      });

      // Update Firestore user document with new profile details, including photo URL
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        profilePicture: profilePictureURL,
      });

      // Update local state with new profile picture URL
      setUserData((prevData) => ({
        ...prevData,
        profilePicture: profilePictureURL,
      }));

      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar
            src={userData.profilePicture || "/default-profile.png"}
            alt="Profile Picture"
            sx={{ width: 100, height: 100 }}
          />
          {isEditing && (
            <label htmlFor="profile-picture-upload">
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <IconButton component="span" color="primary">
                <PhotoCamera />
              </IconButton>
            </label>
          )}

          <form className="space-y-4 w-full">
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={userData.email}
              disabled
            />
            <TextField
              label="Age"
              variant="outlined"
              fullWidth
              name="age"
              value={userData.age}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <TextField
              label="Gender"
              variant="outlined"
              fullWidth
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <TextField
              label="Date of Birth"
              variant="outlined"
              fullWidth
              name="dateOfBirth"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={userData.dateOfBirth}
              onChange={handleInputChange}
              disabled={!isEditing}
            />

            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                fullWidth
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<EditIcon />}
                fullWidth
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
