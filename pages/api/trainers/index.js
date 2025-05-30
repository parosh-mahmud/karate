// pages/api/trainers/index.js
import { db } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, specialization, bio, photoUrl } = req.body;

      // Basic validation (you can add more robust validation here)
      if (!name || !specialization || !bio || !photoUrl) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // Add the new trainer to the 'trainers' collection in Firestore
      const docRef = await addDoc(collection(db, "trainers"), {
        name,
        specialization,
        bio,
        photoUrl,
        createdAt: serverTimestamp(), // Add a timestamp for when the trainer was created
      });

      res
        .status(201)
        .json({ id: docRef.id, message: "Trainer added successfully!" });
    } catch (error) {
      console.error("Error adding trainer:", error);
      res
        .status(500)
        .json({ error: "Failed to add trainer. Please try again." });
    }
  } else {
    // Handle any other HTTP methods (e.g., GET for fetching all trainers)
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
