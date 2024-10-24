import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import { Disclosure } from "@headlessui/react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigation = [
    "Home",
    "Programs",
    "Gallery",
    "FAQ",
    "Blog",
    "About Me",
    "Contact",
  ];

  return (
    <>
      <div className="w-full fixed top-0 z-50 h-16 bg-white shadow-md dark:bg-gray-900">
        <nav className="container flex items-center justify-between h-full p-4 mx-auto lg:justify-between xl:px-0">
          <Disclosure>
            {({ open }) => (
              <>
                <div className="flex items-center justify-between w-full lg:w-auto">
                  <Link href="/">
                    <a className="flex items-center space-x-2">
                      {/* <img
                        src="/logos/logo_arman.png"
                        alt="Logo"
                        className="w-10 h-auto"
                      /> */}
                      <span className="text-4xl font-bold text-indigo-600 dark:text-gray-100 tracking-wide uppercase whitespace-nowrap drop-shadow-lg font-serif">
                        JK Combat Academy
                      </span>
                    </a>
                  </Link>
                  <Disclosure.Button
                    className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
                    aria-label="Toggle Menu"
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      {open ? (
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"
                        />
                      )}
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                    {navigation.map((item, index) => (
                      <Link key={index} href="/">
                        <a className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-trueGray-700">
                          {item}
                        </a>
                      </Link>
                    ))}
                    <Link href="/">
                      <a className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5">
                        Get Started
                      </a>
                    </Link>
                  </Disclosure.Panel>
                </div>
              </>
            )}
          </Disclosure>
          <div className="hidden lg:flex lg:items-center">
            <ul className="flex items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
              {navigation.map((menu, index) => (
                <li key={index} className="mr-3 nav__item">
                  <Link href="/">
                    <a className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none">
                      {menu}
                    </a>
                  </Link>
                </li>
              ))}
              <li className="relative mr-3 nav__item group">
                <a className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none cursor-pointer">
                  Resources
                </a>
                <div className="absolute hidden bg-white rounded-lg shadow-lg group-hover:block min-w-[160px] top-full mt-1">
                  <Link href="/support">
                    <a className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Support
                    </a>
                  </Link>
                  <Link href="/blog">
                    <a className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Blog
                    </a>
                  </Link>
                  <Link href="/license">
                    <a className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      License
                    </a>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="hidden mr-3 space-x-3 lg:flex nav__item">
            <Link href="/">
              <a className="px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5">
                Sign In
              </a>
            </Link>
            <ThemeChanger />
          </div>
        </nav>
      </div>
      <main className="mt-16">{/* Main content goes here */}</main>
    </>
  );
}
