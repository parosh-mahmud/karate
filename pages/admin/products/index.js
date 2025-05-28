// pages/admin/products/index.js
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../../../components/admin/AdminLayout";
import { db, storage } from "../../../utils/firebase"; // Assuming Firebase for data
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // For deleting images from Storage

// Example icons (keep these as they are)
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.086 3.223.244m3.787 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.51_8M4.772 5.79L3.75 15.75M21 15.75L19.228 5.79m0 0a3.007 3.007 0 00-2.998-2.565H7.77a3.007 3.007 0 00-2.998 2.565m12.228 0h-4.158"
    />
  </svg>
);
const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);
const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const productsCollectionRef = collection(db, "products");
      const q = query(productsCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));

      // Add these console.logs
      console.log("All products:", productsData);
      productsData.forEach((product) => {
        console.log(`Product ${product.name}:`, {
          id: product.id,
          mainImage: product.mainImage,
          hasMainImage: !!product.mainImage,
          imageURL: product.mainImage || "/placeholder.png",
        });
      });

      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products: ", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // fetchProducts is now a stable dependency

  const handleDeleteProductImage = async (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith("https://storage.googleapis.com/")) {
      console.log(
        "Not a Firebase Storage URL or no image, skipping delete:",
        imageUrl
      );
      return;
    }
    try {
      const imageRef = ref(storage, imageUrl); // Create a reference directly from the URL
      await deleteObject(imageRef);
      console.log("Successfully deleted image from storage:", imageUrl);
    } catch (err) {
      if (err.code === "storage/object-not-found") {
        console.warn("Image not found in storage, skipping:", imageUrl);
      } else {
        console.error("Error deleting image from storage:", imageUrl, err);
        // Decide if you want to alert the user or just log
      }
    }
  };

  const handleDelete = async (productId, productImages) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product and all its images? This action cannot be undone."
      )
    ) {
      try {
        // 1. Delete images from Firebase Storage
        if (productImages.mainImage) {
          await handleDeleteProductImage(productImages.mainImage);
        }
        if (
          productImages.galleryImages &&
          productImages.galleryImages.length > 0
        ) {
          for (const imageUrl of productImages.galleryImages) {
            await handleDeleteProductImage(imageUrl);
          }
        }
        // You might also want to delete a folder if images are namespaced by productId in Storage:
        // e.g., `products/${productId}/` - this is more complex and involves listing all files in the folder.

        // 2. Delete product document from Firestore
        await deleteDoc(doc(db, "products", productId));

        // 3. Update local state
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== productId)
        );
        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Error deleting product: ", err);
        alert("Failed to delete product. Check console for details.");
      }
    }
  };

  const tableHeaderStyle =
    "px-5 py-3 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-left text-xs font-semibold text-brandTextSecondary dark:text-slate-300 uppercase tracking-wider font-sans";
  const tableCellStyle =
    "px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-brandTextPrimary dark:text-slate-200 font-sans align-middle";
  const actionButtonStyle =
    "text-brandAccent hover:text-brandAccentHover transition-colors duration-200";
  const deleteButtonStyle =
    "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 ml-3";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brandAccent"></div>
        <p className="ml-4 text-brandTextSecondary dark:text-slate-400">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 font-sans">
        <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 flex items-center mx-auto bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <RefreshIcon /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground font-header">
          Manage Products
        </h1>
        <div className="flex gap-4">
          <button
            onClick={fetchProducts}
            title="Refresh Product List"
            className="flex items-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-brandTextPrimary dark:text-slate-100 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brandAccentFocus focus:ring-opacity-50"
          >
            <RefreshIcon /> Refresh
          </button>
          <Link
            href="/admin/products/add"
            className="flex items-center bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brandAccentFocus focus:ring-opacity-50"
          >
            <AddIcon /> Add New Product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className={tableHeaderStyle}>Image</th>
              <th className={tableHeaderStyle}>Name</th>
              <th className={tableHeaderStyle}>Category</th>
              <th className={tableHeaderStyle}>Price</th>
              <th className={tableHeaderStyle}>Stock</th>
              <th className={tableHeaderStyle}>Published</th>
              <th className={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-brandTextSecondary dark:text-slate-400"
                >
                  No products found. Add some!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                >
                  <td className={tableCellStyle}>
                    <div className="relative w-16 h-16">
                      <Image
                        src={
                          product.mainImage || "/images/product-placeholder.png"
                        }
                        alt={product.name || "Product Image"}
                        fill
                        sizes="64px"
                        className="rounded-md object-contain bg-white dark:bg-slate-700 p-1"
                        onError={(e) => {
                          console.error(
                            `Image load error for product ${product.id}:`,
                            e
                          );
                          e.target.src = "/images/product-placeholder.png";
                        }}
                        unoptimized={true}
                      />
                    </div>
                  </td>
                  <td className={tableCellStyle}>
                    <p className="font-semibold whitespace-nowrap">
                      {product.name}
                    </p>
                    {product.sku && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        SKU: {product.sku}
                      </p>
                    )}
                  </td>
                  <td className={tableCellStyle}>{product.category}</td>
                  <td className={tableCellStyle}>
                    {product.salePrice && product.salePrice < product.price ? (
                      <>
                        <span className="text-red-500 font-semibold">
                          ৳{product.salePrice.toFixed(2)}
                        </span>
                        <span className="ml-2 line-through text-slate-500 dark:text-slate-400 text-xs">
                          ৳{product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      `৳${product.price.toFixed(2)}`
                    )}
                  </td>
                  <td className={tableCellStyle}>
                    <span
                      className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${
                        product.stockQuantity > 10
                          ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                          : product.stockQuantity > 0
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100"
                          : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                      }`}
                    >
                      {product.stockQuantity > 0
                        ? `${product.stockQuantity} In Stock`
                        : "Out of Stock"}
                    </span>
                  </td>
                  <td className={tableCellStyle}>
                    <span
                      className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${
                        product.isPublished
                          ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200"
                      }`}
                    >
                      {product.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className={`${tableCellStyle} whitespace-nowrap`}>
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className={actionButtonStyle}
                      title="Edit"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(product.id, {
                          mainImage: product.mainImage,
                          galleryImages: product.galleryImages,
                        })
                      }
                      className={deleteButtonStyle}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Consider adding pagination if you have many products */}
    </div>
  );
}

AdminProductsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
