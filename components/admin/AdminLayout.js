// components/admin/AdminLayout.js
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AdminRoute from "../adminroutes/adminRoutes"; // Import your route protection

const AdminLayout = ({ children }) => {
  return (
    // Use AdminRoute to protect the entire layout
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="flex-1 flex flex-col ml-64">
          {" "}
          {/* Adjust ml value to match sidebar width */}
          {/* Header */}
          <Header />
          {/* Main Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children} {/* Where the page content will be rendered */}
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminLayout;
