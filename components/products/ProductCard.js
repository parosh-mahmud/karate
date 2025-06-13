import Image from "next/image";
import Link from "next/link";

/**
 * @param {{ id: string; name: string; mainImage: string; shortDescription: string; price: number; salePrice?: number; }} props.product
 */
export default function ProductCard({ product }) {
  if (!product?.id) return null;

  const hasSale = product.salePrice && product.salePrice < product.price;
  const imageSrc = product.mainImage || "/placeholder.png";

  return (
    <div
      className="group flex flex-col w-full max-w-xs bg-white rounded-2xl shadow-md
                 hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* 16:9 wrapper via padding hack */}
      <Link
        href={`/products/${product.id}`}
        className="relative block w-full rounded-t-2xl overflow-hidden
                   focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brandAccentFocus"
      >
        <div className="w-full pb-[56.25%] bg-gray-100 relative">
          {/* Image fills the padded container */}
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
              e.currentTarget.srcset = "";
            }}
          />

          {/* SALE badge */}
          {hasSale && (
            <span
              className="absolute top-2 left-2 z-20 bg-brandAccent text-white
                         text-xs font-semibold uppercase px-2 py-0.5 rounded-md shadow"
            >
              Sale
            </span>
          )}
        </div>
      </Link>

      {/* Text & Price */}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <h3
          className="text-lg font-header text-brandTextPrimary line-clamp-2"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-sm text-brandTextSecondary flex-grow line-clamp-3">
          {product.shortDescription}
        </p>
        <div className="mt-2">
          {hasSale ? (
            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-brandTextMuted line-through">
                ৳{product.price.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-brandAccent">
                ৳{product.salePrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-semibold text-brandTextPrimary">
              ৳{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* View Details button */}
      <div className="p-4 pt-0">
        <Link href={`/products/${product.id}`}>
          <button
            type="button"
            className="w-full py-2 rounded-lg bg-brandAccent hover:bg-brandAccentHover
                       text-brandTextOnAccent font-medium transition-transform
                       active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-brandAccentFocus"
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
