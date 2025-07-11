// // components/Layout.js

// import Navbar from "./navbar";
// import Footer from "./footer";
// import { Analytics } from "@vercel/analytics/next";
// export default function Layout({ children }) {
//   return (
//     <>
//       <Navbar />
//       <main className=" mt-12 mx-4 md:mx-8 lg:mx-16">{children}</main>
//       <Footer />
//     </>
//   );
// }

// components/Layout.js
import Navbar from "./navbar";
import Footer from "./footer";
import { Analytics } from "@vercel/analytics/next";

export default function Layout({ children }) {
  return (
    // This flexbox structure creates a "sticky footer" effect
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />

      {/* The padding-top (pt-16 sm:pt-20) matches the height of the fixed Navbar (h-16 sm:h-20).
        This prevents content from being hidden behind the navbar.
        'flex-grow' ensures the main content area expands to push the footer down.
      */}
      <main className="flex-grow pt-16 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      <Footer />
      <Analytics />
    </div>
  );
}
