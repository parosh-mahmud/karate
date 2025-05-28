// pages/admin/blogs/edit/[id].js
import { useState, useEffect } from "react";
import { db } from "../../../../utils/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import styles for React Quill

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

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const blogRef = doc(db, "blogs", id);
          const blogSnap = await getDoc(blogRef);

          if (blogSnap.exists()) {
            const data = blogSnap.data();
            setFormData({
              id: blogSnap.id,
              title: data.title,
              description: data.description,
              content: data.content,
              author: data.author,
              image: data.image,
              imageFile: null, // Initially, no new image file
            });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      };

      fetchBlog();
    }
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, imageFile: e.target.files[0] });
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
      let imageUrl = formData.image; // Keep existing image URL

      if (formData.imageFile) {
        // If a new image is selected, upload it to Cloudinary via API route

        // Convert the image file to a base64 string
        const reader = new FileReader();
        const imageUploadPromise = new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
        });
        reader.readAsDataURL(formData.imageFile);
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

  if (!formData.id) return <p>Loading...</p>;

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
