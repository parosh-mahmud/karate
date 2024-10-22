import cloudinary from "..//..//utils/cloudinary";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const fileStr = req.body.data; // this expects base64 encoded image
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "your-upload-preset", // Optional: Create and use an upload preset
      });
      res.status(200).json({ url: uploadedResponse.secure_url });
    } catch (error) {
      console.error("Error uploading to Cloudinary", error);
      res.status(500).json({ error: "Upload failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
