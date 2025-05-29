// components/ProfileModal.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image"; // For Next.js optimized images if needed, or standard img
import { useAuth } from "@/context/AuthContext"; // Assuming path alias is configured

// Firebase imports (client-side)
import { auth, db, storage } from "../../utils/firebase"; // Adjust path as needed
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
// Note: storage and uploadBytes/getDownloadURL were in your original imports but not used in the provided logic for Cloudinary upload.
// If you switch to Firebase Storage for profile pics, you'd use them.
import { updateProfile } from "firebase/auth";

// Heroicons (assuming v1 outline style)
import {
  XIcon,
  PencilIcon, // Edit
  SaveIcon, // Save
  CameraIcon, // PhotoCamera
  UserCircleIcon, // Fallback avatar
} from "@heroicons/react/outline";

const Spinner = ({ size = "w-5 h-5", color = "border-white" }) => (
  <div
    className={`animate-spin rounded-full ${size} border-b-2 ${color}`}
  ></div>
);

export default function ProfileModal({ open, onClose }) {
  const { currentUser } = useAuth(); // Get currentUser from AuthContext

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    displayName: "", // Add displayName for consistency with Firebase Auth
    email: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "", // This will hold the URL
    phoneNumber: "", // Added phone number
    bio: "", // Added bio
  });
  const [formData, setFormData] = useState({ ...userData }); // Add this line
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null); // For new profile picture file

  const [filePreview, setFilePreview] = useState(null); // For new profile picture preview

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open && currentUser) {
      setLoading(true);
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const dbData = docSnap.data();
            const initialData = {
              firstName: dbData.firstName || "",
              lastName: dbData.lastName || "",
              displayName: dbData.displayName || currentUser.displayName || "",
              email: currentUser.email || dbData.email || "",
              age: dbData.age || "",
              gender: dbData.gender || "",
              dateOfBirth: dbData.dateOfBirth || "",
              profilePicture:
                dbData.profilePicture || currentUser.photoURL || "",
              phoneNumber: dbData.phoneNumber || currentUser.phoneNumber || "",
              bio: dbData.bio || "",
            };
            setUserData(initialData);
            setFormData(initialData); // Initialize formData here
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [open, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add cancel handler
  const handleCancel = (e) => {
    e.preventDefault(); // Prevent any form submission
    setIsEditing(false);
    setFile(null);
    setFilePreview(userData.profilePicture || currentUser?.photoURL || "");
    setFormData({ ...userData }); // Reset form data to original user data
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsLoading(true);

    let newProfilePictureURL = userData.profilePicture; // Keep existing if no new file

    try {
      if (file) {
        // Convert file to Base64 for sending to API
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
        });
        const base64Image = reader.result;

        // Send image to Cloudinary (or your chosen service) via your API route
        const response = await fetch("/api/upload", {
          // Assuming this API route handles Cloudinary upload
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }), // API expects { image: base64string }
        });
        const data = await response.json();

        if (response.ok && data.url) {
          newProfilePictureURL = data.url;
        } else {
          console.error(
            "Error uploading image via /api/upload:",
            data.error || "Unknown error"
          );
          throw new Error(data.error || "Image upload failed.");
        }
      }

      // Prepare data for Firebase Auth and Firestore
      const newDisplayName =
        `${formData.firstName} ${formData.lastName}`.trim() ||
        formData.displayName;
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
        photoURL: newProfilePictureURL,
      });

      // Update Firestore user document
      const userDocRef = doc(db, "users", currentUser.uid);
      const dataToUpdate = {
        ...formData,
        displayName: newDisplayName,
        profilePicture: newProfilePictureURL,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(userDocRef, dataToUpdate);

      // Update local state
      setUserData(dataToUpdate);
      setFormData(dataToUpdate);
      setIsEditing(false);
      setFile(null);

      // TODO: Add success snackbar/toast
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      // TODO: Add error snackbar/toast
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  const inputBaseClasses =
    "block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brandAccentFocus focus:border-brandAccentFocus sm:text-sm disabled:opacity-70 disabled:bg-slate-100 dark:disabled:bg-slate-700/50";
  const labelBaseClasses =
    "block text-sm font-medium text-brandTextSecondary dark:text-slate-300 mb-1";

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="relative bg-brandBackground dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
            <h2
              id="profile-modal-title"
              className="text-xl font-semibold text-brandTextPrimary dark:text-slate-100 font-header"
            >
              User Profile
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded-full text-brandTextSecondary hover:text-brandTextPrimary dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
            {loading && !userData.email ? ( // Show main loader only if initial data isn't there yet
              <div className="flex justify-center items-center py-10">
                <Spinner size="w-8 h-8" color="border-brandAccent" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    {filePreview || userData.profilePicture ? (
                      <Image
                        src={filePreview || userData.profilePicture}
                        alt="Profile Picture"
                        width={128}
                        height={128}
                        className="rounded-full object-cover w-32 h-32 border-4 border-white dark:border-slate-700 shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-profile.png";
                        }} // Fallback
                      />
                    ) : (
                      <UserCircleIcon className="w-32 h-32 text-slate-400 dark:text-slate-500" />
                    )}
                    {isEditing && (
                      <label
                        htmlFor="profile-picture-upload"
                        className="absolute bottom-0 right-0 bg-brandAccent text-white p-2 rounded-full cursor-pointer hover:bg-brandAccentHover shadow-md transition-colors"
                        title="Change profile picture"
                      >
                        <CameraIcon className="w-5 h-5" />
                        <input
                          id="profile-picture-upload"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-brandTextPrimary dark:text-slate-100 font-header">
                        {userData.displayName ||
                          `${userData.firstName} ${userData.lastName}` ||
                          "User Name"}
                      </h3>
                      <p className="text-sm text-brandTextSecondary dark:text-slate-400">
                        {userData.email}
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveChanges} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className={labelBaseClasses}>
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputBaseClasses}
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className={labelBaseClasses}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputBaseClasses}
                      />
                    </div>
                  </div>
                  {isEditing && ( // Only show display name editing if in edit mode, as it's derived
                    <div>
                      <label htmlFor="displayName" className={labelBaseClasses}>
                        Display Name (Public)
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        id="displayName"
                        value={formData.displayName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputBaseClasses}
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="email" className={labelBaseClasses}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={userData.email}
                      disabled
                      className={`${inputBaseClasses} bg-slate-100 dark:bg-slate-700/50 cursor-not-allowed`}
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className={labelBaseClasses}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBaseClasses}
                      placeholder="e.g., +8801712345678"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className={labelBaseClasses}>
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        id="age"
                        value={formData.age || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputBaseClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className={labelBaseClasses}>
                        Gender
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        value={formData.gender || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={inputBaseClasses}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className={labelBaseClasses}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={formData.dateOfBirth || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBaseClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className={labelBaseClasses}>
                      Bio / About Me
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows="3"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBaseClasses}
                      placeholder="Tell us a little about yourself..."
                    ></textarea>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    {isEditing ? (
                      <>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-brandTextOnAccent bg-brandAccent hover:bg-brandAccentHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <Spinner size="w-5 h-5" color="border-white" />
                          ) : (
                            <SaveIcon className="w-5 h-5 mr-2" />
                          )}
                          Save Changes
                        </button>
                        <button
                          type="button" // Important: type="button" prevents form submission
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-semibold text-brandTextPrimary dark:text-slate-100 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-brandTextOnAccent bg-brandAccent hover:bg-brandAccentHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-800 transition-colors"
                      >
                        <PencilIcon className="w-5 h-5 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
