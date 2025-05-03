// // pages/admin/index.js
// import React, { useState, useEffect, useRef } from "react"; // Added useRef
// import AdminRoute from "../../components/adminroutes/adminRoutes";
// import Link from "next/link";
// import { db, storage } from "../../utils/firebase"; // Import storage
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
//   addDoc, // Added for gallery
//   deleteDoc, // Added for gallery
//   Timestamp, // Added for gallery
//   query, // Added for gallery
//   orderBy, // Added for gallery
// } from "firebase/firestore";
// import {
//   ref, // Added for gallery
//   uploadBytesResumable, // Added for gallery
//   getDownloadURL, // Added for gallery
//   deleteObject, // Added for gallery
// } from "firebase/storage"; // Added for gallery
// import { v4 as uuidv4 } from "uuid"; // Added for gallery
// import { useRouter } from "next/router"; // Keep if needed for AdminRoute or future use

// // Simple Spinner Component (Optional - or use a library)
// const Spinner = () => (
//   <svg
//     className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-blue-500 rounded-full"
//     viewBox="0 0 24 24"
//   >
//     {/* SVG path for spinner */}
//   </svg>
// );

// export default function AdminDashboard() {
//   // === State for Admissions ===
//   const [admissions, setAdmissions] = useState([]);
//   const [isLoadingAdmissions, setIsLoadingAdmissions] = useState(true);
//   const [errorAdmissions, setErrorAdmissions] = useState(null);

//   // === State for Gallery ===
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [isUploading, setIsUploading] = useState(false);
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [isLoadingGallery, setIsLoadingGallery] = useState(true);
//   const [errorGallery, setErrorGallery] = useState(null); // Separate error state for gallery

//   // === General State ===
//   const router = useRouter(); // Keep if used elsewhere or by AdminRoute
//   const isMounted = useRef(true); // Ref to track mount status

//   // Reference to the Firestore gallery collection
//   const galleryCollectionRef = collection(db, "galleryImages");

//   // === Effect for Fetching Data ===
//   useEffect(() => {
//     isMounted.current = true;
//     setErrorAdmissions(null); // Clear errors on mount/re-fetch
//     setErrorGallery(null);

//     // --- Fetch Admissions ---
//     const fetchAdmissions = async () => {
//       if (isMounted.current) setIsLoadingAdmissions(true);
//       try {
//         const admissionsCol = collection(db, "admissions");
//         const admissionsSnapshot = await getDocs(admissionsCol);
//         const admissionsList = admissionsSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         if (isMounted.current) {
//           setAdmissions(admissionsList);
//         }
//       } catch (error) {
//         console.error("Error fetching admissions:", error);
//         if (isMounted.current) {
//           setErrorAdmissions("Failed to load admissions data.");
//         }
//       } finally {
//         if (isMounted.current) {
//           setIsLoadingAdmissions(false);
//         }
//       }
//     };

//     // --- Fetch Gallery Images ---
//     const fetchGalleryImages = async () => {
//       if (isMounted.current) setIsLoadingGallery(true);
//       try {
//         const q = query(galleryCollectionRef, orderBy("uploadedAt", "desc"));
//         const querySnapshot = await getDocs(q);
//         const images = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         if (isMounted.current) {
//           setGalleryImages(images);
//         }
//       } catch (err) {
//         console.error("Error fetching gallery images:", err);
//         if (isMounted.current) {
//           setErrorGallery("Failed to load gallery images.");
//         }
//       } finally {
//         if (isMounted.current) {
//           setIsLoadingGallery(false);
//         }
//       }
//     };

//     fetchAdmissions();
//     fetchGalleryImages();

//     // Cleanup function
//     return () => {
//       isMounted.current = false;
//     };
//   }, []); // Run once on mount

//   // === Handlers for Admissions ===
//   const handleUpdateStatus = async (admissionId, newStatus) => {
//     setErrorAdmissions(null); // Clear previous errors
//     try {
//       const admissionDocRef = doc(db, "admissions", admissionId);
//       await updateDoc(admissionDocRef, { status: newStatus });
//       // Update state only if component is still mounted
//       if (isMounted.current) {
//         setAdmissions((prevAdmissions) =>
//           prevAdmissions.map((admission) =>
//             admission.id === admissionId
//               ? { ...admission, status: newStatus }
//               : admission
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating admission status:", error);
//       if (isMounted.current) {
//         setErrorAdmissions(
//           `Failed to update status for ${admissionId}. Please try again.`
//         );
//       }
//     }
//   };

//   // === Handlers for Gallery ===
//   const handleFileChange = (e) => {
//     setSelectedFiles(Array.from(e.target.files));
//     setUploadProgress({});
//     setErrorGallery(null); // Clear gallery error on new selection
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) {
//       setErrorGallery("Please select files to upload.");
//       return;
//     }
//     if (!isMounted.current) return;

//     setIsUploading(true);
//     setErrorGallery(null);
//     setUploadProgress({});

//     const uploadPromises = selectedFiles.map((file) => {
//       const uniqueFileName = `${uuidv4()}-${file.name}`;
//       const storageRef = ref(storage, `galleryImages/${uniqueFileName}`);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

//       return new Promise((resolve, reject) => {
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             if (!isMounted.current) return;
//             const progress =
//               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setUploadProgress((prev) => ({
//               ...prev,
//               [file.name]: progress.toFixed(0),
//             }));
//           },
//           (error) => {
//             if (!isMounted.current)
//               return reject({ fileName: file.name, error, handled: true });
//             console.error(`Upload failed for ${file.name}:`, error);
//             setErrorGallery(
//               (prev) =>
//                 `${prev ? prev + "; " : ""}Upload failed for ${file.name}.`
//             );
//             setUploadProgress((prev) => ({ ...prev, [file.name]: "Error" }));
//             reject({ fileName: file.name, error, handled: false });
//           },
//           async () => {
//             try {
//               const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//               if (!isMounted.current)
//                 return reject({
//                   fileName: file.name,
//                   error: new Error(
//                     "Component unmounted before Firestore write"
//                   ),
//                   handled: true,
//                 });

//               const docRef = await addDoc(galleryCollectionRef, {
//                 fileName: uniqueFileName,
//                 url: downloadURL,
//                 uploadedAt: Timestamp.now(),
//               });

//               if (isMounted.current) {
//                 setUploadProgress((prev) => ({ ...prev, [file.name]: "Done" }));
//                 // Immediately add to local state for instant feedback
//                 const newImage = {
//                   id: docRef.id,
//                   url: downloadURL,
//                   fileName: uniqueFileName,
//                   uploadedAt: Timestamp.now(),
//                 };
//                 setGalleryImages((prev) => [newImage, ...prev]); // Add to start of array
//                 resolve(newImage);
//               } else {
//                 reject({
//                   fileName: file.name,
//                   error: new Error(
//                     "Component unmounted before final state update"
//                   ),
//                   handled: true,
//                 });
//               }
//             } catch (firestoreError) {
//               if (!isMounted.current)
//                 return reject({
//                   fileName: file.name,
//                   error: firestoreError,
//                   handled: true,
//                 });
//               console.error(
//                 `Firestore save failed for ${file.name}:`,
//                 firestoreError
//               );
//               setErrorGallery(
//                 (prev) =>
//                   `${prev ? prev + "; " : ""}Saving metadata failed for ${
//                     file.name
//                   }.`
//               );
//               try {
//                 await deleteObject(storageRef);
//               } catch (cleanupError) {
//                 console.error(`Storage cleanup failed: ${cleanupError}`);
//               }
//               reject({
//                 fileName: file.name,
//                 error: firestoreError,
//                 handled: false,
//               });
//             }
//           }
//         );
//       });
//     });

//     try {
//       // Wait for all uploads but don't necessarily need the results array
//       // as we're updating state immediately inside the 'complete' handler now.
//       await Promise.all(uploadPromises);
//       if (isMounted.current) {
//         setSelectedFiles([]); // Clear selection on overall success
//         // Optionally clear file input visually here if needed
//       }
//     } catch (uploadError) {
//       if (isMounted.current && !uploadError.handled) {
//         console.error("Some uploads failed:", uploadError);
//         // Use existing setErrorGallery calls within the loop for specific errors
//       } else if (!isMounted.current) {
//         console.log("Upload process interrupted by component unmount.");
//       }
//     } finally {
//       if (isMounted.current) {
//         setIsUploading(false);
//       }
//     }
//   };

//   const handleDelete = async (imageId, fileName) => {
//     if (!window.confirm("Are you sure you want to delete this image?")) return;
//     setErrorGallery(null); // Clear previous errors

//     try {
//       const storageRef = ref(storage, `galleryImages/${fileName}`);
//       await deleteObject(storageRef);

//       const docRef = doc(db, "galleryImages", imageId);
//       await deleteDoc(docRef);

//       if (isMounted.current) {
//         setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
//       }
//     } catch (err) {
//       console.error("Error deleting image:", err);
//       if (isMounted.current) {
//         setErrorGallery(`Failed to delete image ${fileName}.`);
//       }
//     }
//   };

//   // === Render Logic ===
//   return (
//     <AdminRoute>
//       <div className="p-4 sm:p-6 lg:p-8 space-y-8">
//         {" "}
//         {/* Added more padding and spacing */}
//         <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//         {/* --- Action Buttons --- */}
//         <div className="space-x-4">
//           <Link href="/admin/blogs/create">
//             <a className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition duration-150 ease-in-out">
//               {/* Optional Icon */}
//               <span>Write Blog</span>
//             </a>
//           </Link>
//           {/* Removed Manage Gallery link as it's integrated now */}
//         </div>
//         {/* --- Gallery Management Section --- */}
//         <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//           <h2 className="text-2xl font-semibold text-gray-700 mb-5">
//             Manage Gallery
//           </h2>
//           {/* Upload Area */}
//           <div className="mb-6 p-4 border rounded-md bg-gray-50">
//             <h3 className="text-lg font-medium text-gray-600 mb-3">
//               Upload New Images
//             </h3>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleFileChange}
//               className="block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3 cursor-pointer"
//               disabled={isUploading}
//             />
//             <button
//               onClick={handleUpload}
//               disabled={isUploading || selectedFiles.length === 0}
//               className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition duration-150 ease-in-out"
//             >
//               {isUploading && <Spinner />}
//               {isUploading ? "Uploading..." : "Upload Selected"}
//             </button>

//             {/* Error Display for Gallery */}
//             {errorGallery && (
//               <p className="text-red-600 mt-3 text-sm">{errorGallery}</p>
//             )}

//             {/* Progress Indicators */}
//             {isUploading && selectedFiles.length > 0 && (
//               <div className="mt-4 space-y-1">
//                 {selectedFiles.map((file) => (
//                   <div key={file.name} className="text-sm text-gray-600">
//                     {file.name}:{" "}
//                     <span
//                       className={`font-medium ${
//                         uploadProgress[file.name] === "Error"
//                           ? "text-red-500"
//                           : uploadProgress[file.name] === "Done"
//                           ? "text-green-500"
//                           : "text-blue-600"
//                       }`}
//                     >
//                       {uploadProgress[file.name] === "Error"
//                         ? "Error"
//                         : uploadProgress[file.name] === "Done"
//                         ? "Done"
//                         : uploadProgress[file.name] !== undefined
//                         ? `${uploadProgress[file.name]}%`
//                         : "Waiting..."}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>{" "}
//           {/* End Upload Area */}
//           {/* Current Images Grid */}
//           <div>
//             <h3 className="text-lg font-medium text-gray-600 mb-3">
//               Current Gallery
//             </h3>
//             {isLoadingGallery && (
//               <p className="text-gray-500">Loading images...</p>
//             )}
//             {!isLoadingGallery &&
//               galleryImages.length === 0 &&
//               !errorGallery && (
//                 <p className="text-gray-500">No images found in the gallery.</p>
//               )}
//             {!isLoadingGallery && galleryImages.length > 0 && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
//                 {galleryImages.map((image) => (
//                   <div
//                     key={image.id}
//                     className="relative group border rounded-lg overflow-hidden shadow-sm aspect-square"
//                   >
//                     {" "}
//                     {/* Aspect ratio for square images */}
//                     <img
//                       src={image.url}
//                       alt="Gallery item"
//                       loading="lazy"
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       onClick={() => handleDelete(image.id, image.fileName)}
//                       className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-red-700"
//                       title="Delete Image"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           {/* End Current Images Grid */}
//         </div>{" "}
//         {/* --- End Gallery Management Section --- */}
//         {/* --- Admissions List Section --- */}
//         <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//           <h2 className="text-2xl font-semibold text-gray-700 mb-5">
//             Admissions
//           </h2>

//           {/* Error Display for Admissions */}
//           {errorAdmissions && (
//             <p className="text-red-600 mb-3 text-sm">{errorAdmissions}</p>
//           )}

//           {isLoadingAdmissions ? (
//             <p className="text-gray-500">Loading admissions...</p>
//           ) : admissions.length > 0 ? (
//             <>
//               {/* Table for larger screens */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="min-w-full bg-white border">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Student ID
//                       </th>
//                       <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Email
//                       </th>
//                       <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Payment Method
//                       </th>
//                       <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Transaction ID
//                       </th>
//                       <th className="py-2 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="py-2 px-4 border text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {admissions.map((admission) => (
//                       <tr key={admission.id} className="text-sm text-gray-700">
//                         <td className="py-2 px-4 border whitespace-nowrap">
//                           {admission.studentId || "N/A"}
//                         </td>
//                         <td className="py-2 px-4 border whitespace-nowrap">
//                           {admission.fullName}
//                         </td>
//                         <td className="py-2 px-4 border whitespace-nowrap">
//                           {admission.email}
//                         </td>
//                         <td className="py-2 px-4 border whitespace-nowrap">
//                           {admission.paymentMethod}
//                         </td>
//                         <td className="py-2 px-4 border whitespace-nowrap">
//                           {admission.transactionId}
//                         </td>
//                         <td className="py-2 px-4 border whitespace-nowrap">
//                           <span
//                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               admission.status === "approved"
//                                 ? "bg-green-100 text-green-800"
//                                 : admission.status === "declined"
//                                 ? "bg-red-100 text-red-800"
//                                 : "bg-yellow-100 text-yellow-800" // Default/Pending status
//                             }`}
//                           >
//                             {admission.status}
//                           </span>
//                         </td>
//                         <td className="py-2 px-4 border text-center">
//                           <div className="flex justify-center flex-wrap gap-2">
//                             <button
//                               className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded-md transition duration-150 ease-in-out"
//                               onClick={() =>
//                                 handleUpdateStatus(admission.id, "approved")
//                               }
//                               disabled={admission.status === "approved"} // Optional: disable if already approved
//                             >
//                               Accept
//                             </button>
//                             <button
//                               className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-md transition duration-150 ease-in-out"
//                               onClick={() =>
//                                 handleUpdateStatus(admission.id, "declined")
//                               }
//                               disabled={admission.status === "declined"} // Optional: disable if already declined
//                             >
//                               Decline
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Cards for small screens */}
//               <div className="md:hidden space-y-4">
//                 {admissions.map((admission) => (
//                   <div
//                     key={admission.id}
//                     className="bg-white shadow-md rounded-md p-4 border border-gray-200"
//                   >
//                     <p className="text-sm mb-1">
//                       <span className="font-semibold">Name:</span>{" "}
//                       {admission.fullName}
//                     </p>
//                     <p className="text-sm mb-1">
//                       <span className="font-semibold">Email:</span>{" "}
//                       {admission.email}
//                     </p>
//                     <p className="text-sm mb-1">
//                       <span className="font-semibold">Payment:</span>{" "}
//                       {admission.paymentMethod}
//                     </p>
//                     <p className="text-sm mb-1">
//                       <span className="font-semibold">Transaction ID:</span>{" "}
//                       {admission.transactionId}
//                     </p>
//                     <p className="text-sm mb-2">
//                       <span className="font-semibold">Status:</span>
//                       <span
//                         className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           admission.status === "approved"
//                             ? "bg-green-100 text-green-800"
//                             : admission.status === "declined"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {admission.status}
//                       </span>
//                     </p>
//                     {/* Action Buttons */}
//                     <div className="flex mt-2 gap-2">
//                       <button
//                         className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded-md transition duration-150 ease-in-out"
//                         onClick={() =>
//                           handleUpdateStatus(admission.id, "approved")
//                         }
//                         disabled={admission.status === "approved"}
//                       >
//                         Accept
//                       </button>
//                       <button
//                         className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-md transition duration-150 ease-in-out"
//                         onClick={() =>
//                           handleUpdateStatus(admission.id, "declined")
//                         }
//                         disabled={admission.status === "declined"}
//                       >
//                         Decline
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             !isLoadingAdmissions && (
//               <p className="text-gray-500">No admissions found.</p>
//             ) // Show only if not loading and empty
//           )}
//         </div>{" "}
//         {/* --- End Admissions List Section --- */}
//       </div>
//     </AdminRoute>
//   );
// }

// pages/admin/index.js
import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Link from "next/link";

export default function AdminHomePage() {
  // You could fetch some overview stats here later if needed

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Admissions
          </h2>
          <p className="text-gray-600 mb-4">
            View and manage student admissions.
          </p>
          <Link href="/admin/admissions">
            <a className="text-blue-600 hover:text-blue-800 font-medium">
              Go to Admissions &rarr;
            </a>
          </Link>
        </div>

        {/* Example Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Gallery</h2>
          <p className="text-gray-600 mb-4">
            Upload and manage gallery images.
          </p>
          <Link href="/admin/gallery">
            <a className="text-blue-600 hover:text-blue-800 font-medium">
              Go to Gallery &rarr;
            </a>
          </Link>
        </div>

        {/* Example Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Blog</h2>
          <p className="text-gray-600 mb-4">Create and manage blog posts.</p>
          <Link href="/admin/blogs/create">
            <a className="text-blue-600 hover:text-blue-800 font-medium">
              Write New Blog Post &rarr;
            </a>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
