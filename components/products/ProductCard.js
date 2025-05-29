import Image from "next/image";
import Link from "next/link";

/**
 * Renders a product card with a responsive layout.
 *
 * It aims for a consistent look across devices, prevents excessive vertical stretching
 * by truncating text, and ensures the "View Details" button is always at the bottom.
 *
 * @param {object} props - The component props.
 * @param {object} props.product - The product data.
 * @param {string} props.product.id - The product's unique ID.
 * @param {string} props.product.name - The product's name.
 * @param {string} props.product.mainImage - The URL of the product's main image.
 * @param {string} props.product.shortDescription - A brief description of the product.
 * @param {number} props.product.price - The regular price of the product.
 * @param {number} [props.product.salePrice] - The optional sale price.
 * @returns {JSX.Element | null} The rendered product card or null if product data is incomplete.
 */
export default function ProductCard({ product }) {
  // --- Data Validation ---
  // Ensure we have at least an ID to render a card.
  if (!product?.id) {
    if (process.env.NODE_ENV === "development") {
      console.warn("ProductCard received incomplete product data:", product);
    }
    return null; // Don't render if essential data is missing.
  }

  // --- Defaults and Variables ---
  const imageSrc = product.mainImage || "/placeholder.png";
  const hasSale = product.salePrice && product.salePrice < product.price;

  // --- Brand Colors (Consider defining these in tailwind.config.js for global use) ---
  const primaryColor = "#0B1E37";
  const secondaryColor = "#455271";
  const accentColor = "#E53E3E";
  const lightGrayColor = "#A0AEC0";
  const focusRingColor = "#455271";

  return (
    <div
      className="group flex flex-col h-full max-w-xs bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-2xl border border-gray-100"
      // You can define your brand colors in tailwind.config.js for cleaner code,
      // or use CSS variables like this as an alternative.
      style={{
        fontFamily: "YourBrandFont, sans-serif", // **Remember to configure 'YourBrandFont'**
        "--primary-color": primaryColor,
        "--secondary-color": secondaryColor,
        "--accent-color": accentColor,
        "--light-gray-color": lightGrayColor,
        "--focus-ring-color": focusRingColor,
      }}
    >
      {/* --- Image Section --- */}
      <Link
        href={`/products/${product.id}`}
        aria-label={`View details for ${product.name}`}
        // Using aspect-ratio for a responsive image container that maintains its shape.
        // It provides a consistent visual feel, especially in a grid.
        className="block w-full aspect-w-4 aspect-h-3 bg-gray-100 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-offset-1 focus:ring-[var(--focus-ring-color)] rounded-t-lg"
      >
        <Image
          src={imageSrc}
          alt={product.name || "Product Image"}
          fill // Makes the image fill its parent container.
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" // Helps Next.js optimize image loading. Adjust based on your grid layout.
          style={{ objectFit: "cover" }} // Ensures the image covers the area, cropping if necessary.
          className="transition-transform duration-500 ease-in-out group-hover:scale-105" // Subtle zoom on hover.
          onError={(e) => {
            // Fallback to placeholder if the image fails to load.
            // @ts-ignore - This is a common pattern, though TS might warn.
            e.currentTarget.src = "/placeholder.png";
            e.currentTarget.srcset = ""; // Clear srcset as well
          }}
        />
        {/* Sale Badge (Optional) */}
        {hasSale && (
          <span className="absolute top-2 right-2 bg-[var(--accent-color)] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            SALE
          </span>
        )}
      </Link>

      {/* --- Info Section --- */}
      {/* 'flex-1' makes this section grow, pushing the button down. */}
      {/* 'flex flex-col' allows us to control the layout inside this growing section. */}
      <div className="p-4 flex flex-col flex-1">
        {/* Product Name (Truncated) */}
        <h2
          className="text-xl font-semibold line-clamp-2 text-[var(--primary-color)]"
          title={product.name}
        >
          {product.name}
        </h2>

        {/* Short Description (Truncated & Grows) */}
        {/* 'flex-grow' helps it take up space, but 'line-clamp' limits its visible height. */}
        <p className="mt-2 text-sm leading-relaxed flex-grow line-clamp-3 text-[var(--secondary-color)]">
          {product.shortDescription}
        </p>

        {/* Price Section */}
        <div className="mt-4">
          {hasSale ? (
            <div className="flex items-baseline space-x-2">
              <span className="text-base line-through text-[var(--light-gray-color)]">
                ${product.price?.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-[var(--accent-color)]">
                ${product.salePrice?.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-[var(--primary-color)]">
              ${product.price?.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* --- Button Section --- */}
      {/* 'mt-auto' ensures this section sticks to the bottom if the info section doesn't fill the space. */}
      {/* We add 'p-4' here but remove 'pt-0' so the button has padding all around but doesn't add extra space above it. */}
      <div className="p-4 pt-0 mt-auto">
        <Link href={`/products/${product.id}`} className="block">
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-md text-white font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring-color)] hover:opacity-85 active:scale-95 bg-[var(--primary-color)]"
            style={{
              boxShadow: "0 2px 4px rgba(11,30,55,0.4)",
            }}
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
