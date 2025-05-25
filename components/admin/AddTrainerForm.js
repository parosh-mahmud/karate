// components/admin/AddTrainerForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function AddTrainerForm() {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    bio: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || res.statusText);
      }
      // on success, go back to trainers list
      router.push("/admin/trainers");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Add New Trainer</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

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

        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium mb-1">
            Photo URL
          </label>
          <input
            id="photoUrl"
            name="photoUrl"
            type="url"
            value={form.photoUrl}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Saving…" : "Save Trainer"}
        </button>
      </form>
    </div>
  );
}
