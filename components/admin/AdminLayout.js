// components/admin/AdminLayout.jsx
import React, { useState, useCallback } from "react";
import Sidebar from "./Sidebar"; // Ensure this path is correct
import Header from "./Header"; // Ensure this path is correct

export default function AdminLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // State for the main (desktop) sidebar's collapsed status
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  // Function to toggle the desktop sidebar's collapsed state
  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopSidebarCollapsed((prev) => !prev);
  }, []);

  // Determine the appropriate margin for the main content area based on desktop sidebar state
  const mainContentMarginLeft = isDesktopSidebarCollapsed
    ? "lg:ml-20"
    : "lg:ml-64"; // Tailwind classes for 5rem and 16rem

  return (
    <div className="flex h-screen bg-brandBackground dark:bg-slate-900 overflow-hidden font-sans">
      {/* --- Sidebar --- */}

      {/* Mobile Sidebar (slides in) */}
      <div
        className={`fixed inset-0 z-40 flex transition-transform duration-300 ease-in-out lg:hidden transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* For the mobile sidebar, we pass isDesktopSidebarCollapsed so its appearance (if it also uses the icons-only look)
          is consistent. The toggle function allows the button within this mobile instance to control the shared state.
          If the mobile sidebar should always appear fully expanded when open, you could pass isCollapsed={false}.
        */}
        <Sidebar
          isCollapsed={isDesktopSidebarCollapsed}
          onToggleCollapse={toggleDesktopSidebar}
        />
        {/* Backdrop for mobile when sidebar is open */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30" // Backdrop is behind sidebar content
            onClick={toggleMobileSidebar}
            aria-hidden="true"
          ></div>
        )}
      </div>

      {/* Desktop Sidebar (fixed, always visible) */}
      {/* This container div is just for conditional rendering on desktop. 
          The Sidebar component itself is fixed. */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isDesktopSidebarCollapsed}
          onToggleCollapse={toggleDesktopSidebar}
        />
      </div>

      {/* --- Main Content Area --- */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${mainContentMarginLeft}`}
      >
        {/* Header */}
        {/* The Header is inside the div that gets the margin, so it will be positioned correctly. */}
        <Header
          toggleMobileSidebar={toggleMobileSidebar}
          // If Header needs to know about desktop sidebar for any other reason, pass it:
          // isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        />

        {/* Page Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// components/admin/Sidebar.js (Modified)
// Make sure to copy this into your actual Sidebar.js file

// import React, { useState, useEffect } from "react"; // Keep useEffect for currentPath
// Original imports for Link, useRouter, Image, and Heroicons should be here.
// For this example, I'm assuming they are present and correct from your previous version.
// Make sure to use standard <a> tags and window.location.pathname if not in a Next.js specific environment for preview.

/*
// Example of what Sidebar.js should now look like (key changes highlighted):
import React, { useState, useEffect } from "react";
// import Link from "next/link"; // Or use <a>
// import { useRouter } from "next/router"; // Or use window.location
import {
  HomeIcon, NewspaperIcon, PhotographIcon, UserGroupIcon, PencilAltIcon, 
  UsersIcon, UserAddIcon, CubeIcon, ShoppingCartIcon, CogIcon,
  ChevronDoubleLeftIcon, ChevronDoubleRightIcon,
} from "@heroicons/react/outline";

const navItems = [
  // ... your navItems array
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Products", href: "/admin/products", icon: CubeIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
  { name: "Admissions", href: "/admin/admissions", icon: UserGroupIcon },
  { name: "Gallery", href: "/admin/gallery", icon: PhotographIcon },
  { name: "Blog Posts", href: "/admin/blogs", icon: NewspaperIcon },
  { name: "Write New Blog", href: "/admin/blogs/create", icon: PencilAltIcon },
  { name: "Trainers", href: "/admin/trainers", icon: UsersIcon },
  { name: "Add Trainer", href: "/admin/trainers/create", icon: UserAddIcon },
];

export default function Sidebar({ isCollapsed, onToggleCollapse }) { // MODIFIED: Accept props
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handleLocationChange = () => {
        setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    // Consider adding listeners for custom navigation events if using a SPA router that doesn't use popstate
    return () => {
        window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // REMOVED: Internal state for isCollapsed and toggleSidebar function
  // const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);
  // const toggleSidebarInternal = () => setIsCollapsedInternal(!isCollapsedInternal);
  // Now uses `isCollapsed` prop and `onToggleCollapse` prop

  return (
    <aside
      className={`bg-gradient-to-b from-brandTextSoft to-brandTextPrimary text-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl font-sans transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64" // Uses isCollapsed prop
      }`}
    >
      <div
        className={`h-20 flex items-center border-b border-slate-700/50 transition-all duration-300 ease-in-out relative ${
          isCollapsed ? "px-0 justify-center" : "px-4 justify-between"
        }`}
      >
        <a // Using <a> tag for broader compatibility in previews
          href="/admin"
          className={`flex items-center group ${
            isCollapsed ? "w-full justify-center" : "space-x-3"
          }`}
          title={isCollapsed ? "JK Combat Admin" : undefined}
        >
          {isCollapsed ? (
            <span className="text-2xl font-bold text-white group-hover:text-brandAccent">
              JK
            </span>
          ) : (
            <span className="text-2xl font-bold text-white group-hover:text-brandAccent font-header truncate">
              JK Combat Admin
            </span>
          )}
        </a>

        <button
          onClick={onToggleCollapse} // MODIFIED: Calls prop
          className="absolute top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-300 hover:text-white hover:bg-brandAccentHover/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brandAccent transition-colors duration-200 right-3"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="h-6 w-6" />
          ) : (
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/admin" &&
              currentPath.startsWith(item.href) &&
              item.href.length > "/admin".length);

          return (
            <a // Using <a> tag
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium group transition-all duration-200 ease-in-out transform hover:translate-x-1
                ${isCollapsed ? "justify-center" : ""}
                ${isActive
                  ? "bg-brandAccent text-brandTextOnAccent shadow-md"
                  : "text-slate-300 hover:bg-brandAccentHover/30 hover:text-white"
                }`}
            >
              <item.icon
                className={`h-5 w-5 flex-shrink-0 transition-colors duration-200
                  ${isCollapsed ? "" : "mr-3"}
                  ${isActive
                    ? "text-brandTextOnAccent"
                    : "text-slate-400 group-hover:text-slate-200"
                  }`}
                aria-hidden="true"
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
*/

// components/admin/Header.jsx (Example - ensure your actual Header component is used)
/*
import React from 'react';
import { MenuIcon } from '@heroicons/react/outline'; // Or your preferred menu icon

export default function Header({ toggleMobileSidebar }) {
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-800 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none"
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 flex justify-center px-4 lg:ml-0 lg:justify-start">
            <span className="text-xl font-semibold text-slate-900 dark:text-white">Admin Dashboard</span>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            {/* User profile, notifications, etc. * /}
            <span className="text-sm text-slate-700 dark:text-slate-300">User Name</span>
          </div>
        </div>
      </div>
    </header>
  );
}
*/
