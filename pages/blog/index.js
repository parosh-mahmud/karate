// pages/blog/index.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Head from "next/head";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Head>
        <title>Blog - JK Combat Academy</title>
        <meta
          name="description"
          content="Read our latest articles on martial arts, training tips, and combat techniques."
        />
      </Head>

      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
            Latest Blog Posts
          </h1>
          <p className="mt-4 text-brandTextSecondary dark:text-slate-400">
            Stay updated with the latest insights, training tips, and combat
            techniques
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brandAccent border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mx-auto max-w-md">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brandTextSecondary dark:text-slate-400">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                {blog.image && (
                  <div className="relative h-48 w-full">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-brandTextPrimary dark:text-brandBackground mb-2">
                    {blog.title}
                  </h2>

                  <p className="text-brandTextSecondary dark:text-slate-400 mb-4 line-clamp-3">
                    {blog.description}
                  </p>

                  <div className="flex items-center text-sm text-brandTextMuted dark:text-slate-500 mb-4">
                    <span>By {blog.author || "Unknown"}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt.toDate()).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </span>
                  </div>

                  {/* <Link> no longer wraps an <a>—we pass className directly to <Link> */}
                  <Link
                    href={`/blog/${blog.id}`}
                    className="inline-block px-4 py-2 bg-brandAccent text-white rounded hover:bg-brandAccentDark transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default BlogPage;
