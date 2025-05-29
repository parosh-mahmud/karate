// pages/api/products/edit/[productId].js
import { firestoreAdmin, storageAdmin } from "../../../../lib/firebaseAdmin"; // Adjust path
import formidable from "formidable";
import fs from "fs";
import { Timestamp } from "firebase-admin/firestore";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

async function uploadFileToStorage(file, productId, fileType = "gallery") {
  if (!file || !file.filepath || !file.originalFilename || !file.mimetype) {
    console.warn("Invalid file object for upload (missing properties):", file);
    return null;
  }
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    console.warn(`Upload rejected (type): ${file.originalFilename}`);
    fs.unlink(file.filepath, () => {});
    return null;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    console.warn(`Upload rejected (size): ${file.originalFilename}`);
    fs.unlink(file.filepath, () => {});
    return null;
  }
  const bucket = storageAdmin.bucket();
  const uniqueFilenamePrefix = Date.now();
  const safeOriginalFilename = file.originalFilename
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
  if (!safeOriginalFilename) {
    console.warn("Empty filename after sanitization:", file.originalFilename);
    fs.unlink(file.filepath, () => {});
    return null;
  }
  const destinationPath = `products/${productId}/${fileType}/${uniqueFilenamePrefix}-${safeOriginalFilename}`;
  const fileUpload = bucket.file(destinationPath);
  const readStream = fs.createReadStream(file.filepath);
  return new Promise((resolve, reject) => {
    readStream
      .pipe(
        fileUpload.createWriteStream({
          metadata: { contentType: file.mimetype },
        })
      )
      .on("error", (err) => {
        console.error(`Upload stream error: ${file.originalFilename}`, err);
        fs.unlink(file.filepath, () => {});
        reject(err);
      })
      .on("finish", async () => {
        try {
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
          fs.unlink(file.filepath, () => {});
          resolve(publicUrl);
        } catch (err) {
          console.error(`Finalization error: ${file.originalFilename}`, err);
          fs.unlink(file.filepath, () => {});
          reject(err);
        }
      });
  });
}

async function deleteFileFromStorage(fileUrl) {
  if (!fileUrl || !fileUrl.startsWith("https://storage.googleapis.com/")) {
    console.log(
      "Not a Firebase Storage URL or no URL, skipping delete:",
      fileUrl
    );
    return;
  }
  try {
    const bucketName = storageAdmin.bucket().name;
    const pathStartIndex = `https://storage.googleapis.com/${bucketName}/`
      .length;
    const filePath = decodeURIComponent(
      fileUrl.substring(pathStartIndex).split("?")[0]
    ); // Decode URI component and remove query params like token

    if (!filePath) {
      console.warn("Could not extract file path from URL:", fileUrl);
      return;
    }

    const file = storageAdmin.bucket().file(filePath);
    await file.delete();
    console.log("Successfully deleted from storage:", fileUrl);
  } catch (error) {
    if (
      error.code === 404 ||
      (error.message && error.message.includes("No such object"))
    ) {
      console.warn("File not found in storage, skipping delete:", fileUrl);
    } else {
      console.error("Error deleting file from storage:", fileUrl, error);
    }
  }
}

export default async function handler(req, res) {
  const { productId } = req.query;

  if (!productId || typeof productId !== "string") {
    return res.status(400).json({ error: "Product ID is required." });
  }

  // --- TODO: Add Admin Authentication/Authorization Check here ---

  if (req.method === "PUT") {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE_BYTES,
    });

    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, formFields, formFiles) => {
          if (err) {
            if (err.code === 1009)
              return reject(
                new Error(
                  `File size limit exceeded. Max ${MAX_FILE_SIZE_MB}MB.`
                )
              );
            return reject(new Error("Error parsing form data."));
          }
          resolve({ fields: formFields, files: formFiles });
        });
      });

      const getFieldValue = (fieldName) =>
        Array.isArray(fields[fieldName])
          ? fields[fieldName][0]
          : fields[fieldName];

      const productDocRef = firestoreAdmin
        .collection("products")
        .doc(productId);
      const currentProductSnap = await productDocRef.get();

      // CORRECTED LINE: Use .exists (property) instead of .exists() (method)
      if (!currentProductSnap.exists) {
        return res.status(404).json({ error: "Product not found to update." });
      }
      const currentProductData = currentProductSnap.data();

      const updatedProductFields = {
        name: getFieldValue("name")?.trim() || currentProductData.name,
        shortDescription:
          getFieldValue("shortDescription")?.trim() ||
          currentProductData.shortDescription,
        detailedDescription:
          getFieldValue("detailedDescription") ||
          currentProductData.detailedDescription,
        sku: getFieldValue("sku")?.trim() || currentProductData.sku,
        price: parseFloat(getFieldValue("price")) || currentProductData.price,
        salePrice: getFieldValue("salePrice")
          ? parseFloat(getFieldValue("salePrice"))
          : currentProductData.salePrice === undefined
          ? null
          : currentProductData.salePrice,
        stockQuantity: parseInt(getFieldValue("stockQuantity"), 10), // Should always get a number or NaN
        lowStockThreshold: getFieldValue("lowStockThreshold")
          ? parseInt(getFieldValue("lowStockThreshold"), 10)
          : currentProductData.lowStockThreshold === undefined
          ? null
          : currentProductData.lowStockThreshold,
        category: getFieldValue("category") || currentProductData.category,
        tags: getFieldValue("tags")
          ? getFieldValue("tags")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : currentProductData.tags,
        brand: getFieldValue("brand")?.trim() || currentProductData.brand,
        material:
          getFieldValue("material")?.trim() || currentProductData.material,
        sizes: getFieldValue("sizes")
          ? JSON.parse(getFieldValue("sizes"))
          : currentProductData.sizes,
        colors: getFieldValue("colors")
          ? JSON.parse(getFieldValue("colors"))
          : currentProductData.colors,
        weight: getFieldValue("weight")
          ? parseFloat(getFieldValue("weight"))
          : currentProductData.weight,
        weightUnit:
          getFieldValue("weightUnit") || currentProductData.weightUnit,
        suitableFor: getFieldValue("suitableFor")
          ? JSON.parse(getFieldValue("suitableFor"))
          : currentProductData.suitableFor,
        safetyRating:
          getFieldValue("safetyRating")?.trim() ||
          currentProductData.safetyRating,
        isPublished: getFieldValue("isPublished") === "true",
        isFeatured: getFieldValue("isFeatured") === "true",
        updatedAt: Timestamp.now(),
      };
      // Ensure stockQuantity is a number, default to current if parsing fails but was valid
      if (isNaN(updatedProductFields.stockQuantity)) {
        updatedProductFields.stockQuantity = currentProductData.stockQuantity;
      }

      // Main Image Handling
      const existingMainImageUrlFromClient = getFieldValue(
        "existingMainImageUrl"
      );
      updatedProductFields.mainImage = currentProductData.mainImage || ""; // Default to existing or empty

      if (files.mainImageFile) {
        const mainImageFile = Array.isArray(files.mainImageFile)
          ? files.mainImageFile[0]
          : files.mainImageFile;
        if (mainImageFile && mainImageFile.size > 0) {
          const newMainUrl = await uploadFileToStorage(
            mainImageFile,
            productId,
            "main"
          );
          if (newMainUrl) {
            if (
              currentProductData.mainImage &&
              currentProductData.mainImage !== newMainUrl
            ) {
              await deleteFileFromStorage(currentProductData.mainImage);
            }
            updatedProductFields.mainImage = newMainUrl;
          } else {
            console.warn(
              "New main image upload failed validation or error, keeping existing if any."
            );
          }
        }
      } else if (
        existingMainImageUrlFromClient === "" &&
        currentProductData.mainImage
      ) {
        await deleteFileFromStorage(currentProductData.mainImage);
        updatedProductFields.mainImage = "";
      }

      // Gallery Images Handling
      const keptGalleryImageUrls = getFieldValue("keptGalleryImageUrls")
        ? JSON.parse(getFieldValue("keptGalleryImageUrls"))
        : [];
      const newlyUploadedGalleryUrls = [];

      if (files.newAdditionalImages) {
        const additionalImageFiles = Array.isArray(files.newAdditionalImages)
          ? files.newAdditionalImages
          : [files.newAdditionalImages];
        for (const file of additionalImageFiles) {
          if (file && file.size > 0) {
            const url = await uploadFileToStorage(file, productId, "gallery");
            if (url) newlyUploadedGalleryUrls.push(url);
            else
              console.warn(
                "A new gallery image upload failed validation or error."
              );
          }
        }
      }

      const oldGalleryImages = currentProductData.galleryImages || [];
      for (const oldUrl of oldGalleryImages) {
        if (!keptGalleryImageUrls.includes(oldUrl)) {
          await deleteFileFromStorage(oldUrl);
        }
      }
      updatedProductFields.galleryImages = [
        ...keptGalleryImageUrls,
        ...newlyUploadedGalleryUrls,
      ];

      await productDocRef.update(updatedProductFields);

      return res.status(200).json({
        message: "Product updated successfully!",
        productId: productId,
        product: { id: productId, ...updatedProductFields },
      });
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      if (error.message.includes("File size limit exceeded")) {
        return res
          .status(413)
          .json({ error: "Upload error", details: error.message });
      }
      return res
        .status(500)
        .json({ error: "Failed to update product.", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
