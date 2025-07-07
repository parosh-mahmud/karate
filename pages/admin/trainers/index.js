// pages/admin/trainers/index.js
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// --- ICONS ---
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default function TrainersListPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Listen for real-time updates from Firestore
    const q = query(collection(db, "trainers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const trainersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrainers(trainersList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching trainers:", err);
        setError("Failed to load trainers.");
        setLoading(false);
      }
    );
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const openDeleteModal = (trainer) => {
    setTrainerToDelete(trainer);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!trainerToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/trainers/${trainerToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete trainer.");
      // UI will update automatically due to onSnapshot, but we can close the modal
      setShowDeleteModal(false);
      setTrainerToDelete(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return <div className="p-6 text-center">Loading trainers...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
          Manage Trainers
        </h1>
        <Link
          href="/admin/trainers/create"
          className="flex items-center bg-brandAccent hover:bg-brandAccentHover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          <PlusIcon /> Add New Trainer
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col text-center"
          >
            <img
              src={trainer.photoUrl}
              alt={trainer.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-bold text-lg text-brandTextPrimary dark:text-slate-100">
                {trainer.name}
              </h3>
              <p className="text-brandAccent text-sm mb-2">
                {trainer.specialization}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow">
                {trainer.bio}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-center space-x-2">
                <button
                  disabled
                  className="flex items-center text-xs bg-blue-100 text-blue-600 font-semibold py-1 px-3 rounded-md cursor-not-allowed opacity-50"
                >
                  <EditIcon /> Edit
                </button>
                <button
                  onClick={() => openDeleteModal(trainer)}
                  className="flex items-center text-xs bg-red-100 text-red-600 hover:bg-red-200 font-semibold py-1 px-3 rounded-md transition-colors"
                >
                  <DeleteIcon /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete trainer "{trainerToDelete?.name}"?
              This will also remove their photo permanently.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="py-2 px-4 bg-slate-200 hover:bg-slate-300 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

TrainersListPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
