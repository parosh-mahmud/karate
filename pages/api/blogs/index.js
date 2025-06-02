//api/blogs/index.js
import { db } from "@/utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, description, content, author, image } = req.body;

    // Validate required fields
    if (!title || !description || !content || !author) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create blog post in Firestore
    const blogRef = await addDoc(collection(db, "blogs"), {
      title,
      description,
      content,
      author,
      image: image || "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      views: 0,
      likes: 0,
      comments: [],
    });

    return res.status(201).json({
      id: blogRef.id,
      message: "Blog post created successfully",
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({ error: "Failed to create blog post" });
  }
}
