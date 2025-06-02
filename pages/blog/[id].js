//pages/blog/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import DOMPurify from "dompurify";
import Image from "next/image"; // Import Image component
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";

const BlogDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        setLoading(true); // Set loading to true when fetching starts
        setError(null); // Clear any previous errors
        try {
          const blogRef = doc(db, "blogs", id);
          const blogSnap = await getDoc(blogRef);

          if (blogSnap.exists()) {
            setBlog({ id: blogSnap.id, ...blogSnap.data() });
          } else {
            setError("Blog post not found!");
            console.log("No such document!");
          }
        } catch (err) {
          setError("Failed to load blog post.");
          console.error("Error fetching blog:", err);
        } finally {
          setLoading(false); // Set loading to false when fetching is complete
        }
      };

      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brandAccent border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mx-auto max-w-md">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return <p>Loading...</p>;
  }

  const shareUrl = `https://yourdomain.com/blog/${id}`; // Replace with your actual domain

  // Sanitize the blog content
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <>
      <Head>
        <title>{blog.title} - JK Combat Academy</title>
        <meta name="description" content={blog.description} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:site_name" content="JK Combat Academy" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.description} />
        <meta name="twitter:image" content={blog.image} />
      </Head>

      <div className="container mx-auto px-6 py-16 font-body">
        {/* Blog Image */}
        <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>

        {/* Blog Title */}
        <h2 className="text-4xl font-header font-bold text-brandTextPrimary dark:text-brandBackground mb-4">
          {blog.title}
        </h2>

        {/* Blog Description */}
        <p className="text-brandTextSecondary dark:text-slate-400 mb-4">
          {blog.description}
        </p>

        {/* Blog Meta */}
        <div className="text-brandTextMuted dark:text-slate-500 text-sm mb-4">
          By {blog.author} •{" "}
          {new Date(blog.createdAt?.toDate()).toLocaleDateString()}
        </div>

        {/* Blog Content */}
        <div
          className="text-brandTextPrimary dark:text-slate-300 mt-6 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Social Share Buttons */}
        <div className="flex space-x-4 mt-8">
          <FacebookShareButton url={shareUrl} quote={blog.title}>
            <FacebookIcon size={32} round bgStyle={{ fill: "#0284C7" }} />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={blog.title}>
            <TwitterIcon size={32} round bgStyle={{ fill: "#0284C7" }} />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl} summary={blog.description}>
            <LinkedinIcon size={32} round bgStyle={{ fill: "#0284C7" }} />
          </LinkedinShareButton>
          <WhatsappShareButton url={shareUrl} title={blog.title}>
            <WhatsappIcon size={32} round bgStyle={{ fill: "#0284C7" }} />
          </WhatsappShareButton>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
