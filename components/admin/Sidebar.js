// components/admin/Sidebar.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeIcon,
  NewspaperIcon,
  PhotographIcon,
  UserGroupIcon,
  PencilAltIcon,
  UserAddIcon,
} from "@heroicons/react/outline"; // Assuming Heroicons v1 based on your provided code

const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Admissions", href: "/admin/admissions", icon: UserGroupIcon },
  { name: "Gallery", href: "/admin/gallery", icon: PhotographIcon },
  { name: "Blog Posts", href: "/admin/blogs", icon: NewspaperIcon },
  { name: "Write Blog", href: "/admin/blogs/create", icon: PencilAltIcon },
  { name: "Trainers", href: "/admin/trainers", icon: UserGroupIcon },
  { name: "Add Trainer", href: "/admin/trainers/create", icon: UserAddIcon },
];

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <aside className="w-64 bg-gradient-to-b from-brandTextSoft to-brandTextPrimary text-slate-100 flex flex-col fixed h-full shadow-lg font-sans">
      {/* Logo/Title */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700 px-4">
        <Link href="/admin" className="flex items-center space-x-2">
          {/* Optional: You can add your logo image here if you have one for the admin panel */}
          {/* <Image src="/admin-logo.png" width={32} height={32} alt="Admin Logo" /> */}
          <span className="text-2xl font-bold text-white font-header truncate">
            JK Combat
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {" "}
        {/* Adjusted padding and space */}
        {navItems.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/admin" && currentPath.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition duration-150 ease-in-out group ${
                isActive
                  ? "bg-brandAccent text-brandTextOnAccent shadow-inner"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive
                    ? "text-brandTextOnAccent"
                    : "text-slate-400 group-hover:text-slate-300"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Optional Footer in Sidebar */}
      {/* <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 text-center">&copy; {new Date().getFullYear()} JKCA Admin</p>
      </div> */}
    </aside>
  );
}
