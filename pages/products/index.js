// pages/products/index.js
import { useState, useEffect } from "react";
import Head from "next/head";
import ProductList from "../../components/products/ProductList"; // Assuming path is correct
import Navbar from "../../components/navbar"; // Assuming you want the main Navbar
import Footer from "../../components/footer"; // Assuming you want the main Footer

// Example simple spinner component (or you can use a library)
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brandAccent"></div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching products...");
        const response = await fetch("/api/products");
        console.log("Response status:", response.status);
        console.log(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        const contentType = response.headers.get("content-type");
        console.log("Content type:", contentType);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });

          try {
            const errorData = JSON.parse(errorText);
            if (errorData.indexRequired) {
              throw new Error(
                "Database is being configured. Please try again in a few minutes."
              );
            }
            throw new Error(
              errorData.message ||
                `Failed to fetch products: ${response.status}`
            );
          } catch (e) {
            throw new Error(
              `Failed to fetch products: ${response.status} ${response.statusText}`
            );
          }
        }

        const data = await response.json();
        console.log("Products data:", {
          length: data?.length || 0,
          sample: data?.slice(0, 2) || [],
          isArray: Array.isArray(data),
        });

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from server");
        }

        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", {
          message: error.message,
          stack: error.stack,
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add a retry button to the error state
  if (error) {
    content = (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-brandRed mb-4 font-header">
          Error Loading Products
        </h2>
        <p className="text-brandTextSecondary dark:text-slate-400 mb-6">
          {error}
        </p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchProducts();
          }}
          className="px-6 py-2 bg-brandAccent hover:bg-brandAccentHover text-white rounded-md transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  // Determine content based on loading, error, or products state
  let content;
  if (loading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-brandRed mb-4 font-header">
          Error Loading Products
        </h2>
        <p className="text-brandTextSecondary dark:text-slate-400">{error}</p>
        {/* You could add a retry button here */}
      </div>
    );
  } else if (products.length === 0) {
    content = (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-brandTextPrimary dark:text-brandBackground mb-4 font-header">
          No Products Available
        </h2>
        <p className="text-brandTextSecondary dark:text-slate-400">
          Please check back later for our range of combat gear.
        </p>
      </div>
    );
  } else {
    content = <ProductList products={products} />; // ProductList should also use brand styles
  }

  return (
    <>
      <Head>
        <title>Products - JK Combat Academy</title>
        <meta
          name="description"
          content="Browse our wide range of high-quality combat sports products and gear at JK Combat Academy. Find everything you need for your training."
        />
        {/* Add other relevant meta tags like Open Graph for social sharing */}
      </Head>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-[calc(100vh-200px)] bg-brandBackground dark:bg-slate-900 font-sans">
        {/* Adjusted min-h to account for typical navbar/footer height */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 md:mb-12 text-brandTextPrimary dark:text-brandBackground font-header text-center">
            পণ্যসমূহ (Products)
          </h1>
          {content}
        </div>
      </main>
    </>
  );
}
