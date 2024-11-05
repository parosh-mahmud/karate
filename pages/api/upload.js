import cloudinary from "../../utils/cloudinary";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { image } = req.body;

      // Ensure that `image` is provided
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: "profilePictures", // Optional: specify a folder
      });

      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Cloudinary upload error:", error); // Log the error
      res.status(500).json({ error: "Failed to upload image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
