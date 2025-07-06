import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp, // Use server-side timestamp for consistency
  query,
  orderBy,
} from "firebase/firestore";

export default async function handler(req, res) {
  // Use a switch statement to handle different HTTP methods
  switch (req.method) {
    /**
     * HANDLE GET REQUESTS
     * Fetches all blog posts from the 'blogs' collection, ordered by creation date.
     */
    case "GET":
      try {
        // Create a query to order blogs by createdAt in descending order (newest first)
        const blogsQuery = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(blogsQuery);

        // Map over the documents and format them for the response
        const blogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamps to serializable ISO strings for the API response
          createdAt: doc.data().createdAt?.toDate().toISOString() || null,
          updatedAt: doc.data().updatedAt?.toDate().toISOString() || null,
        }));

        res.status(200).json(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ error: "Unable to fetch blog posts" });
      }
      break;

    /**
     * HANDLE POST REQUESTS
     * Creates a new blog post in the 'blogs' collection.
     */
    case "POST":
      try {
        const { title, description, content, author, image } = req.body;

        // Validate required fields
        if (!title || !description || !content || !author) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        // Add the new blog post to Firestore
        const docRef = await addDoc(collection(db, "blogs"), {
          title,
          description,
          content,
          author,
          image: image || null, // Use null instead of an empty string for clarity
          createdAt: serverTimestamp(), // Recommended: Let Firestore handle the timestamp
          updatedAt: serverTimestamp(),
          views: 0,
          likes: 0,
          comments: [],
        });

        res.status(201).json({
          id: docRef.id,
          message: "Blog post created successfully",
        });
      } catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({ error: "Failed to create blog post" });
      }
      break;

    /**
     * HANDLE OTHER METHODS
     * If the request method is not GET or POST, return a "Method Not Allowed" error.
     */
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
