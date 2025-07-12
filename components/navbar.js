"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import ThemeChanger from "./DarkSwitch";
import LoginModal from "./authModal/loginModal";
import SignupModal from "./authModal/signupModal";
import ProfileModal from "./profileModal/profileMOdal";
import { useAuth } from "@/context/AuthContext";
import { useCartState, useCartDispatch } from "@/context/CartContext";
import logo from "../assets/logos/Arman.png";

import {
  MenuIcon,
  XIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  LogoutIcon,
  AcademicCapIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);

  const profileDropdownRef = useRef(null);
  const router = useRouter();
  const { items: cartItems } = useCartState();
  const dispatch = useCartDispatch();
  const { currentUser, loading, logout } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Admission", href: "/admission" },
    { name: "Gallery", href: "/gallery" },
    {
      name: "Courses",
      href: "/courses",
      children: [
        { name: "Seminars", href: "/seminars" },
        { name: "Result", href: "/result" },
      ],
    },
    { name: "Products", href: "/products" },
    { name: "Blogs", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAllModalsAndSidebars = () => {
    setIsSidebarOpen(false);
    setIsCartOpen(false);
  };

  const openLoginModal = () => {
    closeAllModalsAndSidebars();
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => {
    closeAllModalsAndSidebars();
    setIsSignupModalOpen(true);
  };
  const closeSignupModal = () => setIsSignupModalOpen(false);
  const openProfileModal = () => {
    closeAllModalsAndSidebars();
    setIsProfileModalOpen(true);
  };
  const closeProfileModal = () => setIsProfileModalOpen(false);
  const openCart = () => {
    closeAllModalsAndSidebars();
    setIsCartOpen(true);
  };
  const closeCart = () => setIsCartOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeAllModalsAndSidebars();
      router.push("/");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  const openStudentDashboard = () => {
    closeAllModalsAndSidebars();
    router.push("/student");
  };

  const linkBaseClass =
    "text-base font-medium font-body transition-colors duration-150 ease-in-out py-1";
  const linkInactiveClass =
    "text-brandTextSecondary dark:text-slate-300 hover:text-brandAccent dark:hover:text-brandAccentFocus";
  const linkActiveClass =
    "text-brandAccent dark:text-brandAccentFocus font-semibold";
  const sidebarLinkBaseClass =
    "flex items-center px-3 py-3 rounded-lg text-base font-medium font-body transition-all duration-200 ease-in-out group";
  const sidebarLinkInactiveClass =
    "text-brandTextSecondary dark:text-slate-200 hover:bg-brandAccent/10 hover:text-brandAccent dark:hover:text-brandAccentFocus dark:hover:bg-brandAccentFocus/10";
  const sidebarLinkActiveClass =
    "bg-brandAccent text-brandTextOnAccent shadow-sm dark:bg-brandAccentFocus dark:text-brandTextPrimary";

  return (
    <>
      <header
        className={`fixed top-0 z-30 w-full transition-all duration-300 ease-in-out font-sans ${
          isScrolled
            ? "shadow-lg bg-brandBackground/90 dark:bg-slate-900/90 backdrop-blur-sm"
            : "bg-brandBackground dark:bg-slate-900"
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-4 h-16 sm:h-20">
          <Link href="/" className="flex items-center space-x-2 shrink-0 px-1">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image
                src={logo}
                alt="JK Combat Academy Logo"
                fill
                className="rounded-full object-contain p-0.5"
                priority
              />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-brandAccent font-header">
              JK Combat Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {navigation.map((item) =>
              item.children ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`${linkBaseClass} ${
                      router.pathname.startsWith(item.href) ||
                      item.children.some((c) =>
                        router.pathname.startsWith(c.href)
                      )
                        ? linkActiveClass
                        : linkInactiveClass
                    } flex items-center`}
                  >
                    {item.name}
                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                  </Link>
                  {/* Dropdown: show if openDropdown === item.name */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 transition-all duration-150 ${
                      openDropdown === item.name
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
                  >
                    <div className="py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${linkBaseClass} ${
                    router.pathname === item.href
                      ? linkActiveClass
                      : linkInactiveClass
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Actions & Mobile Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <ThemeChanger />
            <button
              onClick={openCart}
              className="relative p-2 rounded-full text-brandTextSecondary dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-brandRed text-white text-xs font-semibold flex items-center justify-center ring-2 ring-brandBackground dark:ring-slate-900">
                  {cartItems.reduce((sum, itm) => sum + (itm.quantity || 1), 0)}
                </span>
              )}
            </button>
            <div className="hidden lg:flex items-center space-x-3 pl-2">
              {loading ? (
                <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
              ) : currentUser ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="focus:outline-none rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-brandAccent dark:focus:ring-offset-slate-900"
                    aria-label="Open Profile Menu"
                  >
                    <Image
                      src={
                        currentUser.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email || "U")}&background=random&color=fff&size=128`
                      }
                      alt={currentUser.displayName || "User"}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full border-2 border-transparent hover:border-brandAccent transition-colors"
                    />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50">
                      <button
                        onClick={() => {
                          openProfileModal();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        <UserCircleIcon className="h-5 w-5 mr-3" /> Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push("/student");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        <AcademicCapIcon className="h-5 w-5 mr-3" /> Student
                        Dashboard
                      </button>
                      <hr className="border-gray-200 dark:border-slate-600 my-1" />
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        <LogoutIcon className="h-5 w-5 mr-3" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={openLoginModal}
                    className={`${linkBaseClass} ${linkInactiveClass} px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openSignupModal}
                    className={`${linkBaseClass} text-brandTextOnAccent bg-brandAccent hover:bg-brandAccentHover dark:text-brandTextPrimary dark:bg-brandAccentFocus dark:hover:bg-brandAccent px-4 py-1.5 rounded-md shadow-sm`}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-brandTextSecondary dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Open menu"
              >
                <MenuIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out lg:hidden ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-brandBackground dark:bg-slate-800 shadow-xl transition-transform duration-300 ease-in-out lg:hidden transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 h-16 sm:h-20">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Image
              src={logo}
              alt="JKCA Logo"
              width={32}
              height={32}
              className="rounded-full h-8 w-8"
            />
            <span className="text-lg font-bold text-brandAccent font-header">
              JK Combat Academy
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md"
            aria-label="Close menu"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) =>
            item.children ? (
              <div key={item.name}>
                <button
                  onClick={() =>
                    setOpenMobileSubmenu(
                      openMobileSubmenu === item.name ? null : item.name
                    )
                  }
                  className={`${sidebarLinkBaseClass} w-full justify-between ${router.pathname.startsWith(item.href) || item.children.some((c) => router.pathname.startsWith(c.href)) ? sidebarLinkActiveClass : sidebarLinkInactiveClass}`}
                >
                  <span>{item.name}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${openMobileSubmenu === item.name ? "rotate-180" : ""}`}
                  />
                </button>
                {openMobileSubmenu === item.name && (
                  <div className="pl-4 mt-1 space-y-1">
                    {/* Main courses link */}
                    {/* <Link
                      href={item.href}
                      className={`${sidebarLinkBaseClass} ${router.pathname === item.href ? sidebarLinkActiveClass : sidebarLinkInactiveClass}`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      All Courses
                    </Link> */}
                    {/* Sub-menu links */}
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`${sidebarLinkBaseClass} ${router.pathname === child.href ? sidebarLinkActiveClass : sidebarLinkInactiveClass}`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`${sidebarLinkBaseClass} ${router.pathname === item.href ? sidebarLinkActiveClass : sidebarLinkInactiveClass}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-brandTextSecondary dark:text-slate-300">
              Theme
            </span>
            <ThemeChanger />
          </div>
          <hr className="border-slate-200 dark:border-slate-700 !my-4" />
          {loading ? (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brandAccent"></div>
            </div>
          ) : currentUser ? (
            <>
              <button
                onClick={openProfileModal}
                className={`${sidebarLinkBaseClass} ${sidebarLinkInactiveClass} w-full`}
              >
                <Image
                  src={
                    currentUser.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email || "U")}&background=random&color=fff&size=96`
                  }
                  alt="User Avatar"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full mr-3 border border-slate-300 dark:border-slate-600"
                />
                <div className="text-left">
                  <span className="block text-sm font-semibold text-brandTextPrimary dark:text-slate-100 truncate">
                    {currentUser.displayName || "User Profile"}
                  </span>
                  <span className="block text-xs text-brandTextMuted dark:text-slate-400 truncate">
                    {currentUser.email}
                  </span>
                </div>
              </button>
              <button
                onClick={openStudentDashboard}
                className={`${sidebarLinkBaseClass} ${sidebarLinkInactiveClass} w-full`}
              >
                <AcademicCapIcon className="h-5 w-5 mr-3 text-brandTextSecondary dark:text-slate-400 group-hover:text-brandAccent dark:group-hover:text-brandAccentFocus" />{" "}
                Student Dashboard
              </button>
              <button
                onClick={handleLogout}
                className={`${sidebarLinkBaseClass} text-brandRed hover:bg-brandRed/10 w-full`}
              >
                <LogoutIcon className="h-5 w-5 mr-3 group-hover:text-brandRed" />{" "}
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className={`${sidebarLinkBaseClass} ${sidebarLinkInactiveClass} w-full justify-center bg-slate-100 dark:bg-slate-700`}
              >
                Sign In
              </button>
              <button
                onClick={openSignupModal}
                className={`${sidebarLinkBaseClass} ${sidebarLinkActiveClass} w-full justify-center`}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-96 max-w-[90vw] flex-col bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 h-16 sm:h-20">
          <h2
            id="cart-sidebar-title"
            className="text-lg font-bold text-brandAccent font-header"
          >
            Shopping Cart
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-md text-brandTextSecondary dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            aria-label="Close cart"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Cart Items */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-brandTextSecondary dark:text-slate-400">
              Your cart is empty.
            </p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center py-3 border-b border-slate-200 dark:border-slate-700"
                >
                  <div className="w-16 h-16 mr-4 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-brandTextPrimary dark:text-slate-100">
                      {item.name}
                    </h3>
                    <p className="text-xs text-brandTextMuted dark:text-slate-400">
                      {item.sku}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-semibold text-brandTextPrimary dark:text-slate-100">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="ml-2 text-xs text-brandTextMuted dark:text-slate-400">
                        ({item.quantity} x ৳{item.price.toFixed(2)})
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => {
                          dispatch({ type: "DECREASE_ITEM", payload: item.id });
                        }}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-brandTextSecondary dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none"
                      >
                        -
                      </button>
                      <span className="mx-2 text-sm font-medium text-brandTextPrimary dark:text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          dispatch({ type: "INCREASE_ITEM", payload: item.id });
                        }}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-brandTextSecondary dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Cart Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-brandTextPrimary dark:text-slate-100">
              Subtotal:
            </span>
            <span className="text-xl font-bold text-brandTextPrimary dark:text-slate-100">
              ৳
              {cartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </div>
          <Link href="/checkout" className="block">
            <button
              className="w-full py-2.5 px-4 rounded-md text-white font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring-color)] hover:opacity-85 active:scale-95 bg-brandAccent"
              style={{ display: "block", color: "white", zIndex: 10 }}
            >
              Go to Checkout
            </button>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignup={() => {
          closeLoginModal();
          openSignupModal();
        }}
      />
      <SignupModal open={isSignupModalOpen} onClose={closeSignupModal} />
      {currentUser && isProfileModalOpen && (
        <ProfileModal
          open={isProfileModalOpen}
          onClose={closeProfileModal}
          user={currentUser}
        />
      )}
    </>
  );
}
