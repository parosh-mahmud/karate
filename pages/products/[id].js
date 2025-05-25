// pages/products/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image"; // Switched to Next/Image for optimization
import { useCartDispatch } from "../../components/context/CartContext"; // Assuming path is correct

export default function ProductViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useCartDispatch();

  useEffect(() => {
    if (!id) {
      setLoading(false); // Stop loading if no ID
      return;
    }
    setLoading(true); // Set loading true when ID is available and fetching starts
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch product:", error);
        setProduct(null); // Ensure product is null on error
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch({ type: "ADD_ITEM", payload: product });
    alert("✅ Added to cart"); // Consider replacing with a toast notification for better UX
  };

  const handleOrderNow = () => {
    if (!product) return;
    dispatch({ type: "ADD_ITEM", payload: product });
    router.push("/checkout");
  };

  const baseButtonClasses =
    "px-6 md:px-8 py-3 text-base font-semibold rounded-lg shadow-md focus:outline-none transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:ring-4 focus:ring-opacity-50 font-body";

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-brandBackground dark:bg-slate-900 p-8">
        <p className="text-lg text-brandTextSecondary dark:text-slate-400 font-body">
          Loading product details...
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-brandBackground dark:bg-slate-900 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 font-header mb-4">
            Product Not Found
          </h1>
          <p className="text-brandTextSecondary dark:text-slate-400 font-body mb-6">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link
            href="/products"
            className={`${baseButtonClasses} bg-brandAccent text-brandTextOnAccent hover:bg-brandAccentHover focus:ring-brandAccentFocus`}
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} | JK Combat Academy</title>
        <meta
          name="description"
          content={product.description || `Details for ${product.name}`}
        />
      </Head>
      <main className="min-h-screen bg-brandBackground dark:bg-slate-900 font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[4/3]">
              {" "}
              {/* Added aspect ratio container for image */}
              <Image
                src={product.image || "/placeholder.png"} // Ensure placeholder.png is in /public
                alt={product.name}
                layout="fill" // Changed to fill for responsiveness within aspect ratio container
                objectFit="cover" // Ensures image covers the area, might crop
                className="rounded-lg shadow-xl border border-slate-200 dark:border-slate-700"
                priority // Consider adding if it's LCP
              />
            </div>

            <div className="py-4 md:py-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-brandTextPrimary dark:text-brandBackground font-header mb-3">
                {product.name}
              </h1>
              <p className="mt-1 mb-6 text-3xl font-semibold text-brandAccent dark:text-brandAccentFocus">
                ৳{product.price}
              </p>
              <p className="text-base lg:text-lg leading-relaxed text-brandTextSecondary dark:text-slate-300 font-body mb-8">
                {product.description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <button
                  onClick={handleAddToCart}
                  className={`${baseButtonClasses} bg-brandAccent text-brandTextOnAccent hover:bg-brandAccentHover focus:ring-brandAccentFocus w-full sm:w-auto`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleOrderNow}
                  className={`${baseButtonClasses} border-2 border-brandAccent text-brandAccent 
                              hover:bg-brandAccent hover:text-brandTextOnAccent 
                              focus:ring-brandAccentFocus
                              dark:border-brandAccentFocus dark:text-brandAccentFocus 
                              dark:hover:bg-brandAccentFocus dark:hover:text-brandTextPrimary
                              w-full sm:w-auto`}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
