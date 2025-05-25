// pages/products.js (assuming this is the path)
import { useState, useEffect } from "react";
import Head from "next/head";
import ProductList from "../../components/products/ProductList"; // Assuming path is correct

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch((error) => console.error("Failed to fetch products:", error)); // Added basic error handling
  }, []);

  return (
    <>
      <Head>
        <title>Products - JK Combat Academy</title>{" "}
        {/* Added site name for better SEO */}
      </Head>
      <main className="container mx-auto p-6 md:p-8 min-h-screen bg-brandBackground dark:bg-slate-900 font-sans">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-brandTextPrimary dark:text-brandBackground font-header text-center sm:text-left">
          পণ্যসমূহ
        </h1>
        <ProductList products={products} />
      </main>
    </>
  );
}
