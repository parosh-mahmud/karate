// pages/api/products/[id].js
import { firestoreAdmin } from "../../../lib/firebaseAdmin";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ error: "Product ID is required and must be a string." });
  }

  if (req.method === "GET") {
    try {
      const productDocRef = firestoreAdmin.collection("products").doc(id);
      const docSnap = await productDocRef.get();

      // Fixed: Use exists property instead of exists()
      if (!docSnap.exists) {
        return res.status(404).json({ error: "Product not found." });
      }

      const productData = docSnap.data();

      // Handle timestamps
      const createdAt = productData.createdAt?.toDate?.() || new Date(0);
      const updatedAt = productData.updatedAt?.toDate?.() || createdAt;

      return res.status(200).json({
        id: docSnap.id,
        ...productData,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      });
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return res.status(500).json({
        error: "Failed to fetch product.",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
