// pages/products/index.js
import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import ProductList from "../../components/products/ProductList";

// Simple spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-20 text-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brandAccent"></div>
    <p className="mt-4 text-brandTextSecondary dark:text-slate-400 font-medium">
      Loading Products...
    </p>
  </div>
);

// Error display component with retry button
const ErrorDisplay = ({ errorMessage, onRetry }) => (
  <div className="text-center py-20">
    <svg
      className="mx-auto h-12 w-12 text-brandRed dark:text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <h2 className="mt-2 text-2xl font-semibold text-brandRed dark:text-red-400 mb-4 font-header">
      Error Loading Products
    </h2>
    <p className="text-brandTextSecondary dark:text-slate-400 mb-6 whitespace-pre-wrap">
      {errorMessage || "An unexpected error occurred."}
    </p>
    <button
      onClick={onRetry}
      className="px-6 py-2.5 bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent font-semibold rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brandAccentFocus focus:ring-opacity-50"
    >
      Try Again
    </button>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Encapsulate fetching logic in a useCallback for stability and reuse (e.g., for retry)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("Attempting to fetch products from /api/products...");
    try {
      const response = await fetch("/api/products");
      console.log(`API Response Status: ${response.status}`);

      if (!response.ok) {
        let errorPayload = {
          message: `Failed to fetch products: ${response.status} ${response.statusText}`,
        };
        try {
          // Attempt to get more specific error from API response body
          const apiError = await response.json();
          console.error("API Error Payload:", apiError);
          errorPayload.message =
            apiError.message || apiError.error || errorPayload.message;
          if (apiError.details) errorPayload.details = apiError.details;
          if (apiError.indexRequired) {
            // Specific check for Firestore index issue
            errorPayload.message =
              "Database is being configured. Please try again in a few minutes. (Firestore index might be required)";
          }
        } catch (e) {
          // If response is not JSON or parsing fails
          const textError = await response.text();
          console.error("API Error Text (not JSON):", textError);
          errorPayload.message = textError || errorPayload.message;
        }
        throw new Error(
          errorPayload.message +
            (errorPayload.details ? ` Details: ${errorPayload.details}` : "")
        );
      }

      const data = await response.json();
      console.log("Products data received:", {
        length: data?.length,
        isArray: Array.isArray(data),
        sample: data?.slice(0, 1),
      });

      if (!Array.isArray(data)) {
        console.error(
          "Invalid data format: Expected an array, received:",
          typeof data,
          data
        );
        throw new Error("Invalid data format received from the server.");
      }
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error (client-side catch):", err);
      setError(
        err.message || "An unknown error occurred while fetching products."
      );
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array: fetchProducts is stable

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Call fetchProducts on mount

  let content;
  if (loading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = <ErrorDisplay errorMessage={error} onRetry={fetchProducts} />;
  } else if (products.length === 0) {
    content = (
      <div className="text-center py-20">
        <svg
          className="mx-auto h-12 w-12 text-brandTextMuted dark:text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h2 className="mt-2 text-2xl font-semibold text-brandTextPrimary dark:text-brandBackground mb-4 font-header">
          No Products Available
        </h2>
        <p className="text-brandTextSecondary dark:text-slate-400">
          Please check back later for our range of combat gear.
        </p>
      </div>
    );
  } else {
    content = <ProductList products={products} />;
  }

  return (
    <>
      <Head>
        <title>Products - JK Combat Academy</title>
        <meta
          name="description"
          content="Browse our wide range of high-quality combat sports products and gear at JK Combat Academy. Find everything you need for your training."
        />
      </Head>

      <main className="bg-brandBackground dark:bg-slate-900 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-[calc(100vh-var(--navbar-height,80px)-var(--footer-height,80px))]">
          {/* You would set --navbar-height and --footer-height in your global CSS if using this approach for min-h */}
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 md:mb-12 text-brandTextPrimary dark:text-brandBackground font-header text-center">
              All Products
            </h1>
            {content}
          </div>
        </div>
      </main>
    </>
  );
}
