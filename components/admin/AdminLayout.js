// components/admin/AdminLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* fixed-width sidebar on the left */}
      <Sidebar />

      {/* main area: header + scrollable content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* top header */}
        <Header />

        {/* page content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}
