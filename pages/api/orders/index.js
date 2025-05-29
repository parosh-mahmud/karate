import { db } from "@/lib/firebaseAdmin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const ordersRef = db.collection("orders");
      const q = ordersRef.orderBy("createdAt", "desc");
      const snapshot = await q.get();

      if (snapshot.empty) {
        return res.status(200).json([]);
      }

      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.().toISOString() ||
          new Date(0).toISOString(),
      }));

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // ...existing error handling...
    }
  } else if (req.method === "POST") {
    try {
      const orderDataFromClient = req.body;

      if (
        !orderDataFromClient.customerInfo ||
        !orderDataFromClient.items ||
        orderDataFromClient.items.length === 0 ||
        !orderDataFromClient.paymentDetails
      ) {
        return res.status(400).json({
          error: "Missing required order information.",
        });
      }

      const batch = db.batch();
      const newOrderRef = db.collection("orders").doc();

      const orderToSave = {
        ...orderDataFromClient,
        id: newOrderRef.id,
        orderStatus: orderDataFromClient.orderStatus || "Pending",
        createdAt: Timestamp.now(),
      };

      batch.set(newOrderRef, orderToSave);

      // Update product stock quantities
      for (const item of orderDataFromClient.items) {
        if (item.id && item.quantity > 0) {
          const productRef = db.collection("products").doc(item.id);
          const quantityToDecrement = Number(item.quantity);

          if (isNaN(quantityToDecrement)) {
            console.warn(`Invalid quantity for product ${item.id}`);
            continue;
          }

          batch.update(productRef, {
            stockQuantity: FieldValue.increment(-quantityToDecrement),
          });
        }
      }

      await batch.commit();

      return res.status(201).json({
        message: "Order placed successfully!",
        orderId: newOrderRef.id,
        order: orderToSave,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({
        error: "Failed to create order",
        details: error.message,
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({
    error: `Method ${req.method} Not Allowed`,
  });
}
