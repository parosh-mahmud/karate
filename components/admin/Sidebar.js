// components/admin/Sidebar.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeIcon,
  NewspaperIcon, // Example Icon
  PhotographIcon, // Example Icon
  UserGroupIcon, // Example Icon
  PencilAltIcon, // Example Icon
  // Import other icons as needed from libraries like heroicons
} from "@heroicons/react/outline"; // Install @heroicons/react: npm install @heroicons/react

const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Admissions", href: "/admin/admissions", icon: UserGroupIcon },
  { name: "Gallery", href: "/admin/gallery", icon: PhotographIcon },
  { name: "Blog Posts", href: "/admin/blogs", icon: NewspaperIcon }, // Link to blog list/management
  { name: "Write Blog", href: "/admin/blogs/create", icon: PencilAltIcon },
  // Add more links as needed
];

const Sidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 flex flex-col fixed h-full shadow-lg">
      {/* Logo/Title Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <span className="text-2xl font-bold text-white">JK Combat</span>
        {/* Or replace with an actual logo */}
        {/* <img src="/logo-white.png" alt="Logo" className="h-8 w-auto" /> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <a
              className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition duration-150 ease-in-out group ${
                // Check for exact match or parent path match for nested routes
                currentPath === item.href ||
                (item.href !== "/admin" && currentPath.startsWith(item.href))
                  ? "bg-blue-600 text-white shadow-inner"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon
                className="mr-3 flex-shrink-0 h-6 w-6"
                aria-hidden="true"
              />
              {item.name}
            </a>
          </Link>
        ))}
      </nav>

      {/* Optional Footer Area */}
      {/* <div className="p-4 border-t border-gray-700"> ... </div> */}
    </aside>
  );
};

export default Sidebar;
