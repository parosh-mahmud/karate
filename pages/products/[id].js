// // pages/products/[id].js
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Head from "next/head";
// import Image from "next/image";
// import Link from "next/link";
// import { useCartDispatch } from "../../components/context/CartContext"; // Assuming path is correct

// // --- Demo Product Data ---
// // In a real app, this would come from your API/database
// const demoProducts = [
//   {
//     id: "1",
//     name: "Pro Fighter Boxing Gloves - Red Dragon",
//     price: 79.99,
//     oldPrice: 99.99,
//     sku: "PF-GLV-RD-001",
//     category: "Gloves",
//     brand: "CombatCore",
//     stock: 15, // 0 for out of stock
//     rating: 4.8,
//     reviews: 125,
//     shortDescription:
//       "Premium leather boxing gloves designed for professional fighters and serious enthusiasts. Superior protection and comfort.",
//     description: `
//       <p>Unleash your inner dragon with the Pro Fighter Red Dragon Boxing Gloves. Crafted from 100% genuine top-grain leather, these gloves offer unparalleled durability and performance. The multi-layered foam padding provides exceptional shock absorption, protecting your hands and wrists during intense training and sparring sessions.</p>
//       <h3 class="text-lg font-semibold mt-4 mb-2 text-brandTextPrimary dark:text-brandBackground">Key Features:</h3>
//       <ul class="list-disc list-inside space-y-1 text-brandTextSecondary dark:text-slate-300">
//         <li>100% Genuine Leather Construction</li>
//         <li>Multi-Layered High-Density Foam Padding</li>
//         <li>Secure Velcro Wrist Strap for Optimal Support</li>
//         <li>Breathable Inner Lining for Comfort</li>
//         <li>Reinforced Stitching for Longevity</li>
//         <li>Available in 10oz, 12oz, 14oz, 16oz</li>
//       </ul>
//       <h3 class="text-lg font-semibold mt-4 mb-2 text-brandTextPrimary dark:text-brandBackground">Suitable For:</h3>
//       <p class="text-brandTextSecondary dark:text-slate-300">Boxing, Muay Thai, Kickboxing, Heavy Bag Training, Sparring.</p>
//     `,
//     image: "/demo/products/gloves-red-main.jpg", // Replace with your actual image paths
//     galleryImages: [
//       "/demo/products/gloves-red-1.jpg",
//       "/demo/products/gloves-red-2.jpg",
//       "/demo/products/gloves-red-3.jpg",
//     ],
//     tags: ["boxing", "pro", "leather", "red", "training"],
//     specifications: [
//       { name: "Material", value: "Genuine Cowhide Leather" },
//       { name: "Padding", value: "Quad-Layer Foam Core" },
//       { name: "Closure", value: "Velcro Strap" },
//       { name: "Available Weights", value: "10oz, 12oz, 14oz, 16oz" },
//     ],
//   },
//   {
//     id: "2",
//     name: "Stealth Series MMA Sparring Gloves",
//     price: 59.99,
//     sku: "SS-MMA-GLV-002",
//     category: "MMA Gear",
//     brand: "AlphaStrike",
//     stock: 8,
//     rating: 4.5,
//     reviews: 88,
//     shortDescription:
//       "Versatile MMA gloves for grappling and light striking, offering excellent hand mobility and protection.",
//     description: `
//       <p>The Stealth Series MMA Sparring Gloves are engineered for the modern mixed martial artist. Featuring an open-palm design for superior grappling control and segmented padding for striking protection, these gloves are perfect for dynamic training sessions. The durable synthetic leather construction ensures they can withstand rigorous use.</p>
//       <h3 class="text-lg font-semibold mt-4 mb-2 text-brandTextPrimary dark:text-brandBackground">Key Features:</h3>
//       <ul class="list-disc list-inside space-y-1 text-brandTextSecondary dark:text-slate-300">
//         <li>Durable Synthetic Leather</li>
//         <li>Open-Palm Design for Grappling</li>
//         <li>Segmented Padding for Knuckle Protection</li>
//         <li>Secure Hook-and-Loop Wrist Closure</li>
//         <li>Lightweight and Agile</li>
//       </ul>
//     `,
//     image: "/demo/products/mma-gloves-main.jpg",
//     galleryImages: [
//       "/demo/products/mma-gloves-1.jpg",
//       "/demo/products/mma-gloves-2.jpg",
//     ],
//     tags: ["mma", "sparring", "grappling", "synthetic leather"],
//     specifications: [
//       { name: "Material", value: "Engineered Synthetic Leather" },
//       { name: "Type", value: "Open Palm Sparring" },
//       { name: "Suitable For", value: "MMA, Grappling, Light Striking" },
//     ],
//   },
//   {
//     id: "3",
//     name: "Champion's Choice Karate Gi - White",
//     price: 89.0,
//     sku: "CC-GI-WHT-003",
//     category: "Uniforms",
//     brand: "DojoMaster",
//     stock: 0, // Out of stock example
//     rating: 4.9,
//     reviews: 210,
//     shortDescription:
//       "Traditional heavyweight karate gi, designed for comfort, durability, and a sharp, professional look.",
//     description: `
//       <p>Step onto the tatami with confidence in the Champion's Choice Karate Gi. Made from premium 100% cotton canvas, this gi offers the perfect balance of toughness and comfort. Its traditional cut allows for a full range of motion, essential for executing precise techniques. Reinforced stress points ensure this uniform will last through countless training sessions and competitions.</p>
//        <h3 class="text-lg font-semibold mt-4 mb-2 text-brandTextPrimary dark:text-brandBackground">Key Features:</h3>
//       <ul class="list-disc list-inside space-y-1 text-brandTextSecondary dark:text-slate-300">
//         <li>100% Heavyweight Cotton Canvas (12oz)</li>
//         <li>Traditional Cut for Unrestricted Movement</li>
//         <li>Reinforced Stitching at Cuffs, Collar, and Seams</li>
//         <li>Includes Jacket and Pants (Belt sold separately)</li>
//         <li>Crisp, Professional Appearance</li>
//       </ul>
//     `,
//     image: "/demo/products/karate-gi-main.jpg",
//     galleryImages: [],
//     tags: ["karate", "gi", "uniform", "cotton", "traditional"],
//     specifications: [
//       { name: "Material", value: "12oz Cotton Canvas" },
//       { name: "Color", value: "White" },
//       { name: "Includes", value: "Jacket, Pants (Drawstring Waist)" },
//     ],
//   },
//   // Add more demo products as needed
// ];

// // --- Helper Components ---
// const LoadingState = () => (
//   <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-brandBackground dark:bg-slate-900 p-8 font-sans">
//     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brandAccent mb-6"></div>
//     <p className="text-xl font-medium text-brandTextSecondary dark:text-slate-400 font-body">
//       Loading product details...
//     </p>
//   </main>
// );

// const ProductNotFoundState = () => (
//   <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-brandBackground dark:bg-slate-900 p-8 font-sans">
//     <div className="text-center">
//       {/* You can use an icon here */}
//       <h1 className="text-3xl font-bold text-brandRed dark:text-red-400 font-header mb-4">
//         Product Not Found
//       </h1>
//       <p className="text-lg text-brandTextSecondary dark:text-slate-400 font-body mb-8">
//         Sorry, we couldn't find the product you're looking for. It might have
//         been removed or the link is incorrect.
//       </p>
//       <Link
//         href="/products"
//         className="inline-block px-8 py-3 text-base font-semibold rounded-lg shadow-md focus:outline-none transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:ring-4 focus:ring-opacity-50 bg-brandAccent text-brandTextOnAccent hover:bg-brandAccentHover focus:ring-brandAccentFocus font-body"
//       >
//         Back to All Products
//       </Link>
//     </div>
//   </main>
// );

// const StarRating = ({ rating, reviews }) => {
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 >= 0.5;
//   const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//   return (
//     <div className="flex items-center space-x-1 text-brandAccentFocus">
//       {[...Array(fullStars)].map((_, i) => (
//         <svg
//           key={`full-${i}`}
//           className="w-5 h-5 fill-current"
//           viewBox="0 0 20 20"
//         >
//           <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .5l2.939 5.455 6.572.955-4.756 4.635 1.123 6.545z" />
//         </svg>
//       ))}
//       {halfStar && (
//         <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
//           <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .5l2.939 5.455 6.572.955-4.756 4.635 1.123 6.545zM10 12.392V3.86l-1.837 3.408-3.75.545 2.715 2.645-.64 3.733z" />
//         </svg>
//       )}
//       {[...Array(emptyStars)].map((_, i) => (
//         <svg
//           key={`empty-${i}`}
//           className="w-5 h-5 fill-current text-slate-300 dark:text-slate-600"
//           viewBox="0 0 20 20"
//         >
//           <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .5l2.939 5.455 6.572.955-4.756 4.635 1.123 6.545z" />
//         </svg>
//       ))}
//       {reviews && (
//         <span className="ml-2 text-sm text-brandTextMuted dark:text-slate-400">
//           ({reviews} reviews)
//         </span>
//       )}
//     </div>
//   );
// };

// export default function ProductViewPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [cartMessage, setCartMessage] = useState("");
//   const dispatch = useCartDispatch();

//   useEffect(() => {
//     if (!id) {
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       const foundProduct = demoProducts.find((p) => p.id === id);
//       setProduct(foundProduct || null);
//       if (foundProduct) {
//         setSelectedImage(foundProduct.image);
//       }
//       setLoading(false);
//     }, 500); // Simulate network delay
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!product) return;
//     dispatch({ type: "ADD_ITEM", payload: { ...product, quantity: 1 } }); // Ensure quantity is added
//     setCartMessage("✅ Added to cart!");
//     setTimeout(() => setCartMessage(""), 3000); // Clear message after 3 seconds
//   };

//   const handleOrderNow = () => {
//     if (!product) return;
//     dispatch({ type: "ADD_ITEM", payload: { ...product, quantity: 1 } });
//     router.push("/checkout");
//   };

//   const baseButtonClasses =
//     "w-full sm:w-auto px-6 md:px-8 py-3 text-base font-semibold rounded-lg shadow-md focus:outline-none transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:ring-4 focus:ring-opacity-50 font-body";

//   if (loading) {
//     return (
//       <>
//         <LoadingState />
//       </>
//     );
//   }

//   if (!product) {
//     return (
//       <>
//         <ProductNotFoundState />
//       </>
//     );
//   }

//   return (
//     <>
//       <Head>
//         <title>{product.name} | JK Combat Academy</title>
//         <meta
//           name="description"
//           content={
//             product.shortDescription ||
//             product.description.substring(0, 155) ||
//             `Details for ${product.name}`
//           }
//         />
//         <meta
//           property="og:title"
//           content={`${product.name} | JK Combat Academy`}
//         />
//         <meta
//           property="og:description"
//           content={
//             product.shortDescription ||
//             `High-quality ${product.category} from JK Combat Academy.`
//           }
//         />
//         <meta property="og:image" content={product.image} />{" "}
//         {/* Use absolute URL in production */}
//         <meta property="og:type" content="product" />
//       </Head>

//       <main className="min-h-screen bg-brandBackground dark:bg-slate-900 font-sans pt-8 pb-16">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Breadcrumbs (Optional) */}
//           <div className="mb-6 text-sm font-sans">
//             <Link
//               href="/"
//               className="text-brandAccent hover:text-brandAccentHover"
//             >
//               Home
//             </Link>
//             <span className="mx-2 text-brandTextMuted dark:text-slate-500">
//               /
//             </span>
//             <Link
//               href="/products"
//               className="text-brandAccent hover:text-brandAccentHover"
//             >
//               Products
//             </Link>
//             <span className="mx-2 text-brandTextMuted dark:text-slate-500">
//               /
//             </span>
//             <span className="text-brandTextSecondary dark:text-slate-400">
//               {product.name}
//             </span>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
//             {/* Image Gallery Section */}
//             <div className="flex flex-col items-center">
//               <div className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[4/3] bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
//                 <Image
//                   src={selectedImage || product.image || "/placeholder.png"}
//                   alt={product.name}
//                   layout="fill"
//                   objectFit="contain" // Use 'contain' to see full image, 'cover' might crop
//                   className="transition-transform duration-300 ease-in-out hover:scale-105"
//                   priority // Important for LCP
//                 />
//               </div>
//               {product.galleryImages && product.galleryImages.length > 0 && (
//                 <div className="mt-4 flex space-x-2 overflow-x-auto py-2">
//                   {[product.image, ...product.galleryImages].map(
//                     (img, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedImage(img)}
//                         className={`flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border-2 transition-all duration-200
//                         ${
//                           selectedImage === img
//                             ? "border-brandAccent shadow-lg"
//                             : "border-slate-300 dark:border-slate-600 hover:border-brandAccentFocus"
//                         }`}
//                       >
//                         <Image
//                           src={img || "/placeholder.png"}
//                           alt={`${product.name} thumbnail ${index + 1}`}
//                           layout="fill"
//                           objectFit="cover"
//                         />
//                       </button>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Product Details Section */}
//             <div className="py-4 md:py-0">
//               {product.brand && (
//                 <p className="text-sm font-semibold text-brandAccent dark:text-brandAccentFocus uppercase tracking-wider mb-1 font-body">
//                   {product.brand}
//                 </p>
//               )}
//               <h1 className="text-3xl lg:text-4xl font-bold text-brandTextPrimary dark:text-brandBackground font-header mb-3">
//                 {product.name}
//               </h1>

//               {product.rating && (
//                 <StarRating rating={product.rating} reviews={product.reviews} />
//               )}

//               <div className="my-4 flex items-baseline space-x-3">
//                 <p className="text-4xl font-bold text-brandAccent dark:text-brandAccentFocus">
//                   ৳{product.price.toFixed(2)}
//                 </p>
//                 {product.oldPrice && (
//                   <p className="text-xl font-medium text-brandTextMuted dark:text-slate-500 line-through">
//                     ৳{product.oldPrice.toFixed(2)}
//                   </p>
//                 )}
//               </div>

//               {product.shortDescription && (
//                 <p className="text-md lg:text-lg leading-relaxed text-brandTextSecondary dark:text-slate-300 font-sans mb-6">
//                   {product.shortDescription}
//                 </p>
//               )}

//               {product.stock > 0 ? (
//                 <p className="mb-6 text-sm font-semibold text-green-600 dark:text-green-400">
//                   {product.stock} In Stock - Ready to Ship!
//                 </p>
//               ) : (
//                 <p className="mb-6 text-sm font-semibold text-brandRed dark:text-red-400">
//                   Out of Stock
//                 </p>
//               )}

//               {/* Action Buttons */}
//               <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={product.stock === 0}
//                   className={`${baseButtonClasses} bg-brandAccent text-brandTextOnAccent hover:bg-brandAccentHover focus:ring-brandAccentFocus disabled:opacity-50 disabled:cursor-not-allowed`}
//                 >
//                   {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
//                 </button>
//                 <button
//                   onClick={handleOrderNow}
//                   disabled={product.stock === 0}
//                   className={`${baseButtonClasses} border-2 border-brandAccent text-brandAccent
//                                hover:bg-brandAccent hover:text-brandTextOnAccent
//                                focus:ring-brandAccentFocus
//                                dark:border-brandAccentFocus dark:text-brandAccentFocus
//                                dark:hover:bg-brandAccentFocus dark:hover:text-brandTextPrimary
//                                disabled:opacity-50 disabled:cursor-not-allowed disabled:border-slate-400 disabled:text-slate-400 dark:disabled:border-slate-600 dark:disabled:text-slate-600`}
//                 >
//                   {product.stock === 0 ? "Unavailable" : "Order Now"}
//                 </button>
//               </div>
//               {cartMessage && (
//                 <p className="mt-4 text-sm text-green-600 dark:text-green-400 font-semibold transition-opacity duration-300">
//                   {cartMessage}
//                 </p>
//               )}

//               {/* Product Tabs / Accordion for more details (Optional) */}
//               <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
//                 <h2 className="text-xl font-semibold text-brandTextSoft dark:text-slate-200 font-header mb-3">
//                   Product Description
//                 </h2>
//                 {/* Using dangerouslySetInnerHTML for demo HTML content. Sanitize in real app. */}
//                 <div
//                   className="prose prose-slate dark:prose-invert max-w-none font-body text-brandTextSecondary dark:text-slate-300"
//                   dangerouslySetInnerHTML={{ __html: product.description }}
//                 />

//                 {product.specifications &&
//                   product.specifications.length > 0 && (
//                     <div className="mt-8">
//                       <h3 className="text-lg font-semibold text-brandTextSoft dark:text-slate-200 font-header mb-3">
//                         Specifications
//                       </h3>
//                       <ul className="space-y-2">
//                         {product.specifications.map((spec) => (
//                           <li
//                             key={spec.name}
//                             className="flex justify-between text-sm"
//                           >
//                             <span className="font-medium text-brandTextSecondary dark:text-slate-400">
//                               {spec.name}:
//                             </span>
//                             <span className="text-brandTextPrimary dark:text-slate-200">
//                               {spec.value}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>

//           {/* Related Products Section (Optional) */}
//           <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700">
//             <h2 className="text-2xl font-bold text-center text-brandTextPrimary dark:text-brandBackground font-header mb-8">
//               You Might Also Like
//             </h2>
//             {/* Component to display related products */}
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

// pages/products/[id].js
// pages/products/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCartDispatch } from "../../context/CartContext"; // Assuming path is correct

// --- Helper Components ---
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-brandBackground dark:bg-slate-900 p-8 font-sans">
    {/* Changed min-h-[calc(100vh-200px)] to min-h-screen as Navbar/Footer are removed */}
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brandAccent mb-6"></div>
    <p className="text-xl font-medium text-brandTextSecondary dark:text-slate-400 font-body">
      Loading product details...
    </p>
  </div>
);

const ProductNotFoundState = ({ errorMsg }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-brandBackground dark:bg-slate-900 p-8 font-sans">
    {/* Changed min-h-[calc(100vh-200px)] to min-h-screen */}
    <div className="text-center">
      <h1 className="text-3xl font-bold text-brandRed dark:text-red-400 font-header mb-4">
        Product Not Found
      </h1>
      <p className="text-lg text-brandTextSecondary dark:text-slate-400 font-body mb-2">
        Sorry, we couldn't find the product you're looking for.
      </p>
      {errorMsg && (
        <p className="text-sm text-brandTextMuted dark:text-slate-500 mb-8">
          ({errorMsg})
        </p>
      )}
      <Link
        href="/products"
        className="inline-block px-8 py-3 text-base font-semibold rounded-lg shadow-md focus:outline-none transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:ring-4 focus:ring-opacity-50 bg-brandAccent text-brandTextOnAccent hover:bg-brandAccentHover focus:ring-brandAccentFocus font-body"
      >
        Back to All Products
      </Link>
    </div>
  </div>
);

const StarRating = ({ rating, reviews }) => {
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return null;
  }
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1 text-amber-500">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-5 h-5 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .5l2.939 5.455 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      {halfStar && (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .5V12.39l-3.293 1.723.626-3.65L4.93 7.91l3.664-.532L10 3.86v8.532zM10 12.392V3.86l1.837 3.408 3.75.545-2.715 2.645.64 3.733z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 fill-current text-slate-300 dark:text-slate-600"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .5l2.939 5.455 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      {reviews !== undefined && reviews > 0 && (
        <span className="ml-2 text-sm text-brandTextMuted dark:text-slate-400">
          ({reviews} reviews)
        </span>
      )}
    </div>
  );
};

export default function ProductViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const dispatch = useCartDispatch();

  const fetchProductDetails = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        let errorData = {
          message: `API error: ${response.status} ${response.statusText}`,
        };
        try {
          const apiError = await response.json();
          errorData.message =
            apiError.message || apiError.error || errorData.message;
          if (apiError.details) errorData.details = apiError.details;
        } catch (e) {
          console.warn(
            "Could not parse error response as JSON from API for product ID:",
            productId
          );
        }
        let errorMessage = errorData.message;
        if (errorData.details)
          errorMessage += ` (Details: ${errorData.details})`;
        throw new Error(errorMessage);
      }
      const data = await response.json();

      if (data && data.product) {
        setProduct(data.product);
        setSelectedImage(
          data.product.mainImage ||
            (data.product.galleryImages && data.product.galleryImages[0]) ||
            null
        );
      } else if (data && data.id) {
        setProduct(data);
        setSelectedImage(
          data.mainImage ||
            (data.galleryImages && data.galleryImages[0]) ||
            null
        );
      } else {
        throw new Error("Product data received from API is empty or invalid.");
      }
    } catch (fetchError) {
      console.error("Failed to fetch product details:", fetchError);
      setError(
        fetchError.message ||
          "Could not load product details. Please try again later."
      );
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch({ type: "ADD_ITEM", payload: { ...product, quantity: 1 } });
    setCartMessage("✅ Added to cart!");
    setTimeout(() => setCartMessage(""), 3000);
  };

  const handleOrderNow = () => {
    if (!product) return;
    dispatch({ type: "ADD_ITEM", payload: { ...product, quantity: 1 } });
    router.push("/checkout");
  };

  const baseButtonClasses =
    "w-full sm:w-auto px-6 md:px-8 py-3 text-base font-semibold rounded-lg shadow-md focus:outline-none transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:ring-4 focus:ring-opacity-50 font-body";

  if (loading) {
    return <LoadingState />;
  }

  if (error || !product) {
    return <ProductNotFoundState errorMsg={error} />;
  }

  const currentPrice =
    typeof product.price === "number" ? product.price.toFixed(2) : "N/A";
  const originalPriceDisplay =
    product.oldPrice && typeof product.oldPrice === "number"
      ? product.oldPrice.toFixed(2)
      : null;
  const stockQuantity =
    typeof product.stockQuantity === "number" ? product.stockQuantity : 0;

  return (
    <>
      <Head>
        <title>{product.name || "Product"} | JK Combat Academy</title>
        <meta
          name="description"
          content={
            product.shortDescription ||
            (product.detailedDescription &&
            typeof product.detailedDescription === "string"
              ? product.detailedDescription
                  .replace(/<[^>]*>?/gm, "")
                  .substring(0, 155)
              : `Details for ${product.name || "Product"}`)
          }
        />
        <meta
          property="og:title"
          content={`${product.name || "Product"} | JK Combat Academy`}
        />
        <meta
          property="og:description"
          content={
            product.shortDescription ||
            `High-quality ${product.category} from JK Combat Academy.`
          }
        />
        <meta
          property="og:image"
          content={product.mainImage || "/placeholder.png"}
        />
        <meta property="og:type" content="product" />
      </Head>

      {/* Main content wrapper, ensuring it takes full screen height if needed */}
      <div className="min-h-screen bg-brandBackground dark:bg-slate-900 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {" "}
          {/* Added top/bottom padding here */}
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm font-sans">
            <Link
              href="/"
              className="text-brandAccent hover:text-brandAccentHover transition-colors"
            >
              Home
            </Link>
            <span className="mx-2 text-brandTextMuted dark:text-slate-500">
              /
            </span>
            <Link
              href="/products"
              className="text-brandAccent hover:text-brandAccentHover transition-colors"
            >
              Products
            </Link>
            <span className="mx-2 text-brandTextMuted dark:text-slate-500">
              /
            </span>
            <span className="text-brandTextSecondary dark:text-slate-400">
              {product.name}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Image Gallery Section */}
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[4/3] bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <Image
                  src={selectedImage || product.mainImage || "/placeholder.png"}
                  alt={product.name || "Product Image"}
                  layout="fill"
                  objectFit="contain"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                  priority
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              {(product.mainImage ||
                (product.galleryImages &&
                  product.galleryImages.length > 0)) && (
                <div className="mt-4 flex space-x-2 overflow-x-auto py-2 justify-center">
                  {[product.mainImage, ...(product.galleryImages || [])]
                    .filter(Boolean)
                    .map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brandAccentFocus ${
                          selectedImage === img
                            ? "border-brandAccent shadow-lg ring-2 ring-brandAccentFocus ring-offset-2 dark:ring-offset-slate-900"
                            : "border-slate-300 dark:border-slate-600 hover:border-brandAccentFocus"
                        }`}
                      >
                        {" "}
                        <Image
                          src={img || "/placeholder.png"}
                          alt={`${product.name || "Product"} thumbnail ${
                            index + 1
                          }`}
                          layout="fill"
                          objectFit="cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                          }}
                        />{" "}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="py-4 md:py-0">
              {product.brand && (
                <p className="text-xs sm:text-sm font-semibold text-brandAccent dark:text-brandAccentFocus uppercase tracking-wider mb-1.5 font-body">
                  {" "}
                  {product.brand}{" "}
                </p>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brandTextPrimary dark:text-brandBackground font-header mb-3">
                {" "}
                {product.name}{" "}
              </h1>
              {product.rating !== undefined && (
                <StarRating rating={product.rating} reviews={product.reviews} />
              )}
              <div className="my-4 flex items-baseline space-x-3">
                <p className="text-3xl sm:text-4xl font-bold text-brandAccent dark:text-brandAccentFocus">
                  {" "}
                  ৳{currentPrice}{" "}
                </p>
                {originalPriceDisplay && (
                  <p className="text-lg sm:text-xl font-medium text-brandTextMuted dark:text-slate-500 line-through">
                    {" "}
                    ৳{originalPriceDisplay}{" "}
                  </p>
                )}
              </div>
              {product.shortDescription && (
                <p className="text-md lg:text-lg leading-relaxed text-brandTextSecondary dark:text-slate-300 font-sans mb-6">
                  {" "}
                  {product.shortDescription}{" "}
                </p>
              )}
              {stockQuantity > 0 ? (
                <p className="mb-6 text-sm font-semibold text-green-600 dark:text-green-400 flex items-center">
                  {" "}
                  <svg
                    className="w-4 h-4 mr-1.5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                  </svg>{" "}
                  {stockQuantity} In Stock - Ready to Ship!{" "}
                </p>
              ) : (
                <p className="mb-6 text-sm font-semibold text-brandRed dark:text-red-400 flex items-center">
                  {" "}
                  <svg
                    className="w-4 h-4 mr-1.5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    ></path>
                  </svg>{" "}
                  Out of Stock{" "}
                </p>
              )}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                <button
                  onClick={handleAddToCart}
                  disabled={stockQuantity === 0}
                  className={`${baseButtonClasses} bg-brandAccent text-brandTextOnAccent hover:bg-brandAccentHover focus:ring-brandAccentFocus disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:-translate-y-0`}
                >
                  {" "}
                  {stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}{" "}
                </button>
                <button
                  onClick={handleOrderNow}
                  disabled={stockQuantity === 0}
                  className={`${baseButtonClasses} border-2 border-brandAccent text-brandAccent hover:bg-brandAccent hover:text-brandTextOnAccent focus:ring-brandAccentFocus dark:border-brandAccentFocus dark:text-brandAccentFocus dark:hover:bg-brandAccentFocus dark:hover:text-brandTextPrimary disabled:opacity-60 disabled:cursor-not-allowed disabled:border-slate-400 disabled:text-slate-400 dark:disabled:border-slate-600 dark:disabled:text-slate-600 disabled:hover:-translate-y-0`}
                >
                  {" "}
                  {stockQuantity === 0 ? "Unavailable" : "Order Now"}{" "}
                </button>
              </div>
              {cartMessage && (
                <p className="mt-4 text-sm text-green-600 dark:text-green-400 font-semibold transition-opacity duration-300 animate-pulse">
                  {" "}
                  {cartMessage}{" "}
                </p>
              )}
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-brandTextSoft dark:text-slate-200 font-header mb-3">
                  {" "}
                  Product Description{" "}
                </h2>
                <div
                  className="prose prose-sm sm:prose-base dark:prose-invert max-w-none font-body text-brandTextSecondary dark:text-slate-300"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.detailedDescription ||
                      "<p>No detailed description available.</p>",
                  }}
                />
                {product.specifications &&
                  product.specifications.length > 0 && (
                    <div className="mt-8">
                      {" "}
                      <h3 className="text-lg font-semibold text-brandTextSoft dark:text-slate-200 font-header mb-4">
                        {" "}
                        Specifications{" "}
                      </h3>{" "}
                      <div className="bg-white dark:bg-slate-800/50 shadow border border-slate-200 dark:border-slate-700 rounded-lg">
                        {" "}
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                          {" "}
                          {product.specifications.map((spec) => (
                            <li
                              key={spec.name}
                              className="px-4 py-3 sm:px-6 grid grid-cols-3 gap-4 items-center"
                            >
                              {" "}
                              <span className="text-sm font-medium text-brandTextSecondary dark:text-slate-400 col-span-1">
                                {spec.name}
                              </span>{" "}
                              <span className="text-sm text-brandTextPrimary dark:text-slate-200 col-span-2">
                                {spec.value}
                              </span>{" "}
                            </li>
                          ))}{" "}
                        </ul>{" "}
                      </div>{" "}
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-brandTextPrimary dark:text-brandBackground font-header mb-8">
              {" "}
              You Might Also Like{" "}
            </h2>
            <p className="text-center text-brandTextSecondary dark:text-slate-400">
              Related products will be shown here.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
