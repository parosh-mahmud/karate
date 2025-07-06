import { useState } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

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
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      // Create preview URL
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
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
    setError("");

    try {
      const blogData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        author: formData.author,
      };

      // Upload image if selected
      if (formData.image) {
        const imageRef = ref(
          storage,
          `blog-images/${Date.now()}_${formData.image.name}`
        );
        const uploadResult = await uploadBytes(imageRef, formData.image);
        const imageUrl = await getDownloadURL(uploadResult.ref);
        blogData.image = imageUrl;
      }

      // Send to your API endpoint
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog post");
      }

      // Redirect on success
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      setError(error.message || "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
          Create New Blog
        </h1>
        <Link
          href="/admin/blogs"
          className="flex items-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-brandTextPrimary dark:text-slate-100 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          Back to Blogs
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-2">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-200"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-2">
              Content
            </label>
            <div className="prose max-w-none">
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                theme="snow"
                className="bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-200"
              />
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-2">
              Author
            </label>
            <input
              type="text"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-200"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-brandTextPrimary dark:text-slate-200 mb-2">
              Featured Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-brandAccent file:text-white
                    hover:file:bg-brandAccentHover
                    file:cursor-pointer"
              />
              {previewUrl && (
                <div className="relative w-24 h-24">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brandAccent hover:bg-brandAccentHover text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Creating...
                </span>
              ) : (
                "Create Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateBlog.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
