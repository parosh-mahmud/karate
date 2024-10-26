import { useRouter } from "next/router";
import blogs from "../../data/blogs";
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
  const blog = blogs.find((blog) => blog.id === parseInt(id));
  const shareUrl = `https://karate-deploy.vercel.app/blog/${id}`; // Replace with your actual domain

  if (!blog) return <p>Blog not found</p>;

  return (
    <div className="container mx-auto px-6 py-16">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-auto mb-6 rounded-lg"
      />
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h2>
      <p className="text-gray-600 mb-4">{blog.description}</p>
      <div className="text-gray-500 text-sm mb-4">
        By {blog.author} • {blog.timeAgo}
      </div>
      <p className="text-gray-700 mt-6">{blog.content}</p>

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
  );
};

export default BlogDetail;
