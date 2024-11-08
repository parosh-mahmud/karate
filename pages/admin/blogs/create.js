// pages/admin/blogs/create.js

import { useState } from "react";
import { db } from "../../../utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import AdminRoute from "../../../components/adminroutes/adminRoutes";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Ensure the correct path

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";

      if (formData.image) {
        // Convert the image file to a base64 string
        const reader = new FileReader();
        const imageUploadPromise = new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
        });
        reader.readAsDataURL(formData.image);
        const base64Image = await imageUploadPromise;

        // Upload the image via API route
        const response = await fetch("/api/uploadBlogImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await response.json();

        if (response.ok) {
          imageUrl = data.url;
        } else {
          throw new Error(data.error || "Image upload failed");
        }
      }

      await addDoc(collection(db, "blogs"), {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        author: formData.author,
        image: imageUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      router.push("/admin");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Error creating blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            ></textarea>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              className="mt-1"
              theme="snow"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {isSubmitting ? "Submitting..." : "Create Blog"}
          </button>
        </form>
      </div>
    </AdminRoute>
  );
}
