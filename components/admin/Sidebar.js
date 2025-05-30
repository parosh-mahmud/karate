// // components/admin/Sidebar.js
// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import Image from "next/image"; // For potential logo
// import {
//   HomeIcon,
//   NewspaperIcon,
//   PhotographIcon,
//   UserGroupIcon,
//   PencilAltIcon, // For Write Blog
//   UsersIcon, // Changed from UserGroupIcon for Trainers for slight differentiation
//   UserAddIcon, // For Add Trainer
//   CubeIcon, // Example for Products
//   ShoppingCartIcon, // Example for Orders
//   CogIcon, // Example for Settings
// } from "@heroicons/react/outline"; // Heroicons v1 (outline style)

// // Define navigation items, including new ones for Products and Orders
// const navItems = [
//   { name: "Dashboard", href: "/admin", icon: HomeIcon },
//   { name: "Products", href: "/admin/products", icon: CubeIcon }, // New
//   { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon }, // New
//   { name: "Admissions", href: "/admin/admissions", icon: UserGroupIcon }, // Kept UserGroupIcon for consistency
//   { name: "Gallery", href: "/admin/gallery", icon: PhotographIcon },
//   { name: "Blog Posts", href: "/admin/blogs", icon: NewspaperIcon },
//   { name: "Write New Blog", href: "/admin/blogs/create", icon: PencilAltIcon },
//   { name: "Trainers", href: "/admin/trainers", icon: UsersIcon }, // Using UsersIcon
//   { name: "Add Trainer", href: "/admin/trainers/create", icon: UserAddIcon },
//   // { name: "Settings", href: "/admin/settings", icon: CogIcon }, // Example for future
// ];

// export default function Sidebar() {
//   const router = useRouter();
//   const currentPath = router.pathname;

//   return (
//     <aside className="w-64 bg-gradient-to-b from-brandTextSoft to-brandTextPrimary text-slate-200 flex flex-col fixed inset-y-0 left-0 z-30 shadow-2xl font-sans">
//       {/* Logo/Title Section */}
//       <div className="h-20 flex items-center justify-center px-4 border-b border-slate-700/50">
//         <Link href="/admin" className="flex items-center space-x-3 group">
//           {/* Optional: Replace with your actual logo if you have one */}
//           {/* <Image src="/admin-logo.png" width={40} height={40} alt="Admin Panel Logo" className="rounded-md" /> */}
//           <span className="text-2xl font-bold text-white group-hover:text-brandAccent transition-colors duration-200 font-header truncate">
//             JK Combat Admin
//           </span>
//         </Link>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
//         {navItems.map((item) => {
//           // More robust active state check:
//           // 1. Exact match for href.
//           // 2. For parent routes (like /admin/blogs), active if currentPath starts with item.href.
//           //    Ensure item.href isn't just "/admin" to avoid highlighting it for all sub-routes unless intended.
//           const isActive =
//             currentPath === item.href ||
//             (item.href !== "/admin" &&
//               currentPath.startsWith(item.href) &&
//               item.href.length > "/admin".length);

//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium group transition-all duration-200 ease-in-out transform hover:translate-x-1
//                 ${
//                   isActive
//                     ? "bg-brandAccent text-brandTextOnAccent shadow-md" // Active state uses brandAccent
//                     : "text-slate-300 hover:bg-brandAccentHover/30 hover:text-white" // Default and hover state
//                 }`}
//             >
//               <item.icon
//                 className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
//                   ${
//                     isActive
//                       ? "text-brandTextOnAccent"
//                       : "text-slate-400 group-hover:text-slate-200"
//                   }`}
//                 aria-hidden="true"
//               />
//               <span className="truncate">{item.name}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Optional Footer in Sidebar (e.g., Logout or User Profile) */}
//       {/* <div className="p-4 mt-auto border-t border-slate-700/50">
//         <Link
//           href="/logout" // Or a profile link
//           className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-red-600 hover:text-white group transition-colors duration-200"
//         >
//           <LogoutIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-200" aria-hidden="true" />
//           Logout
//         </Link>
//       </div> */}
//     </aside>
//   );
// }

// components/admin/Sidebar.js
import React, { useState, useEffect } from "react";
// import Link from "next/link"; // Removed Next.js Link
// import { useRouter } from "next/router"; // Removed Next.js router
// import Image from "next/image"; // For potential logo - this would also need to be handled if used

import {
  HomeIcon,
  NewspaperIcon,
  PhotographIcon,
  UserGroupIcon,
  PencilAltIcon,
  UsersIcon,
  UserAddIcon,
  CubeIcon,
  ShoppingCartIcon,
  CogIcon, // Example for Settings
  ChevronDoubleLeftIcon, // Icon for collapsing the sidebar
  ChevronDoubleRightIcon, // Icon for expanding the sidebar
  // LogoutIcon, // Import if you implement the optional footer with a logout icon
} from "@heroicons/react/outline"; // Heroicons v1 (outline style)

// Define navigation items, including new ones for Products and Orders
const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Products", href: "/admin/products", icon: CubeIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
  { name: "Admissions", href: "/admin/admissions", icon: UserGroupIcon },
  { name: "Gallery", href: "/admin/gallery", icon: PhotographIcon },
  { name: "Write New Blog", href: "/admin/blogs/create", icon: PencilAltIcon },
  { name: "Add Trainer", href: "/admin/trainers/create", icon: UserAddIcon },
  // { name: "Settings", href: "/admin/settings", icon: CogIcon }, // Example for future
];

export default function Sidebar() {
  // const router = useRouter(); // Replaced with window.location.pathname
  // const currentPath = router.pathname; // Replaced
  const [currentPath, setCurrentPath] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse

  useEffect(() => {
    // Set the current path on component mount and when URL changes (for basic SPA-like behavior if using a router elsewhere)
    setCurrentPath(window.location.pathname);

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen to popstate for browser back/forward navigation
    window.addEventListener("popstate", handleLocationChange);

    // Clean up the event listener
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  // Function to toggle sidebar state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`bg-gradient-to-b from-brandTextSoft to-brandTextPrimary text-slate-200 flex flex-col fixed inset-y-0 left-0 z-30 shadow-2xl font-sans transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64" // Dynamic width based on collapsed state
      }`}
    >
      {/* Header Section: Contains Logo and Toggle Button */}
      <div
        className={`h-20 flex items-center border-b border-slate-700/50 transition-all duration-300 ease-in-out relative ${
          isCollapsed ? "px-0 justify-center" : "px-4 justify-between" // Adjust padding and justification
        }`}
      >
        {/* Logo/Title Area */}
        <a // Replaced Link with <a>
          href="/admin"
          className={`flex items-center group ${
            isCollapsed ? "w-full justify-center" : "space-x-3" // Full width and centered when collapsed
          }`}
          title={isCollapsed ? "JK Combat Admin" : undefined} // Show full title on hover when collapsed
        >
          {/* Optional: Replace with your actual logo image component */}
          {/* <img // Replaced Next/Image with <img>
            src={isCollapsed ? "/admin-logo-small.png" : "/admin-logo.png"} 
            width={isCollapsed ? 32 : 40} // Adjust size accordingly
            height={isCollapsed ? 32 : 40} 
            alt="Admin Panel Logo" 
            className="rounded-md" 
          /> 
          */}

          {isCollapsed ? (
            // Display initials or a very small icon when collapsed
            <span className="text-2xl font-bold text-white group-hover:text-brandAccent">
              JK
            </span>
          ) : (
            // Display full title when expanded
            <span className="text-2xl font-bold text-white group-hover:text-brandAccent font-header truncate">
              JK Combat Admin
            </span>
          )}
        </a>

        {/* Toggle Button: Positioned absolutely on the right edge of the sidebar header */}
        <button
          onClick={toggleSidebar}
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

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/admin" &&
              currentPath.startsWith(item.href) &&
              item.href.length > "/admin".length);

          return (
            <a // Replaced Link with <a>
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined} // Show item name as tooltip when collapsed
              className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium group transition-all duration-200 ease-in-out transform hover:translate-x-1
                ${
                  isCollapsed ? "justify-center" : "" // Center icon when collapsed
                }
                ${
                  isActive
                    ? "bg-brandAccent text-brandTextOnAccent shadow-md" // Active state
                    : "text-slate-300 hover:bg-brandAccentHover/30 hover:text-white" // Default and hover state
                }`}
            >
              <item.icon
                className={`h-5 w-5 flex-shrink-0 transition-colors duration-200
                  ${
                    isCollapsed ? "" : "mr-3" // Remove margin from icon when collapsed
                  }
                  ${
                    isActive
                      ? "text-brandTextOnAccent"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                aria-hidden="true"
              />
              {/* Show item name only when not collapsed */}
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </a>
          );
        })}
      </nav>

      {/* Optional Footer in Sidebar (e.g., Logout or User Profile) */}
      {/* If you use this, ensure it also adapts to the collapsed state. */}
      {/* <div className={`p-4 mt-auto border-t border-slate-700/50 ${isCollapsed ? 'px-1' : 'px-4'}`}>
        <a // Replaced Link with <a>
          href="/logout" // Or a profile link
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-red-600 hover:text-white group transition-colors duration-200 w-full ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogoutIcon // Make sure to import LogoutIcon if used
            className={`h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-200 ${isCollapsed ? '' : 'mr-3'}`} 
            aria-hidden="true" 
          />
          {!isCollapsed && <span className="truncate">Logout</span>}
        </a>
      </div> 
      */}
    </aside>
  );
}
