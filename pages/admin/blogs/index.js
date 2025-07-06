//admin/blogs/index.js
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

// --- ICONS for UI ---
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

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setBlogToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blogs/${blogToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete blog post");
      }

      // Update UI instantly
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
      closeDeleteModal();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message); // Or use a more sophisticated notification system
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading posts...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
          Manage Blogs
        </h1>
        <Link
          href="/admin/blogs/create"
          className="flex items-center bg-brandAccent hover:bg-brandAccentHover text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <PlusIcon />
          Create New Blog
        </Link>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col"
          >
            <img
              src={
                blog.image ||
                "https://via.placeholder.com/400x200?text=No+Image"
              }
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 flex-grow flex flex-col">
              <h2 className="text-xl font-bold text-brandTextPrimary dark:text-slate-100 mb-2">
                {blog.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                By {blog.author} on{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="text-brandTextSecondary dark:text-slate-300 flex-grow">
                {blog.description}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
                <Link
                  href={`/admin/blogs/edit/${blog.id}`}
                  className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  <EditIcon /> Edit
                </Link>
                <button
                  onClick={() => openDeleteModal(blog)}
                  className="flex items-center text-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  <DeleteIcon /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-brandTextPrimary dark:text-slate-200">
            No Blog Posts Yet
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Click "Create New Blog" to get started.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-brandTextPrimary dark:text-slate-100 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-brandTextSecondary dark:text-slate-300 mb-6">
              Are you sure you want to delete the blog post titled "
              {blogToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="py-2 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-brandTextPrimary dark:text-slate-100 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isDeleting && (
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
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

BlogListPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
