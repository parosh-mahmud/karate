// // components/admin/AddTrainerForm.jsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/router";
// import { storage, ref, uploadBytes, getDownloadURL } from "@/lib/firebase"; // Import storage functions

// export default function AddTrainerForm() {
//   const [form, setForm] = useState({
//     name: "",
//     specialization: "",
//     bio: "",
//     // We'll manage photoUrl internally now, not as a direct input
//   });
//   const [selectedFile, setSelectedFile] = useState(null); // To hold the selected file
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const [successMessage, setSuccessMessage] = useState(""); // For success message
//   const handleChange = (e) => {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     } else {
//       setSelectedFile(null); // Clear selected file if nothing is chosen
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccessMessage(""); // Clear any previous success message

//     try {
//       if (!selectedFile) {
//         throw new Error("Please select a photo for the trainer.");
//       }

//       // 1. Upload photo to Firebase Storage
//       const storageRef = ref(
//         storage,
//         `trainer-photos/${Date.now()}_${selectedFile.name}`
//       );
//       const uploadTask = await uploadBytes(storageRef, selectedFile);
//       console.log("Upload Task:", uploadTask);

//       const photoUrl = await getDownloadURL(uploadTask.ref);
//       console.log("Photo URL:", photoUrl);

//       // 2. Prepare data for API
//       const trainerData = {
//         ...form,
//         photoUrl, // Use the URL obtained from Firebase Storage
//       };

//       // 3. Send data to API
//       const res = await fetch("/api/trainers", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(trainerData), // Send the data with the actual photoUrl
//       });

//       if (!res.ok) {
//         const { error: msg } = await res.json();
//         throw new Error(msg || res.statusText);
//       }

//       // On success, display success message
//       setSuccessMessage("Trainer added successfully!");
//       setForm({ name: "", specialization: "", bio: "" }); // Clear the form
//       setSelectedFile(null); // Clear the selected file
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto py-8">
//       <h2 className="text-2xl font-bold mb-6">Add New Trainer</h2>
//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium mb-1">
//             Name
//           </label>
//           <input
//             id="name"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="specialization"
//             className="block text-sm font-medium mb-1"
//           >
//             Specialization
//           </label>
//           <input
//             id="specialization"
//             name="specialization"
//             value={form.specialization}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label htmlFor="bio" className="block text-sm font-medium mb-1">
//             Bio
//           </label>
//           <textarea
//             id="bio"
//             name="bio"
//             value={form.bio}
//             onChange={handleChange}
//             required
//             rows={4}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         {/* New Photo Upload Input */}
//         <div>
//           <label htmlFor="photo" className="block text-sm font-medium mb-1">
//             Trainer Photo
//           </label>
//           <input
//             id="photo"
//             name="photo"
//             type="file" // Changed to type="file"
//             accept="image/*" // Restrict to image files
//             onChange={handleFileChange}
//             required // Make sure a file is selected
//             className="w-full border px-3 py-2 rounded"
//           />
//           {selectedFile && (
//             <p className="text-sm text-gray-500 mt-1">
//               Selected: {selectedFile.name}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           {loading ? "Saving…" : "Save Trainer"}
//         </button>
//       </form>
//     </div>
//   );
// }

// components/admin/AddTrainerForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage, ref, uploadBytes, getDownloadURL } from "@/lib/firebase"; // Import storage functions
import { db } from "@/utils/firebase"; // Import your Firebase configuration
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function AddTrainerForm() {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    bio: "",
    // We'll manage photoUrl internally now, not as a direct input
  });
  const [selectedFile, setSelectedFile] = useState(null); // To hold the selected file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const [trainers, setTrainers] = useState([]); // State to hold trainers list

  useEffect(() => {
    // Fetch trainers on component mount
    const fetchTrainers = async () => {
      try {
        const trainersCollection = collection(db, "trainers");
        const trainerSnapshot = await getDocs(trainersCollection);
        const trainerList = trainerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrainers(trainerList);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Failed to load trainers. Please try again.");
      }
    };

    fetchTrainers();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null); // Clear selected file if nothing is chosen
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage(""); // Clear any previous success message

    try {
      if (!selectedFile) {
        throw new Error("Please select a photo for the trainer.");
      }

      // 1. Upload photo to Firebase Storage
      const storageRef = ref(
        storage,
        `trainer-photos/${Date.now()}_${selectedFile.name}`
      );
      const uploadTask = await uploadBytes(storageRef, selectedFile);
      console.log("Upload Task:", uploadTask);

      const photoUrl = await getDownloadURL(uploadTask.ref);
      console.log("Photo URL:", photoUrl);

      // 2. Prepare data for API
      const trainerData = {
        ...form,
        photoUrl, // Use the URL obtained from Firebase Storage
      };

      // 3. Send data to API
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trainerData), // Send the data with the actual photoUrl
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || res.statusText);
      }

      // On success, display success message
      setSuccessMessage("Trainer added successfully!");
      setForm({ name: "", specialization: "", bio: "" }); // Clear the form
      setSelectedFile(null); // Clear the selected file

      // Refresh trainers list
      const trainersCollection = collection(db, "trainers");
      const trainerSnapshot = await getDocs(trainersCollection);
      const trainerList = trainerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrainers(trainerList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrainer = async (id) => {
    try {
      setLoading(true);
      setError("");
      // Delete the trainer from Firestore
      const trainerDocRef = doc(db, "trainers", id);
      await deleteDoc(trainerDocRef);

      // Update the trainers list
      const updatedTrainers = trainers.filter((trainer) => trainer.id !== id);
      setTrainers(updatedTrainers);
      setSuccessMessage("Trainer deleted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Add New Trainer</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium mb-1"
          >
            Specialization
          </label>
          <input
            id="specialization"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* New Photo Upload Input */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium mb-1">
            Trainer Photo
          </label>
          <input
            id="photo"
            name="photo"
            type="file" // Changed to type="file"
            accept="image/*" // Restrict to image files
            onChange={handleFileChange}
            required // Make sure a file is selected
            className="w-full border px-3 py-2 rounded"
          />
          {selectedFile && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Saving…" : "Save Trainer"}
        </button>
      </form>

      {/* Trainers List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Trainers List</h2>
        {loading && <p>Loading trainers...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {trainers.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left font-semibold">Name</th>
                <th className="text-left font-semibold">Specialization</th>
                <th className="text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr key={trainer.id} className="border-b">
                  <td className="py-2">{trainer.name}</td>
                  <td className="py-2">{trainer.specialization}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDeleteTrainer(trainer.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No trainers found.</p>
        )}
      </div>
    </div>
  );
}
