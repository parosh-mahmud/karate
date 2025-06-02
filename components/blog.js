// components/BlogSection.jsx
import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase"; // Adjust this import path if needed
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

// Simple spinner for loading state
const Spinner = ({ size = "w-8 h-8", color = "border-blue-500" }) => (
  <div
    className={`animate-spin rounded-full ${size} border-4 border-t-transparent ${color}`}
  ></div>
);

// Utility to compute “time ago” from a Firestore Timestamp
function timeAgo(timestamp) {
  if (!timestamp || !timestamp.toDate) return "";
  const now = new Date();
  const created = timestamp.toDate();
  const seconds = Math.floor((now - created) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const blogsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled",
            description: data.description || "",
            author: data.author || "Unknown",
            image: data.image || "/default-blog.jpg", // fallback image
            createdAt: data.createdAt,
          };
        });

        setBlogs(blogsData);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-wide text-gray-800 dark:text-gray-100">
        Recent Blogs
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="w-10 h-10" color="border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400">
            No blog posts available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105 ease-in-out duration-300 group"
            >
              {/* Highlighted border on hover */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-red-500 transition-all duration-300 ease-in-out -z-10"></div>

              {/* Image (with fallback) */}
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-700">
                <img
                  src={blog.image}
                  alt={blog.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-blog.jpg";
                  }}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col h-full">
                <h3 className="font-semibold text-lg text-pink-600 dark:text-pink-400 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {blog.description}
                </p>
                <div className="mt-auto text-gray-600 dark:text-gray-400 text-sm mb-2">
                  By {blog.author} • {timeAgo(blog.createdAt)}
                </div>

                <Link
                  href={`/blog/${blog.id}`}
                  className="text-sm text-blue-500 hover:underline self-end"
                >
                  Read more…
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogSection;
