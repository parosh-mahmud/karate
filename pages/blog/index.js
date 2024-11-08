// pages/blog/index.js
import { useState, useEffect } from "react";
import BlogCard from "../../components/blogs/BlogCard";
import { db } from "../../utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const BlogPage = () => {
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
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Blog</h1>
        <p className="mt-4 text-gray-600">
          Inspirational blog designs for inspiration.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default BlogPage;
