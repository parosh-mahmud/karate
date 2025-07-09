// pages/api/events/running_registrations/[id].js
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { id } = req.query; // Get the document ID from the URL

  // Only allow DELETE requests
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Create a reference to the specific document in the 'running_registrations' collection
    const docRef = doc(db, "running_registrations", id);

    // Delete the document from Firestore
    await deleteDoc(docRef);

    // Send a success response
    res.status(200).json({ message: "Registration deleted successfully." });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ error: "Failed to delete registration." });
  }
}
