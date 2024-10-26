// components/Layout.js
import Navbar from "./navbar";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <>
      <div className="mx-4 md:mx-8 lg:mx-16">
        <Navbar />
      </div>
      <main className="mx-4 md:mx-8 lg:mx-16">{children}</main>
      <div className="mx-4 md:mx-8 lg:mx-16">
        <Footer />
      </div>
    </>
  );
}
