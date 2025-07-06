// pages/api/blogs.js
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const blogsQuery = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(blogsQuery);
        const blogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert timestamp to a serializable format
          createdAt: doc.data().createdAt?.toDate().toISOString() || null,
        }));
        res.status(200).json(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Unable to fetch blog posts" });
      }
      break;

    case "POST":
      try {
        const { title, description, content, author, image } = req.body;

        // Basic validation
        if (!title || !content || !author) {
          return res
            .status(400)
            .json({ error: "Title, content, and author are required." });
        }

        const newBlog = {
          title,
          description: description || "",
          content,
          author,
          image: image || null,
          createdAt: serverTimestamp(), // Use Firestore's server-side timestamp
        };

        const docRef = await addDoc(collection(db, "blogs"), newBlog);
        res.status(201).json({ id: docRef.id, ...newBlog });
      } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ error: "Unable to create blog post" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
