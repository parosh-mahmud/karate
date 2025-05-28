// components/admin/Sidebar.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image"; // For potential logo
import {
  HomeIcon,
  NewspaperIcon,
  PhotographIcon,
  UserGroupIcon,
  PencilAltIcon, // For Write Blog
  UsersIcon, // Changed from UserGroupIcon for Trainers for slight differentiation
  UserAddIcon, // For Add Trainer
  CubeIcon, // Example for Products
  ShoppingCartIcon, // Example for Orders
  CogIcon, // Example for Settings
} from "@heroicons/react/outline"; // Heroicons v1 (outline style)

// Define navigation items, including new ones for Products and Orders
const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Products", href: "/admin/products", icon: CubeIcon }, // New
  { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon }, // New
  { name: "Admissions", href: "/admin/admissions", icon: UserGroupIcon }, // Kept UserGroupIcon for consistency
  { name: "Gallery", href: "/admin/gallery", icon: PhotographIcon },
  { name: "Blog Posts", href: "/admin/blogs", icon: NewspaperIcon },
  { name: "Write New Blog", href: "/admin/blogs/create", icon: PencilAltIcon },
  { name: "Trainers", href: "/admin/trainers", icon: UsersIcon }, // Using UsersIcon
  { name: "Add Trainer", href: "/admin/trainers/create", icon: UserAddIcon },
  // { name: "Settings", href: "/admin/settings", icon: CogIcon }, // Example for future
];

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <aside className="w-64 bg-gradient-to-b from-brandTextSoft to-brandTextPrimary text-slate-200 flex flex-col fixed inset-y-0 left-0 z-30 shadow-2xl font-sans">
      {/* Logo/Title Section */}
      <div className="h-20 flex items-center justify-center px-4 border-b border-slate-700/50">
        <Link href="/admin" className="flex items-center space-x-3 group">
          {/* Optional: Replace with your actual logo if you have one */}
          {/* <Image src="/admin-logo.png" width={40} height={40} alt="Admin Panel Logo" className="rounded-md" /> */}
          <span className="text-2xl font-bold text-white group-hover:text-brandAccent transition-colors duration-200 font-header truncate">
            JK Combat Admin
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          // More robust active state check:
          // 1. Exact match for href.
          // 2. For parent routes (like /admin/blogs), active if currentPath starts with item.href.
          //    Ensure item.href isn't just "/admin" to avoid highlighting it for all sub-routes unless intended.
          const isActive =
            currentPath === item.href ||
            (item.href !== "/admin" &&
              currentPath.startsWith(item.href) &&
              item.href.length > "/admin".length);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium group transition-all duration-200 ease-in-out transform hover:translate-x-1
                ${
                  isActive
                    ? "bg-brandAccent text-brandTextOnAccent shadow-md" // Active state uses brandAccent
                    : "text-slate-300 hover:bg-brandAccentHover/30 hover:text-white" // Default and hover state
                }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                  ${
                    isActive
                      ? "text-brandTextOnAccent"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Optional Footer in Sidebar (e.g., Logout or User Profile) */}
      {/* <div className="p-4 mt-auto border-t border-slate-700/50">
        <Link
          href="/logout" // Or a profile link
          className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-red-600 hover:text-white group transition-colors duration-200"
        >
          <LogoutIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-200" aria-hidden="true" />
          Logout
        </Link>
      </div> */}
    </aside>
  );
}
