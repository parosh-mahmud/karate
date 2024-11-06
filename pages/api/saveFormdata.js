import { db } from "../../utils/firebase";
import { addDoc, collection } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { formData, uid } = req.body;

      // Ensure formData and uid are provided
      if (!formData || !uid) {
        return res.status(400).json({ error: "Missing form data or user ID" });
      }

      // Generate a unique studentId starting with "JK" followed by a random 6-digit number
      const studentId = `JK${Math.floor(100000 + Math.random() * 900000)}`;

      // Log the generated studentId and data
      console.log("Generated studentId:", studentId);
      console.log("Saving formData for user:", uid);

      // Data to be saved to Firestore
      const dataToSave = {
        ...formData,
        uid,
        studentId, // Ensure studentId is included here
        createdAt: new Date(),
      };

      console.log("Data being sent to Firestore:", dataToSave);

      // Save the data to Firestore with studentId
      const docRef = await addDoc(collection(db, "admissions"), dataToSave);

      // Confirm that Firestore write was successful
      console.log("Document written with ID:", docRef.id);

      // Return the success response with the generated studentId
      res.status(200).json({ success: true, studentId });
    } catch (error) {
      console.error("Error saving form data:", error);
      res.status(500).json({ error: "Failed to save form data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
