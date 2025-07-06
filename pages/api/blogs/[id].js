// pages/api/blogs/[id].js
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default async function handler(req, res) {
  const { id } = req.query; // Get the blog ID from the URL (e.g., /api/blogs/some-id)
  const docRef = doc(db, "blogs", id);

  switch (req.method) {
    // This will be used by your future "Edit" page to get initial data
    case "GET":
      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(200).json({ id: docSnap.id, ...docSnap.data() });
      } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ error: "Failed to fetch blog post" });
      }
      break;

    // This will be used by your future "Edit" page to save changes
    case "PUT":
      try {
        const updatedData = req.body;
        await updateDoc(docRef, updatedData);
        res.status(200).json({ message: "Blog post updated successfully" });
      } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Failed to update blog post" });
      }
      break;

    case "DELETE":
      try {
        await deleteDoc(docRef);
        res.status(200).json({ message: "Blog post deleted successfully" });
      } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Failed to delete blog post" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
