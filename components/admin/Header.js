// components/admin/Header.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

const Header = () => {
  const { user, logout } = useAuth() || {}; // Use your actual auth context hook
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error display if needed
    }
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      {/* Left side - could be page title or breadcrumbs */}
      <div>
        <h1 className="text-xl font-semibold text-gray-700">Admin Panel</h1>
      </div>

      {/* Right side - User menu / Logout */}
      <div className="flex items-center">
        {user && (
          <span className="text-sm text-gray-600 mr-4 hidden sm:inline">
            Welcome, {user.displayName || user.email}
          </span>
        )}
        {logout && (
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
