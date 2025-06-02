// components/ProfileModal.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "../../utils/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebase";
import {
  XIcon,
  PencilIcon,
  SaveIcon,
  CameraIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";

const Spinner = ({ size = "w-5 h-5", color = "border-white" }) => (
  <div
    className={`animate-spin rounded-full ${size} border-b-2 ${color}`}
  ></div>
);

export default function ProfileModal({ open, onClose }) {
  const { currentUser } = useAuth();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
    phoneNumber: "",
    bio: "",
  });
  const [formData, setFormData] = useState({ ...userData });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

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
            setFormData(initialData);
            setFilePreview(initialData.profilePicture);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
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

  const handleCancel = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setFile(null);
    setFilePreview(userData.profilePicture || currentUser?.photoURL || "");
    setFormData({ ...userData });
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

    try {
      let newProfilePictureURL = userData.profilePicture;

      // Handle file upload if a new image is selected
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        // First, upload the image to your storage
        const storageRef = ref(
          storage,
          `profile-images/${currentUser.uid}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // You can handle progress updates here if needed
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload progress:", progress);
            },
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              // Get the download URL
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                newProfilePictureURL = downloadURL;
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      }

      // Update auth profile
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName,
        photoURL: newProfilePictureURL,
      });

      // Update Firestore document
      const userDocRef = doc(db, "users", currentUser.uid);
      const dataToUpdate = {
        ...formData,
        profilePicture: newProfilePictureURL,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userDocRef, dataToUpdate);

      // Update local state
      setUserData((prev) => ({
        ...prev,
        ...dataToUpdate,
      }));
      setFormData((prev) => ({
        ...prev,
        ...dataToUpdate,
      }));
      setIsEditing(false);
      setFile(null);

      // Show success message
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="relative bg-brandBackground dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
          {/* Header */}
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

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
            {loading && !userData.email ? (
              <div className="flex justify-center items-center py-10">
                <Spinner size="w-8 h-8" color="border-brandAccent" />
              </div>
            ) : (
              <>
                {/* ────────── Static View (read‐only) ────────── */}
                {!isEditing && (
                  <>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
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
                            }}
                          />
                        ) : (
                          <UserCircleIcon className="w-32 h-32 text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
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
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={labelBaseClasses}>First Name</label>
                        <p className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100">
                          {userData.firstName || "—"}
                        </p>
                      </div>
                      <div>
                        <label className={labelBaseClasses}>Last Name</label>
                        <p className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100">
                          {userData.lastName || "—"}
                        </p>
                      </div>
                      <div>
                        <label className={labelBaseClasses}>Display Name</label>
                        <p className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100">
                          {userData.displayName || "—"}
                        </p>
                      </div>
                      <div>
                        <label className={labelBaseClasses}>Phone Number</label>
                        <p className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100">
                          {userData.phoneNumber || "—"}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelBaseClasses}>Age</label>
                          <p className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100">
                            {userData.age || "—"}
                          </p>
                        </div>
                        <div>
                          <label className={labelBaseClasses}>Gender</label>
                          <p className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100">
                            {userData.gender || "—"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className={labelBaseClasses}>
                          Date of Birth
                        </label>
                        <p className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100">
                          {userData.dateOfBirth || "—"}
                        </p>
                      </div>
                      <div>
                        <label className={labelBaseClasses}>
                          Bio / About Me
                        </label>
                        <p className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100">
                          {userData.bio || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Edit Profile Button (outside any form!) */}
                    <div className="pt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-brandTextOnAccent bg-brandAccent hover:bg-brandAccentHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-800 transition-colors"
                      >
                        <PencilIcon className="w-5 h-5 mr-2" />
                        Edit Profile
                      </button>
                    </div>
                  </>
                )}

                {/* ────────── Editing View (with form) ────────── */}
                {isEditing && (
                  <form
                    onSubmit={handleSaveChanges}
                    className="space-y-4"
                    noValidate
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
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
                            }}
                          />
                        ) : (
                          <UserCircleIcon className="w-32 h-32 text-slate-400 dark:text-slate-500" />
                        )}
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
                      </div>
                    </div>

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
                          className={inputBaseClasses}
                        />
                      </div>
                    </div>

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
                        className={inputBaseClasses}
                      />
                    </div>

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
                        className={inputBaseClasses}
                        placeholder="Tell us a little about yourself..."
                      ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      {/* Save Changes (submit) */}
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

                      {/* Cancel (does not submit) */}
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-semibold text-brandTextPrimary dark:text-slate-100 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
