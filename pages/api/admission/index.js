import { db, collection, addDoc } from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { formData, uid } = req.body;

      // Validate required fields
      if (
        !formData.fullName ||
        !formData.fatherName ||
        !formData.motherName ||
        !formData.presentAddress ||
        !formData.permanentAddress ||
        !formData.mobile ||
        !formData.email ||
        !formData.dateOfBirth ||
        !formData.gender ||
        !formData.profession ||
        !formData.bloodGroup ||
        !formData.nationality ||
        !formData.nid ||
        !formData.birthCertificate ||
        !formData.religion ||
        !formData.paymentMethod ||
        !formData.transactionId
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      // Add the form data to Firestore
      const docRef = await addDoc(collection(db, "admissions"), {
        ...formData,
        uid: uid,
        timestamp: new Date(),
      });

      return res.status(200).json({
        success: true,
        message: "Form data saved successfully!",
        id: docRef.id,
      });
    } catch (error) {
      console.error("Error saving form data:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to save form data. Please try again.",
      });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
