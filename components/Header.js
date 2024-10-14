import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

function Header() {
  const [transparent, setTransparent] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setTransparent(window.scrollY <= 50);
    };
    document.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-30 top-0 text-white transition duration-300 ease-in-out ${
        transparent ? "" : "bg-gray-800 bg-opacity-75"
      }`}
      style={transparent ? { backgroundColor: "#457092" } : {}}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="logo">
          <img
            src="/logos/logo_arman.png"
            alt="Karate Academy Logo"
            className="h-12 md:h-12"
            style={{ width: "120px" }} // Custom width
          />
        </div>

        {/* Hamburger Menu Button */}
        <button onClick={toggleMobileMenu} className="md:hidden">
          <svg viewBox="0 0 100 80" width="40" height="40">
            <rect width="100" height="20"></rect>
            <rect y="30" width="100" height="20"></rect>
            <rect y="60" width="100" height="20"></rect>
          </svg>
        </button>

        {/* Sidebar Navigation for Mobile */}
        <div
          ref={sidebarRef}
          className={`fixed inset-y-0 left-0 w-3/4 max-w-xs bg-gray-800 p-4 z-40 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          {/* Close Button */}
          <button onClick={toggleMobileMenu} className="self-end mb-4">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <nav className="flex flex-col">
            <Link href="/" className="hover:underline mb-2 text-white">
              Home
            </Link>
            <Link href="/about" className="hover:underline mb-2 text-white">
              About Us
            </Link>
            <Link href="/programs" className="hover:underline mb-2 text-white">
              Programs
            </Link>
            <Link href="/schedule" className="hover:underline mb-2 text-white">
              Schedule
            </Link>
            <Link
              href="/membership"
              className="hover:underline mb-2 text-white"
            >
              Membership
            </Link>
            <Link href="/gallery" className="hover:underline mb-2 text-white">
              Gallery
            </Link>
            <Link href="/faq" className="hover:underline mb-2 text-white">
              FAQ
            </Link>
            <Link href="/blog" className="hover:underline mb-2 text-white">
              Blog
            </Link>
            <Link
              href="/testimonials"
              className="hover:underline mb-2 text-white"
            >
              Testimonials
            </Link>
            <Link href="/contact" className="hover:underline mb-2 text-white">
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
          <Link href="/programs" className="hover:underline">
            Programs
          </Link>
          <Link href="/schedule" className="hover:underline">
            Schedule
          </Link>
          <Link href="/membership" className="hover:underline">
            Membership
          </Link>
          <Link href="/gallery" className="hover:underline">
            Gallery
          </Link>
          <Link href="/faq" className="hover:underline">
            FAQ
          </Link>
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/testimonials" className="hover:underline">
            Testimonials
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
        </nav>

        <button className="hidden md:block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Student Login
        </button>
      </div>
    </header>
  );
}

export default Header;
