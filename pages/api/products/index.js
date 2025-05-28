import { firestoreAdmin, storageAdmin } from "../../../lib/firebaseAdmin";
import formidable from "formidable";
import fs from "fs";
import { Timestamp } from "firebase-admin/firestore";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadFileToStorage(file, productId, fileType = "gallery") {
  if (!file || !file.filepath || !file.originalFilename) {
    console.warn("Invalid file object received for upload:", file);
    return null;
  }

  const bucket = storageAdmin.bucket();
  const uniqueFilenamePrefix = Date.now();
  const safeOriginalFilename = file.originalFilename.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );
  const destinationPath = `products/${productId}/${fileType}/${uniqueFilenamePrefix}-${safeOriginalFilename}`;

  const fileUpload = bucket.file(destinationPath);
  const readStream = fs.createReadStream(file.filepath);

  return new Promise((resolve, reject) => {
    readStream
      .pipe(
        fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        })
      )
      .on("error", (error) => {
        console.error(`Error uploading ${file.originalFilename}:`, error);
        fs.unlink(file.filepath, () => {});
        reject(
          new Error(
            `Upload failed for ${file.originalFilename}: ${error.message}`
          )
        );
      })
      .on("finish", async () => {
        try {
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
          fs.unlink(file.filepath, () => {});
          resolve(publicUrl);
        } catch (error) {
          console.error(`Error finalizing ${file.originalFilename}:`, error);
          fs.unlink(file.filepath, () => {});
          reject(
            new Error(
              `Finalization failed for ${file.originalFilename}: ${error.message}`
            )
          );
        }
      });
  });
}

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  // Handle GET request
  if (req.method === "GET") {
    try {
      // Get products reference
      const productsRef = firestoreAdmin.collection("products");

      // Attempt to fetch products without filtering first
      const snapshot = await productsRef.orderBy("createdAt", "desc").get();

      const products = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Handle potential null/undefined timestamps
        const createdAt = data.createdAt?.toDate?.() || new Date();
        const updatedAt = data.updatedAt?.toDate?.() || createdAt;

        return {
          id: doc.id,
          ...data,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        };
      });

      return res.status(200).json(products);
    } catch (error) {
      console.error("Detailed error:", error);

      if (error.code === "FAILED_PRECONDITION") {
        return res.status(503).json({
          error: "Database setup required",
          message:
            "Database is being configured. Please try again in a few minutes.",
          indexRequired: true,
        });
      }

      return res.status(500).json({
        error: "Failed to fetch products",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  // Handle POST request
  if (req.method === "POST") {
    const form = formidable({ multiples: true, keepExtensions: true });

    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(new Error("Error parsing form data."));
          resolve({ fields, files });
        });
      });

      const getFieldValue = (fieldName) => {
        const value = fields[fieldName];
        return Array.isArray(value) ? value[0] : value;
      };

      // Process product data
      const productData = {
        name: getFieldValue("name") || "",
        shortDescription: getFieldValue("shortDescription") || "",
        detailedDescription: getFieldValue("detailedDescription") || "",
        sku: getFieldValue("sku") || "",
        price: parseFloat(getFieldValue("price")) || 0,
        salePrice: getFieldValue("salePrice")
          ? parseFloat(getFieldValue("salePrice"))
          : null,
        stockQuantity: parseInt(getFieldValue("stockQuantity"), 10) || 0,
        lowStockThreshold: getFieldValue("lowStockThreshold")
          ? parseInt(getFieldValue("lowStockThreshold"), 10)
          : null,
        category: getFieldValue("category") || "",
        tags: getFieldValue("tags")
          ? getFieldValue("tags")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        brand: getFieldValue("brand") || "",
        material: getFieldValue("material") || "",
        sizes: getFieldValue("sizes") ? JSON.parse(getFieldValue("sizes")) : [],
        colors: getFieldValue("colors")
          ? JSON.parse(getFieldValue("colors"))
          : [],
        weight: getFieldValue("weight")
          ? parseFloat(getFieldValue("weight"))
          : null,
        weightUnit: getFieldValue("weightUnit") || "oz",
        suitableFor: getFieldValue("suitableFor")
          ? JSON.parse(getFieldValue("suitableFor"))
          : [],
        safetyRating: getFieldValue("safetyRating") || "",
        isPublished: getFieldValue("isPublished") === "true",
        isFeatured: getFieldValue("isFeatured") === "true",
        mainImage: "",
        galleryImages: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Validate required fields
      if (
        !productData.name ||
        !productData.price ||
        !productData.category ||
        isNaN(productData.stockQuantity)
      ) {
        return res.status(400).json({
          error:
            "Missing required fields: Name, Price, Category, Stock Quantity.",
        });
      }

      // Create new product document
      const productRef = firestoreAdmin.collection("products").doc();
      productData.id = productRef.id;

      // Handle main image upload
      if (files.mainImage) {
        const mainImageFile = Array.isArray(files.mainImage)
          ? files.mainImage[0]
          : files.mainImage;
        if (mainImageFile?.size > 0) {
          productData.mainImage = await uploadFileToStorage(
            mainImageFile,
            productData.id,
            "main"
          );
        }
      }

      // Handle gallery images upload
      if (files.additionalImages) {
        const additionalImageFiles = Array.isArray(files.additionalImages)
          ? files.additionalImages
          : [files.additionalImages];

        for (const file of additionalImageFiles) {
          if (file?.size > 0) {
            const url = await uploadFileToStorage(
              file,
              productData.id,
              "gallery"
            );
            if (url) productData.galleryImages.push(url);
          }
        }
      }

      // Save to Firestore
      await productRef.set(productData);

      return res.status(201).json({
        message: "Product added successfully!",
        productId: productData.id,
        product: productData,
      });
    } catch (error) {
      console.error("Error in addProduct API handler:", error);
      return res.status(500).json({
        error: "Failed to add product.",
        details: error.message,
      });
    }
  }

  // Handle unsupported methods
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
