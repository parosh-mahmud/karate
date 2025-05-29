// // pages/api/orders/[orderId].js
// import { firestoreAdmin } from "@/lib/firebaseAdmin"; // Adjust path

// export default async function handler(req, res) {
//   const { orderId } = req.query;

//   if (!orderId || typeof orderId !== "string") {
//     return res.status(400).json({ error: "Order ID is required." });
//   }

//   // --- TODO: Add Authentication/Authorization Check ---
//   // For example, check if the logged-in user owns this order, or if it's an admin.

//   if (req.method === "GET") {
//     try {
//       const orderDocRef = firestoreAdmin.collection("orders").doc(orderId);
//       const docSnap = await orderDocRef.get();

//       if (!docSnap.exists()) {
//         return res.status(404).json({ error: "Order not found." });
//       }

//       const orderData = docSnap.data();
//       const createdAt = orderData.createdAt?.toDate?.() || new Date(0);
//       // Add any other timestamp conversions needed

//       return res.status(200).json({
//         id: docSnap.id,
//         ...orderData,
//         createdAt: createdAt.toISOString(),
//       });
//     } catch (error) {
//       console.error(`Error fetching order ${orderId}:`, error);
//       return res.status(500).json({
//         error: "Failed to fetch order details.",
//         details: error.message,
//       });
//     }
//   } else {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
//   }
// }

import { firestoreAdmin } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export default async function handler(req, res) {
  const { orderId } = req.query;

  if (!orderId || typeof orderId !== "string") {
    return res.status(400).json({ error: "Order ID is required." });
  }

  // --- TODO: Add Authentication/Authorization Check ---

  if (req.method === "GET") {
    // ...existing GET method code...
  } else if (req.method === "PATCH") {
    try {
      const { status, note } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const orderRef = firestoreAdmin.collection("orders").doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        return res.status(404).json({ error: "Order not found" });
      }

      const currentData = orderDoc.data();
      const now = Timestamp.now();

      const updateData = {
        "status.current": status,
        "status.lastUpdated": now,
        updatedAt: now,
        "status.statusHistory": [
          ...(currentData.status?.statusHistory || []),
          {
            status,
            timestamp: now,
            note: note || `Status updated to ${status}`,
          },
        ],
      };

      await orderRef.update(updateData);

      return res.status(200).json({
        message: "Order status updated successfully",
        orderId,
        newStatus: status,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({
        error: "Failed to update order status",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
