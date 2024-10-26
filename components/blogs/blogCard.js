import React from "react";
import Link from "next/link";

const BlogCard = ({ blog }) => {
  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          {blog.title}
        </h2>
        <p className="text-gray-600 mb-4">{blog.description}</p>
        <div className="text-gray-500 text-sm">
          By {blog.author} • {blog.timeAgo}
        </div>
        <Link href={`/blog/${blog.id}`}>
          <a className="text-blue-500 hover:underline mt-4 block">
            Read more...
          </a>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
