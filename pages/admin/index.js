// pages/admin/index.js
import React from "react";
import Link from "next/link";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Admissions */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Admissions
          </h2>
          <p className="text-gray-600 mb-4">
            View and manage student admissions.
          </p>
          <Link
            href="/admin/admissions"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go to Admissions &rarr;
          </Link>
        </div>

        {/* Gallery */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Gallery</h2>
          <p className="text-gray-600 mb-4">
            Upload and manage gallery images.
          </p>
          <Link
            href="/admin/gallery"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go to Gallery &rarr;
          </Link>
        </div>

        {/* Blog */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Blog</h2>
          <p className="text-gray-600 mb-4">Create and manage blog posts.</p>
          <Link
            href="/admin/blogs/create"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Write New Blog Post &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wrap this page in AdminLayout
AdminHomePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
