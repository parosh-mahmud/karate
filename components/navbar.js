// components/Navbar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeChanger from "./DarkSwitch";
import LoginModal from "./authModal/loginModal";
import SignupModal from "./authModal/signupModal";
import ProfileModal from "./profileModal/profileMOdal";
// Import useAuth hook and specific functions if needed elsewhere (like logout)
import { useAuth } from "./context/authContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const router = useRouter();

  // Get user, loading state, and logout function from context
  const { currentUser, loading, logout } = useAuth(); // Use context

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // No need for onAuthStateChanged listener here anymore, context handles it
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- Modal state handlers remain the same ---
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);
  const openSignupFromLogin = () => {
    closeLoginModal();
    openSignupModal();
  };
  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };
  const closeProfileModal = () => setIsProfileModalOpen(false);
  // --- End Modal state handlers ---

  const handleLogout = async () => {
    try {
      await logout(); // Use logout from context
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      // Optional: redirect user after logout if needed
      // router.push('/');
    } catch (error) {
      console.error("Logout Failed:", error);
      // Handle logout error if needed
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prevState) => !prevState);
  };

  const openStudentDashboard = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/student"); // Assuming '/student' is the correct path
  };

  // Navigation array remains the same
  const navigation = [
    { name: "হোম", href: "/" },
    {
      name: "ভর্তি", // This links to /programs
      href: "/admission",
      children: [
        { name: "এক কালিন", href: "/admission" }, // One-time payment page
        { name: "মাসিক", href: "/admission" }, // Monthly payment page
      ],
    },
    {
      name: "গ্যালারি",
      href: "/gallery", // Ensure this matches your gallery page route if different
      children: [
        { name: "জুডো", href: "/gallery/judo" },
        { name: "কারাতে", href: "/gallery/karate" },
        { name: "অনুষ্ঠান এবং অন্যান্য খেলা", href: "/gallery/events" },
      ],
    },
    {
      // This main link goes to /admission but might be confusing if "ভর্তি" goes to /programs
      name: "স্পোর্টস",
      href: "/sports", // Changed to /sports as parent seems logical
      children: [
        { name: "জুডো", href: "/sports/judo" },
        { name: "কারাতে", href: "/sports/karate" },
        { name: "স্কেটিং", href: "/sports/skating" },
        { name: "বিএনিসিসি", href: "/sports/bncc" }, // Corrected typo? BNCC
        { name: "এথলেটিস", href: "/sports/athletics" },
        { name: "অন্যান্য", href: "/sports/others" },
      ],
    },
    { name: "নিউজ", href: "/blog" },
    { name: "কোর্সসমূহ", href: "/courses" }, // Consider changing href to /courses
    { name: "পরিচিতি", href: "/about" }, // Consider changing href to /about
  ];

  // --- Render Logic ---
  // Show minimal navbar or nothing while loading auth state (optional)
  // if (loading) {
  //   return <header className="fixed top-0 z-50 w-full h-16 bg-white dark:bg-gray-900 shadow-sm"></header>;
  // }

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-shadow duration-300 ease-in-out ${
          isScrolled ? "shadow-md" : ""
        } bg-white dark:bg-gray-900`} // Smooth transition
      >
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2 text-indigo-600 dark:text-gray-100">
              {/* <img src="/logo.svg" alt="JK Combat Academy Logo" className="h-8 w-auto" /> Example image logo */}
              <span className="text-xl md:text-2xl font-bold tracking-tight uppercase">
                JK Combat Academy
              </span>
            </a>
          </Link>

          {/* Desktop Menu - Adjusted styling */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item, index) => (
              <div key={index} className="relative group">
                <Link href={item.href}>
                  {/* Added active link styling possibility */}
                  <a
                    className={`text-base font-medium ${
                      router.pathname === item.href
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300"
                    } hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150 ease-in-out`}
                  >
                    {item.name}
                    {item.children /* Add dropdown indicator */ && (
                      <svg
                        className="inline-block w-4 h-4 ml-1 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </a>
                </Link>
                {/* Dropdown Styling */}
                {item.children && (
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-10">
                    {item.children.map((child, childIndex) => (
                      <Link key={childIndex} href={child.href}>
                        <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                          {child.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Actions - Adjusted styling */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeChanger />
            {currentUser ? ( // Use currentUser from context
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
                >
                  <img
                    // Provide a default image if photoURL is null/undefined
                    src={
                      currentUser.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        currentUser.displayName || currentUser.email || "U"
                      )}&background=random`
                    }
                    alt={currentUser.displayName || currentUser.email}
                    className="w-9 h-9 rounded-full border-2 border-transparent hover:border-indigo-300" // Slightly larger, add hover border
                  />
                </button>
                {/* Profile Dropdown Styling */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10">
                    <button
                      onClick={openProfileModal}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                    >
                      Profile
                    </button>
                    <button
                      onClick={openStudentDashboard}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                    >
                      Student Dashboard
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>{" "}
                    {/* Separator */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Adjusted Button styles */}
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition duration-150 ease-in-out"
                >
                  Sign In
                </button>
                <button
                  onClick={openSignupModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          {/* ... (Mobile Menu Button JSX remains largely the same) ... */}
          <div className="flex lg:hidden items-center space-x-2">
            <ThemeChanger />
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {/* Hamburger/Close Icon SVG */}
              <svg
                className={`w-6 h-6 transition-transform transform ${
                  isMobileMenuOpen ? "rotate-90" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu - Adjusted Styling */}
        {/* ... (Mobile Menu JSX remains largely the same, ensure currentUser is used) ... */}
        <div
          className={`lg:hidden transition-max-height duration-500 ease-in-out overflow-hidden ${
            isMobileMenuOpen
              ? "max-h-[80vh] border-t border-gray-200 dark:border-gray-700"
              : "max-h-0"
          }`}
        >
          <div className="bg-white dark:bg-gray-900 px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navigation.map((item, index) => (
              <div key={index}>
                {" "}
                {/* ... Mobile item rendering logic ... */}{" "}
              </div>
            ))}
            {/* Mobile User Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
              {currentUser ? (
                <div className="space-y-1">
                  {/* Mobile profile/dashboard/logout buttons */}
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      openLoginModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openSignupModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals - Use context for user state */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignup={openSignupFromLogin}
        // No setUser needed if LoginModal uses context's login function or relies on onAuthStateChanged
      />
      <SignupModal
        open={isSignupModalOpen}
        onClose={closeSignupModal}
        // No setUser needed if SignupModal uses context's signup function or relies on onAuthStateChanged
      />
      {currentUser && ( // Conditionally render ProfileModal only if user exists
        <ProfileModal
          open={isProfileModalOpen}
          onClose={closeProfileModal}
          user={currentUser} // Pass user from context
        />
      )}
    </>
  );
}
