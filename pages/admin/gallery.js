// pages/admin/gallery.js
import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout"; // Use the layout
import { db, storage } from "@/utils/firebase"; // Adjust path if necessary
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // Ensure uuid is installed: npm install uuid

// Reusable Spinner Component (can move to its own file if used elsewhere)
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 mr-2 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function GalleryPage() {
  // === State for Gallery ===
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [errorGallery, setErrorGallery] = useState(null);
  const isMounted = useRef(true); // Ref to track mount status
  const galleryCollectionRef = collection(db, "galleryImages");

  // === Effect for Fetching Images ===
  useEffect(() => {
    isMounted.current = true;
    setErrorGallery(null);

    const fetchGalleryImages = async () => {
      if (isMounted.current) setIsLoadingGallery(true);
      try {
        // Order by 'uploadedAt' timestamp, descending (newest first)
        const q = query(galleryCollectionRef, orderBy("uploadedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Only update state if component is still mounted
        if (isMounted.current) setGalleryImages(images);
      } catch (err) {
        console.error("Error fetching gallery images:", err);
        if (isMounted.current)
          setErrorGallery("Failed to load gallery images.");
      } finally {
        if (isMounted.current) setIsLoadingGallery(false);
      }
    };
    fetchGalleryImages();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // === Handlers ===
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setUploadProgress({});
    setErrorGallery(null); // Clear error when new files are selected
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setErrorGallery("Please select files to upload.");
      return;
    }
    if (!isMounted.current) return; // Prevent upload if component unmounted quickly

    setIsUploading(true);
    setErrorGallery(null);
    setUploadProgress({});

    const uploadPromises = selectedFiles.map((file) => {
      const uniqueFileName = `${uuidv4()}-${file.name}`;
      const storageRef = ref(storage, `galleryImages/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Initialize progress for this file
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            if (!isMounted.current) return;
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress.toFixed(0),
            }));
          },
          (error) => {
            // Handle errors including CORS, network, rules etc.
            if (!isMounted.current)
              return reject({ fileName: file.name, error, handled: true });
            console.error(`Upload failed for ${file.name}:`, error);
            let errorMsg = `Upload failed for ${file.name}.`;
            if (error.code) {
              errorMsg += ` (Code: ${error.code})`;
            }
            setErrorGallery((prev) => `${prev ? prev + "; " : ""}${errorMsg}`);
            setUploadProgress((prev) => ({ ...prev, [file.name]: "Error" }));
            reject({ fileName: file.name, error, handled: false });
          },
          async () => {
            // Upload successful, now get URL and save to Firestore
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              if (!isMounted.current)
                return reject({
                  fileName: file.name,
                  error: new Error(
                    "Component unmounted before Firestore write"
                  ),
                  handled: true,
                });

              const docRef = await addDoc(galleryCollectionRef, {
                fileName: uniqueFileName, // Important for deletion
                url: downloadURL,
                uploadedAt: Timestamp.now(),
              });

              if (isMounted.current) {
                setUploadProgress((prev) => ({ ...prev, [file.name]: "Done" }));
                const newImage = {
                  id: docRef.id,
                  url: downloadURL,
                  fileName: uniqueFileName,
                  uploadedAt: Timestamp.now(),
                };
                // Add image to the start of the list for immediate UI update
                setGalleryImages((prev) => [newImage, ...prev]);
                resolve(newImage);
              } else {
                reject({
                  fileName: file.name,
                  error: new Error(
                    "Component unmounted before final state update"
                  ),
                  handled: true,
                });
              }
            } catch (firestoreError) {
              // Handle Firestore save error
              if (!isMounted.current)
                return reject({
                  fileName: file.name,
                  error: firestoreError,
                  handled: true,
                });
              console.error(
                `Firestore save failed for ${file.name}:`,
                firestoreError
              );
              setErrorGallery(
                (prev) =>
                  `${prev ? prev + "; " : ""}Saving metadata failed for ${
                    file.name
                  }.`
              );
              // Attempt to clean up the orphaned file in Storage
              try {
                await deleteObject(storageRef);
                console.log(
                  `Cleaned up storage for failed Firestore save: ${uniqueFileName}`
                );
              } catch (cleanupError) {
                console.error(`Storage cleanup failed: ${cleanupError}`);
              }
              reject({
                fileName: file.name,
                error: firestoreError,
                handled: false,
              });
            }
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      // Clear file input after all uploads succeed (or handle partial success)
      if (isMounted.current) {
        setSelectedFiles([]);
        // Find the file input and reset it (if needed, often clearing state is enough)
        const fileInput = document.getElementById("gallery-file-input"); // Add id="gallery-file-input" to your input
        if (fileInput) fileInput.value = "";
      }
    } catch (uploadError) {
      if (isMounted.current && !uploadError.handled) {
        console.error("Some uploads failed overall:", uploadError);
        // Specific errors are already set via setErrorGallery in the loop
      } else if (!isMounted.current) {
        console.log("Upload process interrupted by component unmount.");
      }
    } finally {
      // Ensure uploading state is turned off if component is still mounted
      if (isMounted.current) {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (imageId, fileName) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this image? This cannot be undone."
      )
    )
      return;
    setErrorGallery(null); // Clear previous errors

    try {
      // 1. Delete from Firebase Storage
      const storageRef = ref(storage, `galleryImages/${fileName}`);
      await deleteObject(storageRef);

      // 2. Delete from Firestore
      const docRef = doc(db, "galleryImages", imageId);
      await deleteDoc(docRef);

      // 3. Update UI state (only if mounted)
      if (isMounted.current) {
        setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      // Provide feedback if mounted
      if (isMounted.current) {
        setErrorGallery(
          `Failed to delete image ${fileName}. It might have already been deleted or there was a network issue.`
        );
      }
    }
  };

  return (
    <AdminLayout>
      {/* Main content container */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-700 mb-5">
          Gallery Management
        </h1>
        {/* Upload Area */}
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium text-gray-600 mb-3">
            Upload New Images
          </h3>
          <input
            id="gallery-file-input" // Added ID for potential reset
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full max-w-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-3 cursor-pointer disabled:opacity-50"
            disabled={isUploading}
          />
          <button
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition duration-150 ease-in-out"
          >
            {isUploading && <Spinner />}
            {isUploading ? "Uploading..." : "Upload Selected"}
          </button>

          {/* Error Display for Gallery */}
          {errorGallery && (
            <p className="text-red-600 mt-3 text-sm">{errorGallery}</p>
          )}

          {/* Progress Indicators */}
          {isUploading && selectedFiles.length > 0 && (
            <div className="mt-4 space-y-1">
              {selectedFiles.map((file) => (
                <div key={file.name} className="text-sm text-gray-600">
                  {file.name}:{" "}
                  <span
                    className={`font-medium ${
                      uploadProgress[file.name] === "Error"
                        ? "text-red-500"
                        : uploadProgress[file.name] === "Done"
                        ? "text-green-500"
                        : "text-indigo-600"
                    }`}
                  >
                    {uploadProgress[file.name] === "Error"
                      ? "Error"
                      : uploadProgress[file.name] === "Done"
                      ? "Done"
                      : uploadProgress[file.name] !== undefined
                      ? `${uploadProgress[file.name]}%`
                      : "Waiting..."}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>{" "}
        {/* End Upload Area */}
        {/* Current Images Grid */}
        <div>
          <h3 className="text-lg font-medium text-gray-600 mb-4">
            Current Gallery
          </h3>
          {isLoadingGallery && (
            <p className="text-gray-500">Loading images...</p>
          )}
          {!isLoadingGallery && galleryImages.length === 0 && !errorGallery && (
            <p className="text-gray-500 italic">
              No images have been uploaded yet.
            </p>
          )}
          {!isLoadingGallery && galleryImages.length > 0 && (
            // Responsive grid layout
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden shadow-sm aspect-w-1 aspect-h-1"
                >
                  {" "}
                  {/* Enforce square aspect ratio */}
                  <img
                    src={image.url}
                    alt="Gallery item"
                    loading="lazy" // Lazy load images below the fold
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" // Subtle zoom on hover
                  />
                  <button
                    onClick={() => handleDelete(image.id, image.fileName)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-red-700 shadow"
                    title="Delete Image"
                  >
                    ✕ {/* Simple 'X' icon */}
                  </button>
                  {/* Optional: Overlay with filename or upload date */}
                  {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                    {image.fileName.split('-').slice(1).join('-')}
                                </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* End Current Images Grid */}
      </div>{" "}
      {/* End Main content container */}
    </AdminLayout>
  );
}
