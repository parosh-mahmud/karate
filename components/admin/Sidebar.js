// components/admin/Sidebar.js
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ClipboardListIcon, // New icon for Registrations
} from "@heroicons/react/outline"; // Using Heroicons v1 (outline)

// Restructured nav items into logical sections for better organization
const navSections = [
  {
    title: "Store",
    items: [
      { name: "Products", href: "/admin/products", icon: CubeIcon },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
    ],
  },
  {
    title: "Content",
    items: [
      { name: "Blog Posts", href: "/admin/blogs", icon: NewspaperIcon },
      {
        name: "Write New Blog",
        href: "/admin/blogs/create",
        icon: PencilAltIcon,
      },
      { name: "Gallery", href: "/admin/gallery", icon: PhotographIcon },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Admissions", href: "/admin/admissions", icon: UserGroupIcon },
      {
        name: "Running Registrations",
        href: "/admin/registrations/running",
        icon: ClipboardListIcon,
      },
      {
        name: "Fitness Registrations",
        href: "/admin/registrations/fitness",
        icon: ClipboardListIcon,
      },
      { name: "Trainers", href: "/admin/trainers", icon: UsersIcon },
      {
        name: "Add Trainer",
        href: "/admin/trainers/create",
        icon: UserAddIcon,
      },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`bg-gradient-to-b from-brandTextSoft to-brandTextPrimary text-slate-200 flex flex-col fixed inset-y-0 left-0 z-40 shadow-2xl font-sans transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header: Logo and Toggle Button */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-700/50 relative">
        <Link href="/admin" className="flex items-center group overflow-hidden">
          {/* Your Logo Icon/Image can go here */}
          <span className="text-2xl font-bold text-white group-hover:text-brandAccent transition-colors">
            JK
          </span>
          {!isCollapsed && (
            <span className="ml-3 text-xl font-bold text-white group-hover:text-brandAccent font-header transition-opacity duration-200">
              Combat Admin
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-brandAccentHover/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brandAccent"
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
      <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto">
        {/* Dashboard Link is separate for prominence */}
        <Link
          href="/admin"
          title={isCollapsed ? "Dashboard" : undefined}
          className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium group transition-all duration-200 ease-in-out transform hover:translate-x-1 ${
            isCollapsed ? "justify-center" : ""
          } ${
            currentPath === "/admin"
              ? "bg-brandAccent text-brandTextOnAccent shadow-md"
              : "text-slate-300 hover:bg-brandAccentHover/30 hover:text-white"
          }`}
        >
          <HomeIcon
            className={`h-6 w-6 flex-shrink-0 ${!isCollapsed && "mr-3"}`}
          />
          {!isCollapsed && <span className="truncate">Dashboard</span>}
        </Link>

        {/* Mapped Sections */}
        {navSections.map((section) => (
          <div key={section.title} className="pt-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const isActive =
                  currentPath === item.href ||
                  (item.href !== "/admin" && currentPath.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium group transition-all duration-200 ease-in-out transform hover:translate-x-1 ${
                      isCollapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "bg-brandAccent text-brandTextOnAccent shadow-md"
                        : "text-slate-300 hover:bg-brandAccentHover/30 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`h-6 w-6 flex-shrink-0 transition-colors duration-200 ${
                        !isCollapsed && "mr-3"
                      } ${
                        isActive
                          ? "text-brandTextOnAccent"
                          : "text-slate-400 group-hover:text-slate-200"
                      }`}
                      aria-hidden="true"
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
