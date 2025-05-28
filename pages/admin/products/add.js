// pages/admin/products/add.js
import { useState, useMemo, useEffect } from "react";
import { db, storage } from "../../../utils/firebase"; // For Firebase
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Image from "next/image";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Example categories and suitability options
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
]; // OSFA = One Size Fits All
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

export default function AddProductPage() {
  const router = useRouter();
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
    tags: "", // comma-separated
    brand: "",
    material: "",
    sizes: [],
    colors: [],
    weight: "",
    weightUnit: "oz",
    suitableFor: [],
    safetyRating: "",
    mainImage: null, // File object
    mainImageUrlPreview: null,
    additionalImages: [], // Array of File objects - for multiple images later
    additionalImagesUrlPreviews: [],
    isPublished: true,
    isFeatured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const quillModules = useMemo(
    () => ({
      // Memoize modules for performance
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"], // Consider 'video' if needed
        ["clean"],
      ],
    }),
    []
  );

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setProductData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (name === "mainImage" && files[0]) {
        setProductData((prev) => ({
          ...prev,
          mainImage: files[0],
          mainImageUrlPreview: URL.createObjectURL(files[0]),
        }));
      } else if (name === "additionalImages" && files.length > 0) {
        const fileArray = Array.from(files);
        const previewUrls = fileArray.map((file) => URL.createObjectURL(file));

        setProductData((prev) => ({
          ...prev,
          additionalImages: fileArray,
          additionalImagesUrlPreviews: previewUrls,
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
  // Add cleanup useEffect
  useEffect(() => {
    return () => {
      // Cleanup function to revoke object URLs
      if (productData.mainImageUrlPreview) {
        URL.revokeObjectURL(productData.mainImageUrlPreview);
      }
      productData.additionalImagesUrlPreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [
    productData.mainImageUrlPreview,
    productData.additionalImagesUrlPreviews,
  ]);

  // Add this helper function before the handleSubmit function
  const uploadImageToFirebase = async (file, path) => {
    if (!file) return null;

    const storageRef = ref(storage, `products/${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  // Update the handleSubmit function
  // Update the handleSubmit function to properly clean the data
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

    try {
      // Upload main image first
      let mainImageUrl = "";
      if (productData.mainImage instanceof File) {
        mainImageUrl = await uploadImageToFirebase(
          productData.mainImage,
          "main"
        );
      }

      // Upload additional images
      let galleryImageUrls = [];
      if (
        Array.isArray(productData.additionalImages) &&
        productData.additionalImages.length > 0
      ) {
        const uploadPromises = productData.additionalImages.map((file, index) =>
          uploadImageToFirebase(file, `gallery/${Date.now()}-${index}`)
        );
        galleryImageUrls = await Promise.all(uploadPromises);
      }

      // Clean up the product data before submission
      const {
        mainImage,
        mainImageUrlPreview,
        additionalImages,
        additionalImagesUrlPreviews,
        ...cleanProductData
      } = productData;

      // Prepare product data for Firestore
      const productToSubmit = {
        ...cleanProductData,
        mainImage: mainImageUrl,
        galleryImages: galleryImageUrls,
        tags: cleanProductData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        price: Number(cleanProductData.price),
        salePrice: cleanProductData.salePrice
          ? Number(cleanProductData.salePrice)
          : null,
        stockQuantity: Number(cleanProductData.stockQuantity),
        lowStockThreshold: cleanProductData.lowStockThreshold
          ? Number(cleanProductData.lowStockThreshold)
          : null,
        weight: cleanProductData.weight
          ? Number(cleanProductData.weight)
          : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Add document to Firestore
      const docRef = await addDoc(collection(db, "products"), productToSubmit);

      alert(`Product added successfully! ID: ${docRef.id}`);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert(
        `Product creation failed: ${error.message}. Please check console for details.`
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const inputBaseStyle =
    "mt-1 block w-full border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-slate-700 text-brandTextPrimary dark:text-slate-100 focus:ring-brandAccentFocus focus:border-brandAccentFocus font-sans";
  const labelStyle =
    "block text-sm font-medium text-brandTextSecondary dark:text-slate-300 font-sans";
  const checkboxLabelStyle =
    "ml-2 text-sm text-brandTextSecondary dark:text-slate-300 font-sans";
  const checkboxStyle =
    "h-4 w-4 text-brandAccent border-slate-300 dark:border-slate-600 rounded focus:ring-brandAccentFocus";
  const fileInputStyle = `mt-1 block w-full text-sm ${inputBaseStyle} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-brandAccent file:text-brandTextOnAccent hover:file:bg-brandAccentHover`;

  return (
    <>
      {/* Ensure this wraps content that requires admin access */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
        <h1 className="text-2xl sm:text-3xl font-bold text-brandTextPrimary dark:text-brandBackground mb-6 font-header">
          Add New Product
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700"
        >
          {/* Basic Info Section (same as before) */}
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
                  SKU (Stock Keeping Unit)
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
                Short Description (Max 150 characters)
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

          {/* Pricing & Inventory Section (same as before) */}
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

          {/* Categorization & Details Section (same as before) */}
          <fieldset className="border border-slate-300 dark:border-slate-600 p-4 rounded-md">
            <legend className="text-lg font-semibold text-brandAccent dark:text-brandAccentFocus px-2 font-header">
              Categorization & Details
            </legend>
            {/* ... All fields from SKU to Safety Rating remain the same ... */}
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
                  Available Sizes (select multiple)
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
                  Available Colors (select multiple)
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
                  Suitable For (select multiple)
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
                    <option value="oz">oz</option>{" "}
                    <option value="lbs">lbs</option>{" "}
                    <option value="g">g</option> <option value="kg">kg</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="safetyRating" className={labelStyle}>
                  Safety Rating/Certification
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

          {/* Media Section - UPDATED */}
          <fieldset className="border border-slate-300 dark:border-slate-600 p-4 rounded-md">
            <legend className="text-lg font-semibold text-brandAccent dark:text-brandAccentFocus px-2 font-header">
              Media
            </legend>
            {/* Main Image Input */}
            <div className="mt-4">
              <label htmlFor="mainImage" className={labelStyle}>
                Main Product Image
              </label>
              <input
                type="file"
                name="mainImage"
                id="mainImage"
                accept="image/*"
                onChange={handleChange}
                className={fileInputStyle}
              />
              {productData.mainImageUrlPreview && (
                <div className="mt-4">
                  <p className={labelStyle}>Main Image Preview:</p>
                  <div className="relative w-[150px] h-[150px]">
                    <Image
                      src={productData.mainImageUrlPreview}
                      alt="Main image preview"
                      fill
                      className="rounded-md object-contain border border-slate-300 dark:border-slate-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Gallery Images Input - NEW */}
            <div className="mt-6">
              <label htmlFor="additionalImages" className={labelStyle}>
                Additional Gallery Images (select multiple)
              </label>
              <input
                type="file"
                name="additionalImages"
                id="additionalImages"
                multiple // Allow multiple file selection
                accept="image/*"
                onChange={handleChange}
                className={fileInputStyle}
              />
              {productData.additionalImagesUrlPreviews.length > 0 && (
                <div className="mt-4">
                  <p className={labelStyle}>Additional Images Preview:</p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {productData.additionalImagesUrlPreviews.map(
                      (previewUrl, index) => (
                        <div
                          key={index}
                          className="relative w-[100px] h-[100px]"
                        >
                          <Image
                            src={previewUrl}
                            alt={`Additional image preview ${index + 1}`}
                            fill
                            className="rounded-md object-contain border border-slate-300 dark:border-slate-600"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {/* Status Section (same as before) */}
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

          {/* Progress Bar and Buttons (same as before) */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
              <div
                className="bg-brandAccent h-2.5 rounded-full transition-all duration-300 ease-out"
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
              {isSubmitting ? "Submitting..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

AddProductPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
