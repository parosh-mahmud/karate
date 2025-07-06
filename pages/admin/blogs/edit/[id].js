// pages/admin/blogs/edit/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import styles for React Quill

// Firebase imports
import {
  db,
  storage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    image: "",
    imageFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing blog data
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const blogRef = doc(db, "blogs", id);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          const data = blogSnap.data();
          setFormData({
            title: data.title || "",
            description: data.description || "",
            content: data.content || "",
            author: data.author || "",
            image: data.image || "",
            imageFile: null,
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;

      if (formData.imageFile) {
        // Upload new image to Firebase Storage
        const file = formData.imageFile;
        const path = `blogImages/${id}/${file.name}`;
        const imgRef = storageRef(storage, path);
        const uploadTask = uploadBytesResumable(imgRef, file);

        // Wait for upload to complete
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (err) => reject(err),
            () => resolve()
          );
        });

        // Get download URL
        imageUrl = await getDownloadURL(imgRef);
      }

      // Update Firestore document
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        author: formData.author,
        image: imageUrl,
        updatedAt: Timestamp.now(),
      });

      router.push("/admin");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while fetching
  if (!formData.title && !formData.description && !formData.content) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
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

        {/* Current Image */}
        {formData.image && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Image
            </label>
            <img
              src={formData.image}
              alt="Current Featured Image"
              className="mt-1 h-48 w-auto rounded-md"
            />
          </div>
        )}

        {/* New Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Change Featured Image
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
          {isSubmitting ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
