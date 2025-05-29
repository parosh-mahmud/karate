// components/products/ProductList.js
import ProductCard from "./ProductCard"; // Ensure ProductCard is well-styled and handles its props

export default function ProductList({ products }) {
  // Defensive check: If products is not a valid array (e.g., null, undefined),
  // render nothing. The parent component (ProductsPage) should ideally prevent this,
  // but this makes ProductList more robust if used in other contexts.
  if (!Array.isArray(products)) {
    // In development, it's helpful to know if the prop is incorrect.
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "ProductList received a non-array for the 'products' prop:",
        products
      );
    }
    return null;
  }

  // The parent ProductsPage already handles the case where the products array is empty
  // by not rendering this ProductList component. If this component were to be used
  // in a context where it might receive an empty array and need to display a message,
  // you could add that logic here. For its current usage, this is sufficient.
  // Example for handling empty directly:
  // if (products.length === 0) {
  //   return <p className="col-span-full text-center text-brandTextSecondary dark:text-slate-400 py-10">No products to display in this list.</p>;
  // }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:gap-x-5 md:gap-y-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10 xl:grid-cols-4">
      {/*
        Responsive Grid Layout:
        - Default (mobile): 1 column
        - Small screens (sm): 2 columns
        - Large screens (lg): 3 columns
        - Extra-large screens (xl): 4 columns

        Responsive Gaps:
        - Mobile: Horizontal gap-x-4, Vertical gap-y-6
        - Medium screens (md): Horizontal gap-x-5, Vertical gap-y-8
        - Large screens & up (lg): Horizontal gap-x-6, Vertical gap-y-10 (larger vertical gap for better row separation)
        This provides a good visual rhythm and spacing for the product cards across various screen sizes.
      */}
      {products.map((product) => (
        // The ProductCard component is responsible for its own internal structure,
        // styling, and how it presents the individual 'product' data.
        // The 'key' prop is essential for React's list rendering.
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
