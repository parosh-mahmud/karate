// pages/gallary/index.js
import React, { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Image from "next/image";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const galleryRef = collection(db, "galleryImages");
        const q = query(galleryRef, orderBy("uploadedAt", "desc"));
        const snapshot = await getDocs(q);
        const imgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          url: doc.data().url,
        }));
        setImages(imgs);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <main className="bg-brandBackground min-h-screen p-8 font-body">
      <h1 className="text-4xl font-header text-brandTextPrimary mb-6">
        Gallery
      </h1>
      {loading ? (
        <p className="text-brandTextSecondary">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="text-brandTextSecondary italic">No images available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-md"
            >
              <Image
                src={image.url}
                alt="Gallery image"
                layout="responsive"
                width={1}
                height={1}
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
