// pages/admin/products/edit/[productId].js
// This component will be very similar to AddProductPage.
// Key differences:
// 1. Fetch product data using `productId` from `router.query` in a useEffect.
// 2. Set the `productData` state with the fetched data to pre-fill the form.
// 3. The `handleSubmit` function will call an update function (e.g., `updateDoc` for Firebase)
//    instead of `addDoc`.

import { useState, useEffect, useMemo } from "react";
// import { db, storage } from "../../../utils/firebase";
// import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import AdminLayout from "../../../../components/admin/AdminLayout";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Reuse constants from AddProductPage or define them in a shared file
const productCategories = [
  "Gloves",
  "Pads",
  "Uniforms",
  "Training Gear",
  "Weapons (Training)",
  "Apparel",
  "Accessories",
];
const suitabilityOptions = [
  "Boxing",
  "MMA",
  "Karate",
  "Judo",
  "Taekwondo",
  "BJJ",
  "Muay Thai",
  "Fitness",
  "Beginner",
  "Intermediate",
  "Professional",
];
const sizeOptions = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "OSFA (One Size Fits All)",
];
const commonColors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Gray",
];

export default function EditProductPage() {
  const router = useRouter();
  const { productId } = router.query;
  const [productData, setProductData] = useState({
    name: "",
    shortDescription: "",
    detailedDescription: "",
    sku: "",
    price: "",
    salePrice: "",
    stockQuantity: "",
    lowStockThreshold: "",
    category: productCategories[0],
    tags: "",
    brand: "",
    material: "",
    sizes: [],
    colors: [],
    weight: "",
    weightUnit: "oz",
    suitableFor: [],
    safetyRating: "",
    mainImage: null,
    mainImageUrlPreview: null,
    existingMainImageUrl: "",
    isPublished: true,
    isFeatured: false,
  });
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const quillModules = useMemo(
    () => ({
      // Memoize modules for performance
      toolbar: [
        /* ... same as add page ... */
      ],
    }),
    []
  );

  useEffect(() => {
    if (!productId) return;
    setLoadingProduct(true);
    const fetchProduct = async () => {
      try {
        // const docRef = doc(db, "products", productId);
        // const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) {
        //   const data = docSnap.data();
        //   setProductData({
        //     ...data,
        //     price: data.price?.toString() || "", // Ensure strings for form inputs
        //     salePrice: data.salePrice?.toString() || "",
        //     stockQuantity: data.stockQuantity?.toString() || "",
        //     lowStockThreshold: data.lowStockThreshold?.toString() || "",
        //     tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        //     sizes: Array.isArray(data.sizes) ? data.sizes : [],
        //     colors: Array.isArray(data.colors) ? data.colors : [],
        //     suitableFor: Array.isArray(data.suitableFor) ? data.suitableFor : [],
        //     mainImage: null, // Don't prefill file input
        //     mainImageUrlPreview: data.mainImage || null, // Use existing image for preview
        //     existingMainImageUrl: data.mainImage || "",
        //     weight: data.weight?.toString() || "",
        //   });
        // } else {
        //   console.log("No such product!");
        //   router.push("/admin/products?error=notfound");
        // }
        console.log("Mock fetching product:", productId);
        // Simulate fetch
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProductData({
          // Placeholder data
          name: "Editable Boxing Gloves",
          shortDescription: "Pro quality",
          detailedDescription: "<p>Very good gloves.</p>",
          sku: "EBG001",
          price: "55.99",
          salePrice: "49.99",
          stockQuantity: "45",
          lowStockThreshold: "5",
          category: "Gloves",
          tags: "pro, leather",
          brand: "CombatPro",
          material: "Genuine Leather",
          sizes: ["M", "L"],
          colors: ["Black", "Red"],
          weight: "12",
          weightUnit: "oz",
          suitableFor: ["Boxing", "Professional"],
          safetyRating: "AIBA Approved",
          mainImage: null,
          mainImageUrlPreview: "/placeholder-glove.jpg",
          existingMainImageUrl: "/placeholder-glove.jpg",
          isPublished: true,
          isFeatured: false,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        // Handle error (e.g., redirect or show message)
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [productId, router]);

  // handleChange, handleQuillChange are identical to AddProductPage

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setProductData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (name === "mainImage" && files[0]) {
        setProductData((prev) => ({
          ...prev,
          mainImage: files[0], // New file object
          mainImageUrlPreview: URL.createObjectURL(files[0]), // New preview
        }));
      }
    } else if (
      name === "sizes" ||
      name === "colors" ||
      name === "suitableFor"
    ) {
      const options = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setProductData((prev) => ({ ...prev, [name]: options }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuillChange = (value) => {
    setProductData((prev) => ({ ...prev, detailedDescription: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !productData.name ||
      !productData.price ||
      !productData.category ||
      !productData.stockQuantity
    ) {
      alert(
        "Please fill in all required fields: Name, Price, Category, Stock Quantity."
      );
      return;
    }
    setIsSubmitting(true);
    setUploadProgress(0);

    let newMainImageUrl = productData.existingMainImageUrl; // Assume existing image unless new one is uploaded

    if (productData.mainImage) {
      // If a new image file is selected
      // Placeholder for image upload logic
      const formData = new FormData();
      formData.append("productImage", productData.mainImage);
      try {
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress <= 100) setUploadProgress(progress);
          else clearInterval(interval);
        }, 200);

        // TODO: Implement actual image upload. If successful, newMainImageUrl = result.url;
        // TODO: If a new image is uploaded, you might want to delete the old one from storage.
        // const response = await fetch('/api/uploadProductImage', { method: 'POST', body: formData });
        // const result = await response.json();
        // if (!response.ok) throw new Error(result.error || 'Image upload failed');
        // newMainImageUrl = result.url; // This would be the new URL
        await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate network delay
        newMainImageUrl = productData.mainImageUrlPreview; // Using preview for mock
        alert("Mock new image uploaded for update: " + newMainImageUrl);
      } catch (error) {
        console.error("Image upload error:", error);
        alert(`Image upload failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    const finalProductDataToUpdate = {
      ...productData,
      price: parseFloat(productData.price),
      salePrice: productData.salePrice
        ? parseFloat(productData.salePrice)
        : null,
      stockQuantity: parseInt(productData.stockQuantity, 10),
      lowStockThreshold: productData.lowStockThreshold
        ? parseInt(productData.lowStockThreshold, 10)
        : null,
      mainImage: newMainImageUrl, // Updated image URL or existing one
      tags: productData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      updatedAt: new Date().toISOString(), // Or Firebase Timestamp.now()
    };

    // Remove fields not directly part of the product document structure if necessary
    delete finalProductDataToUpdate.mainImageUrlPreview;
    delete finalProductDataToUpdate.existingMainImageUrl;

    try {
      //   const productRef = doc(db, "products", productId);
      //   await updateDoc(productRef, finalProductDataToUpdate);
      console.log("Updating product:", productId, finalProductDataToUpdate);
      alert("Product updated successfully! (Mock)");
      //   router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Styles are identical to AddProductPage
  const inputBaseStyle =
    "mt-1 block w-full border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus font-sans";
  const labelStyle =
    "block text-sm font-medium text-brandTextSecondary dark:text-slate-300 font-sans";
  const checkboxLabelStyle =
    "ml-2 text-sm text-brandTextSecondary dark:text-slate-300 font-sans";
  const checkboxStyle =
    "h-4 w-4 text-brandAccent border-slate-300 dark:border-slate-600 rounded focus:ring-brandAccentFocus";

  if (loadingProduct)
    return (
      <p className="text-center p-10 text-brandTextSecondary dark:text-slate-400">
        Loading product details...
      </p>
    );
  if (!productData.name && !loadingProduct)
    return (
      <p className="text-center p-10 text-red-500 dark:text-red-400">
        Product not found or error loading.
      </p>
    );

  // The JSX form structure will be identical to AddProductPage,
  // just ensure all `value={productData.fieldName}` are correct.
  // The submit button text would be "Update Product".
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      <h1 className="text-2xl sm:text-3xl font-bold text-brandTextPrimary dark:text-brandBackground mb-6 font-header">
        Edit Product: {productData.name || "Loading..."}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700"
      >
        {/* Basic Info Section (Same as AddProductPage, ensure values bind to productData) */}
        <fieldset className="border border-slate-300 dark:border-slate-600 p-4 rounded-md">
          <legend className="text-lg font-semibold text-brandAccent dark:text-brandAccentFocus px-2 font-header">
            Basic Information
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label htmlFor="name" className={labelStyle}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={productData.name}
                onChange={handleChange}
                className={inputBaseStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="sku" className={labelStyle}>
                SKU
              </label>
              <input
                type="text"
                name="sku"
                id="sku"
                value={productData.sku}
                onChange={handleChange}
                className={inputBaseStyle}
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="shortDescription" className={labelStyle}>
              Short Description
            </label>
            <textarea
              name="shortDescription"
              id="shortDescription"
              value={productData.shortDescription}
              onChange={handleChange}
              rows="3"
              maxLength="150"
              className={inputBaseStyle}
            ></textarea>
          </div>
          <div className="mt-4">
            <label htmlFor="detailedDescription" className={labelStyle}>
              Detailed Description
            </label>
            <div className="mt-1 min-h-[200px] bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 rounded-md quill-container">
              <ReactQuill
                theme="snow"
                value={productData.detailedDescription}
                onChange={handleQuillChange}
                modules={quillModules}
                className="h-full"
              />
            </div>
          </div>
        </fieldset>

        {/* Pricing & Inventory Section (Same as AddProductPage) */}
        <fieldset className="border border-slate-300 dark:border-slate-600 p-4 rounded-md">
          <legend className="text-lg font-semibold text-brandAccent dark:text-brandAccentFocus px-2 font-header">
            Pricing & Inventory
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label htmlFor="price" className={labelStyle}>
                Price (BDT) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={productData.price}
                onChange={handleChange}
                className={inputBaseStyle}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="salePrice" className={labelStyle}>
                Sale Price (BDT)
              </label>
              <input
                type="number"
                name="salePrice"
                id="salePrice"
                value={productData.salePrice}
                onChange={handleChange}
                className={inputBaseStyle}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="stockQuantity" className={labelStyle}>
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stockQuantity"
                id="stockQuantity"
                value={productData.stockQuantity}
                onChange={handleChange}
                className={inputBaseStyle}
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="lowStockThreshold" className={labelStyle}>
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                id="lowStockThreshold"
                value={productData.lowStockThreshold}
                onChange={handleChange}
                className={inputBaseStyle}
                min="0"
              />
            </div>
          </div>
        </fieldset>

        {/* Categorization & Details Section (Same as AddProductPage) */}
        <fieldset className="border border-slate-300 dark:border-slate-600 p-4 rounded-md">
          <legend className="text-lg font-semibold text-brandAccent dark:text-brandAccentFocus px-2 font-header">
            Categorization & Details
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label htmlFor="category" className={labelStyle}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                id="category"
                value={productData.category}
                onChange={handleChange}
                className={inputBaseStyle}
                required
              >
                {productCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="brand" className={labelStyle}>
                Brand
              </label>
              <input
                type="text"
                name="brand"
                id="brand"
                value={productData.brand}
                onChange={handleChange}
                className={inputBaseStyle}
              />
            </div>
            <div>
              <label htmlFor="tags" className={labelStyle}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={productData.tags}
                onChange={handleChange}
                className={inputBaseStyle}
                placeholder="e.g., leather, training, heavy-duty"
              />
            </div>
            <div>
              <label htmlFor="material" className={labelStyle}>
                Material
              </label>
              <input
                type="text"
                name="material"
                id="material"
                value={productData.material}
                onChange={handleChange}
                className={inputBaseStyle}
                placeholder="e.g., Genuine Leather, Synthetic PU"
              />
            </div>
            <div>
              <label htmlFor="sizes" className={labelStyle}>
                Available Sizes
              </label>
              <select
                multiple
                name="sizes"
                id="sizes"
                value={productData.sizes}
                onChange={handleChange}
                className={`${inputBaseStyle} h-32`}
              >
                {sizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="colors" className={labelStyle}>
                Available Colors
              </label>
              <select
                multiple
                name="colors"
                id="colors"
                value={productData.colors}
                onChange={handleChange}
                className={`${inputBaseStyle} h-32`}
              >
                {commonColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="suitableFor" className={labelStyle}>
                Suitable For
              </label>
              <select
                multiple
                name="suitableFor"
                id="suitableFor"
                value={productData.suitableFor}
                onChange={handleChange}
                className={`${inputBaseStyle} h-32`}
              >
                {suitabilityOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="weight" className={labelStyle}>
                Weight
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  value={productData.weight}
                  onChange={handleChange}
                  className={inputBaseStyle}
                  min="0"
                  step="0.1"
                />
                <select
                  name="weightUnit"
                  value={productData.weightUnit}
                  onChange={handleChange}
                  className={inputBaseStyle}
                >
                  <option value="oz">oz</option>
                  <option value="lbs">lbs</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="safetyRating" className={labelStyle}>
                Safety Rating
              </label>
              <input
                type="text"
                name="safetyRating"
                id="safetyRating"
                value={productData.safetyRating}
                onChange={handleChange}
                className={inputBaseStyle}
              />
            </div>
          </div>
        </fieldset>

        {/* Media Section (Same as AddProductPage, but show existing image) */}
        <fieldset className="border border-slate-300 dark:border-slate-600 p-4 rounded-md">
          <legend className="text-lg font-semibold text-brandAccent dark:text-brandAccentFocus px-2 font-header">
            Media
          </legend>
          <div className="mt-4">
            <label htmlFor="mainImage" className={labelStyle}>
              Change Main Product Image
            </label>
            <input
              type="file"
              name="mainImage"
              id="mainImage"
              accept="image/*"
              onChange={handleChange}
              className={`mt-1 block w-full text-sm ${inputBaseStyle} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-brandAccent file:text-brandTextOnAccent hover:file:bg-brandAccentHover`}
            />
            {productData.mainImageUrlPreview && (
              <div className="mt-4">
                <p className={labelStyle}>Image Preview:</p>
                <Image
                  src={productData.mainImageUrlPreview}
                  alt="Main image preview"
                  width={200}
                  height={200}
                  className="rounded-md object-contain border border-slate-300 dark:border-slate-600"
                />
              </div>
            )}
          </div>
        </fieldset>

        {/* Status Section (Same as AddProductPage) */}
        <fieldset className="border border-slate-300 dark:border-slate-600 p-4 rounded-md">
          <legend className="text-lg font-semibold text-brandAccent dark:text-brandAccentFocus px-2 font-header">
            Status
          </legend>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPublished"
                id="isPublished"
                checked={productData.isPublished}
                onChange={handleChange}
                className={checkboxStyle}
              />
              <label htmlFor="isPublished" className={checkboxLabelStyle}>
                Publish Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={productData.isFeatured}
                onChange={handleChange}
                className={checkboxStyle}
              />
              <label htmlFor="isFeatured" className={checkboxLabelStyle}>
                Feature this Product
              </label>
            </div>
          </div>
        </fieldset>

        {isSubmitting && uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-4">
            <div
              className="bg-brandAccent h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="mr-4 px-6 py-2 text-sm font-medium text-brandTextSecondary dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800 transition-colors duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-brandTextOnAccent bg-brandAccent hover:bg-brandAccentHover rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandAccentFocus dark:focus:ring-offset-slate-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

EditProductPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
