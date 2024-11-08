"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeChanger from "./DarkSwitch";
import LoginModal from "./authModal/loginModal";
import SignupModal from "./authModal/signupModal";
import ProfileModal from "./profileModal/profileMOdal";
import { auth, signOut } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Added this line
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

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

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prevState) => !prevState);
  };

  const openStudentDashboard = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/student");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Programs", href: "/programs" },
    { name: "Gallery", href: "/gallery" },
    { name: "Admissions", href: "/admission" },
    { name: "Blog", href: "/blog" },
    { name: "About Me", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-shadow ${
          isScrolled ? "shadow-md" : ""
        } bg-white dark:bg-gray-900`}
      >
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-indigo-600 dark:text-gray-100 tracking-wide uppercase">
                JK Combat Academy
              </span>
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item, index) => (
              <Link key={index} href={item.href}>
                <a className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition">
                  {item.name}
                </a>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeChanger />
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={user.photoURL || "/default-profile.png"}
                    alt={user.displayName || user.email}
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={openProfileModal}
                    >
                      Profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={openStudentDashboard}
                    >
                      Student Dashboard
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-white border border-indigo-600 hover:bg-indigo-600 rounded transition"
                >
                  Sign In
                </button>
                <button
                  onClick={openSignupModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <ThemeChanger />
            <button
              className="text-gray-500 hover:text-indigo-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
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

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-max-height duration-500 overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-2">
            {navigation.map((item, index) => (
              <Link key={index} href={item.href}>
                <a
                  className="block text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            {user ? (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <button
                    onClick={openProfileModal}
                    className="block w-full text-left px-4 py-2 text-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={openStudentDashboard}
                    className="block w-full text-left px-4 py-2 text-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  >
                    Student Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-lg font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <button
                    onClick={() => {
                      openLoginModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-lg font-medium text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openSignupModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-lg font-medium text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignup={openSignupFromLogin}
        setUser={setUser}
      />
      <SignupModal
        open={isSignupModalOpen}
        setUser={setUser}
        onClose={closeSignupModal}
      />
      <ProfileModal
        open={isProfileModalOpen}
        onClose={closeProfileModal}
        user={user}
      />
    </>
  );
}
