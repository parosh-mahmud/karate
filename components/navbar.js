// components/Navbar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeChanger from "./DarkSwitch";
import LoginModal from "./authModal/loginModal";
import SignupModal from "./authModal/signupModal";
import ProfileModal from "./profileModal/profileMOdal";
import Image from "next/image";
import { useAuth } from "./context/AuthContext";
import logo from "../assets/logos/Arman.png";
import { useCartState } from "./context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const router = useRouter();
  const { items: cartItems } = useCartState();
  const { currentUser, loading, logout } = useAuth();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);
  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prevState) => !prevState);
  };

  const toggleMobileDropdown = (itemName) => {
    setOpenMobileDropdown(openMobileDropdown === itemName ? null : itemName);
  };

  const openStudentDashboard = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/student");
  };

  const navigation = [
    { name: "হোম", href: "/" },
    {
      name: "ভর্তি",
      href: "/admission",
      children: [
        { name: "এক কালিন", href: "/admission" },
        { name: "মাসিক", href: "/admission/monthly" },
      ],
    },
    {
      name: "গ্যালারি",
      href: "/gallery",
      children: [
        { name: "জুডো", href: "/gallery/judo" },
        { name: "কারাতে", href: "/gallery/karate" },
        { name: "অনুষ্ঠান এবং অন্যান্য খেলা", href: "/gallery/events" },
      ],
    },
    {
      name: "স্পোর্টস",
      href: "/sports",
      children: [
        { name: "জুডো", href: "/sports/judo" },
        { name: "কারাতে", href: "/sports/karate" },
        { name: "স্কেটিং", href: "/sports/skating" },
        { name: "বিএনিসিসি", href: "/sports/bncc" },
        { name: "এথলেটিস", href: "/sports/athletics" },
        { name: "অন্যান্য", href: "/sports/others" },
      ],
    },
    { name: "পণ্যসমূহ", href: "/products" },
    { name: "নিউজ", href: "/blog" },
    { name: "কোর্সসমূহ", href: "/courses" },
    { name: "পরিচিতি", href: "/about" },
  ];

  const linkBaseClass =
    "text-base font-medium font-body transition duration-150 ease-in-out";
  const linkInactiveClass =
    "text-trueGray-700 dark:text-trueGray-300 hover:text-brandBlue dark:hover:text-brandGreen";
  const linkActiveClass = "text-brandBlue dark:text-brandGreen";

  const dropdownItemBaseClass =
    "block w-full text-left px-4 py-2 text-sm font-body transition-colors";
  const dropdownItemInactiveClass =
    "text-trueGray-700 dark:text-trueGray-200 hover:bg-brandBlue/[.07] dark:hover:bg-brandGreen/[.15] hover:text-brandBlue dark:hover:text-brandGreen";

  const mobileLinkBaseClass =
    "block px-3 py-2 rounded-md text-base font-medium font-body transition-colors";
  const mobileLinkInactiveClass =
    "text-trueGray-700 dark:text-trueGray-300 hover:text-brandBlue dark:hover:text-brandGreen hover:bg-trueGray-50 dark:hover:bg-trueGray-800";
  const mobileLinkActiveClass =
    "text-brandBlue dark:text-brandGreen bg-brandBlue/[.07] dark:bg-brandGreen/[.15]";
  const mobileDropdownButtonClass =
    "w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium font-body transition-colors";

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 font-sans ${
          isScrolled
            ? "shadow-lg backdrop-blur-sm bg-neutral/80 dark:bg-primary/80"
            : "bg-neutral dark:bg-primary"
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logo}
              alt="JK Combat Academy Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl md:text-2xl font-bold uppercase text-brandBlue dark:text-brandGreen font-header">
              JK Combat Academy
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`${linkBaseClass} flex items-center ${
                    router.pathname === item.href ||
                    (item.children && router.pathname.startsWith(item.href))
                      ? linkActiveClass
                      : linkInactiveClass
                  }`}
                >
                  {item.name}
                  {item.children && (
                    <svg
                      className="w-4 h-4 ml-1 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Link>

                {item.children && (
                  <div className="absolute left-0 mt-2 w-56 bg-neutral dark:bg-trueGray-800 rounded-md shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-20 ring-1 ring-primary/10 dark:ring-neutral/10">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`${dropdownItemBaseClass} ${dropdownItemInactiveClass} rounded-md mx-1`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <ThemeChanger />

            <Link
              href="/cart"
              className={`relative p-1 transition-colors ${linkInactiveClass}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brandRed text-neutral text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((s, itm) => s + itm.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-3">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandBlue dark:focus:ring-brandGreen rounded-full"
                  >
                    <img
                      src={
                        currentUser.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          currentUser.displayName || currentUser.email || "U"
                        )}&background=random&color=fff`
                      }
                      alt={currentUser.displayName || currentUser.email}
                      className="w-9 h-9 rounded-full border-2 border-transparent hover:border-brandBlue dark:hover:border-brandGreen transition-colors"
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-neutral dark:bg-trueGray-800 rounded-md shadow-xl py-1 ring-1 ring-primary/10 dark:ring-neutral/10 z-20">
                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`${dropdownItemBaseClass} ${dropdownItemInactiveClass}`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={openStudentDashboard}
                        className={`${dropdownItemBaseClass} ${dropdownItemInactiveClass}`}
                      >
                        Student Dashboard
                      </button>
                      <div className="border-t border-trueGray-200 dark:border-trueGray-700 my-1" />
                      <button
                        onClick={handleLogout}
                        className={`${dropdownItemBaseClass} text-brandRed dark:text-brandRed hover:bg-brandRed/[.07] dark:hover:bg-brandRed/[.15]`}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className={`px-4 py-2 text-sm font-medium font-body transition-colors ${linkActiveClass} hover:opacity-80 dark:hover:opacity-80`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignupModalOpen(true)}
                    className="px-5 py-2 text-sm font-medium font-body text-neutral bg-brandBlue hover:bg-brandBlue/90 
                               dark:text-primary dark:bg-brandGreen dark:hover:bg-brandGreen/90 
                               rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandBlue dark:focus:ring-brandGreen"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen((o) => !o)}
                className={`p-1 focus:outline-none transition-colors ${linkInactiveClass}`}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className={`w-7 h-7 transition-transform transform ${
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-y-auto bg-neutral dark:bg-primary shadow-lg ${
            isMobileMenuOpen
              ? "max-h-[calc(100vh-60px)] border-t border-trueGray-200 dark:border-trueGray-700"
              : "max-h-0"
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(item.name)}
                      className={`${mobileDropdownButtonClass} ${
                        router.pathname.startsWith(item.href)
                          ? mobileLinkActiveClass
                          : mobileLinkInactiveClass
                      }`}
                    >
                      {item.name}
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          openMobileDropdown === item.name ? "rotate-180" : ""
                        }`}
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
                    </button>
                    {openMobileDropdown === item.name && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`${mobileLinkBaseClass} ${
                              router.pathname === child.href
                                ? mobileLinkActiveClass
                                : "text-trueGray-600 dark:text-trueGray-400 hover:text-brandBlue dark:hover:text-brandGreen hover:bg-trueGray-50 dark:hover:bg-trueGray-800"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`${mobileLinkBaseClass} ${
                      router.pathname === item.href
                        ? mobileLinkActiveClass
                        : mobileLinkInactiveClass
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Auth */}
            <div className="border-t border-trueGray-200 dark:border-trueGray-700 mt-4 pt-4 space-y-2">
              {currentUser ? (
                <>
                  <div className="flex items-center px-3 py-2">
                    <img
                      src={
                        currentUser.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          currentUser.displayName || currentUser.email || "U"
                        )}&background=random&color=fff`
                      }
                      alt={currentUser.displayName || currentUser.email}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-base font-medium text-primary dark:text-neutral font-body">
                        {currentUser.displayName || "User"}
                      </p>
                      <p className="text-sm font-medium text-trueGray-600 dark:text-trueGray-400 font-body">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${mobileLinkBaseClass} ${mobileLinkInactiveClass}`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      openStudentDashboard();
                    }}
                    className={`${mobileLinkBaseClass} ${mobileLinkInactiveClass}`}
                  >
                    Student Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`${mobileLinkBaseClass} text-brandRed dark:text-brandRed hover:bg-brandRed/[.07] dark:hover:bg-brandRed/[.15]`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${mobileLinkBaseClass} ${mobileLinkActiveClass} hover:opacity-80 dark:hover:opacity-80`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsSignupModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${mobileLinkBaseClass} text-center text-neutral bg-brandBlue hover:bg-brandBlue/90 dark:text-primary dark:bg-brandGreen dark:hover:bg-brandGreen/90`}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      <SignupModal
        open={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
      {currentUser && (
        <ProfileModal
          open={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
        />
      )}
    </>
  );
}
