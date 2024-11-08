// components/Layout.js
import Navbar from "./navbar";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="mx-4 md:mx-8 lg:mx-16">{children}</main>
      <Footer />
    </>
  );
}
