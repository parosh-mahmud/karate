// components/BlogSection.jsx
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
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

  for (let interval of intervals) {
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
        const snapshot = await getDocs(q);

        const blogsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled",
            description: data.description || "",
            author: data.author || "Unknown",
            image: data.image || "/default-blog.jpg",
            createdAt: data.createdAt, // Keep as Firestore Timestamp object for timeAgo function
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
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-800 dark:text-gray-100">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300 group flex flex-col"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700">
                <img
                  src={blog.image}
                  alt={blog.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-blog.jpg";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                  {blog.description}
                </p>

                {/* ## FIX IS HERE ## */}
                {/* This footer is pushed to the bottom of the card with mt-auto */}
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    By {blog.author} &bull; {timeAgo(blog.createdAt)}
                  </div>

                  <Link
                    href={`/blog/${blog.id}`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Read more &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogSection;
