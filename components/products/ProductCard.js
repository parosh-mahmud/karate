// components/products/ProductCard.js
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  // Ensure product and product.id are available to prevent errors
  if (!product || !product.id) {
    // Optionally, render a fallback or null if product data is incomplete
    // console.warn("ProductCard received incomplete product data:", product);
    return null;
  }

  // Determine the price to display
  const displayPrice =
    product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price;

  const originalPrice =
    product.salePrice && product.salePrice < product.price
      ? product.price
      : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-brandAccent/30 transition-all duration-300 ease-in-out overflow-hidden border border-slate-200 dark:border-slate-700 transform hover:-translate-y-1"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        {" "}
        {/* Ensure image container clips the scaled image */}
        <Image
          src={product.mainImage || "/placeholder.png"} // Standardized placeholder
          alt={product.name || "Product image"}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Refined sizes
          className="object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
          priority={false} // Appropriate for list items
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.png";
          }} // Fallback for broken image URLs
        />
        {product.salePrice && product.salePrice < product.price && (
          <div className="absolute top-3 right-3 bg-brandRed text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            SALE
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {" "}
        {/* Added flex-grow and flex-col for better content distribution */}
        {product.brand && (
          <p className="mb-1 text-xs font-medium text-brandTextMuted dark:text-slate-500 uppercase tracking-wider">
            {product.brand}
          </p>
        )}
        <h3 className="text-md sm:text-lg font-semibold text-brandTextPrimary dark:text-brandBackground mb-1.5 line-clamp-2 leading-snug group-hover:text-brandAccent dark:group-hover:text-brandAccentFocus transition-colors">
          {product.name || "Untitled Product"}
        </h3>
        {product.shortDescription && (
          <p className="text-sm text-brandTextSecondary dark:text-slate-400 mb-3 line-clamp-2 flex-grow">
            {" "}
            {/* Added flex-grow to push price down */}
            {product.shortDescription}
          </p>
        )}
        <div className="mt-auto">
          {" "}
          {/* Pushes price and stock to the bottom */}
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span
                className={`text-xl font-bold ${
                  originalPrice
                    ? "text-brandRed"
                    : "text-brandAccent dark:text-brandAccentFocus"
                }`}
              >
                ৳{displayPrice ? displayPrice.toFixed(2) : "N/A"}
              </span>
              {originalPrice && (
                <span className="ml-2 text-sm line-through text-brandTextMuted dark:text-slate-500">
                  ৳{originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span
              className={`px-2.5 py-1 rounded-full font-semibold ${
                product.stockQuantity > 0
                  ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300"
              }`}
            >
              {product.stockQuantity > 0
                ? `${product.stockQuantity} In Stock`
                : "Out of Stock"}
            </span>
            {/* Optional: Add a small "View Details" button or icon */}
            <span className="text-brandAccent dark:text-brandAccentFocus group-hover:underline">
              View Details &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
