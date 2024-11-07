"use client";

import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import { useState, useEffect } from "react";
import LoginModal from "./authModal/loginModal";
import SignupModal from "./authModal/signupModal";
import { auth, signOut } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ProfileModal from "./profileModal/profileMOdal";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const openStudentDashboard = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/student");
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeProfileModal = () => setIsProfileModalOpen(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser?.displayName);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const openSignupFromLogin = () => {
    closeLoginModal();
    openSignupModal();
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prevState) => !prevState);
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
      <div className="w-full fixed top-0 z-50 h-16 bg-white shadow-md dark:bg-gray-900">
        <nav className="container flex items-center justify-between h-full p-4 mx-auto lg:justify-between xl:px-0">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-600 dark:text-gray-100 tracking-wide uppercase whitespace-nowrap drop-shadow-lg font-serif">
                  JK Combat Academy
                </span>
              </a>
            </Link>
            <div className="flex lg:hidden items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={openLoginModal}
                    className="text-sm px-3 py-1 text-indigo-600 rounded-md"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openSignupModal}
                    className="text-sm px-3 py-1 bg-indigo-500 text-white rounded-md"
                  >
                    Sign Up
                  </button>
                </>
              ) : null}
              <button
                className="px-2 py-1 text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700 transition-transform duration-300"
                aria-label="Open menu"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center">
            <ul className="flex items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
              {navigation.map((menu, index) => (
                <li key={index} className="mr-3 nav__item">
                  <Link href={menu.href}>
                    <a className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none">
                      {menu.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden mr-3 space-x-3 lg:flex nav__item items-center">
            {user ? (
              <div className="relative">
                <img
                  src={user.photoURL || "/default-profile.png"}
                  alt={user.displayName || user.email}
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={toggleProfileDropdown}
                />
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
                  className="px-6 py-2 text-white bg-indigo-600 rounded-md"
                >
                  Sign In
                </button>
                <button
                  onClick={openSignupModal}
                  className="px-6 py-2 text-white bg-indigo-500 rounded-md"
                >
                  Sign Up
                </button>
              </>
            )}
            <ThemeChanger />
          </div>
        </nav>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 h-full w-full bg-white dark:bg-gray-900 text-black dark:text-white transform transition-transform duration-300 lg:hidden">
          <div className="relative h-full p-4">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-indigo-500 focus:outline-none"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              </svg>
            </button>
            {user && (
              <div className="flex items-center space-x-3 mb-4 mt-8">
                <img
                  src={user.photoURL || "/default-profile.png"}
                  alt={`${user.displayName || "User"}'s profile`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-lg font-semibold">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
            {navigation.map((item, index) => (
              <Link key={index} href={item.href}>
                <a
                  className="block px-4 py-2 text-lg font-medium text-black dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            {user ? (
              <>
                <button
                  onClick={openProfileModal}
                  className="block w-full text-left px-4 py-2 mt-3 text-lg font-medium text-black dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                >
                  Profile
                </button>
                <button
                  onClick={openStudentDashboard}
                  className="block w-full text-left px-4 py-2 mt-3 text-lg font-medium text-black dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                >
                  Student Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 mt-3 text-lg font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="block w-full text-left px-4 py-2 mt-3 text-lg font-medium text-indigo-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                  onClick={() => {
                    openLoginModal();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </button>
                <button
                  className="block w-full text-left px-4 py-2 mt-3 text-lg font-medium text-indigo-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
                  onClick={() => {
                    openSignupModal();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
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
      <main className="mt-16">{/* Main content goes here */}</main>
    </>
  );
}
