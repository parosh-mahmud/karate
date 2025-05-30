import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase"; // Ensure this path is correct to import your Firebase config
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link"; // Import the Link component from Next.js

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center my-10 tracking-wide text-gray-800">
        Recent Blogs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="relative bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 ease-in-out group overflow-hidden"
          >
            <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-red-500 transition-all duration-300 ease-in-out -z-10"></div>
            <div className="h-48 w-full overflow-hidden rounded-t-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex flex-col h-auto">
              <h3
                className="font-semibold text-lg"
                style={{ color: "#E5287C" }}
              >
                {blog.title}
              </h3>
              <p className="text-gray-700 mt-2 mb-4">{blog.description}</p>
              <div className="text-gray-600 text-sm mt-auto">
                By {blog.author} | {blog.timeAgo}
              </div>
            </div>
            <Link // Use the Link component
              href={`/blog/${blog.id}`} // Construct the dynamic URL
              className="text-sm text-blue-500 hover:underline absolute bottom-4 right-4"
            >
              Read more...
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
