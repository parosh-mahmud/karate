// components/admin/AddTrainerForm.js
import { useState } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/firebase"; // Import only storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function AddTrainerForm() {
  const [form, setForm] = useState({ name: "", specialization: "", bio: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a photo for the trainer.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // 1. Upload photo
      const storageRef = ref(
        storage,
        `trainer-photos/${Date.now()}_${selectedFile.name}`
      );
      const uploadResult = await uploadBytes(storageRef, selectedFile);
      const photoUrl = await getDownloadURL(uploadResult.ref);

      // 2. Send data to API
      const response = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photoUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add trainer.");
      }

      // 3. Redirect on success
      router.push("/admin/trainers");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-3 bg-white dark:bg-slate-700"
          />
        </div>

        {/* Specialization Input */}
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-1"
          >
            Specialization
          </label>
          <input
            id="specialization"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-3 bg-white dark:bg-slate-700"
          />
        </div>

        {/* Bio Input */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-3 bg-white dark:bg-slate-700 resize-y"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-2">
            Trainer Photo
          </label>
          <div className="mt-1 flex items-center gap-5">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brandAccent/10 file:text-brandAccent hover:file:bg-brandAccent/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/admin/trainers"
            className="py-2 px-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-6 bg-brandAccent hover:bg-brandAccentHover text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Trainer"}
          </button>
        </div>
      </form>
    </div>
  );
}
