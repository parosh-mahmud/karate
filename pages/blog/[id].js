// pages/blog/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import DOMPurify from "dompurify"; // Import DOMPurify
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

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const blogRef = doc(db, "blogs", id);
          const blogSnap = await getDoc(blogRef);

          if (blogSnap.exists()) {
            setBlog({ id: blogSnap.id, ...blogSnap.data() });
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

  if (!blog) return <p>Loading...</p>;

  const shareUrl = `https://yourdomain.com/blog/${id}`; // Replace with your actual domain

  // Sanitize the blog content
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.description} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:site_name" content="Your Site Name" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.description} />
        <meta name="twitter:image" content={blog.image} />
      </Head>

      <div className="container mx-auto px-6 py-16">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto mb-6 rounded-lg"
        />
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h2>
        <p className="text-gray-600 mb-4">{blog.description}</p>
        <div className="text-gray-500 text-sm mb-4">
          By {blog.author} •{" "}
          {new Date(blog.createdAt?.toDate()).toLocaleDateString()}
        </div>
        {/* Render the sanitized content */}
        <div
          className="text-gray-700 mt-6"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></div>

        {/* Social Share Buttons */}
        <div className="flex space-x-4 mt-8">
          <FacebookShareButton url={shareUrl} quote={blog.title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={blog.title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl} summary={blog.description}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <WhatsappShareButton url={shareUrl} title={blog.title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
