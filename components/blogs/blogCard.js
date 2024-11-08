// components/blogs/BlogCard.js
import Link from "next/link";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
        <p className="text-gray-600 mb-4">{blog.description}</p>
        <Link href={`/blog/${blog.id}`}>
          <a className="text-indigo-600 hover:text-indigo-800">Read more</a>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
