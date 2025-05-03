// import React from "react";

// const ImageGallery = () => {
//   // Add your Cloudinary image URLs here
//   const imageUrls = [
//     "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612208/IMG_9702_dcho01.jpg",
//     "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612207/IMG_9749_eybfru.jpg",
//     "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612204/IMG_9690_thx3jf.jpg",
//     "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612200/IMG_9706_leal4a.jpg",
//     "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612200/IMG_20221222_003514_221_acgg9h.jpg",
//     "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612198/IMG_9709_yk3bjm.jpg",
//     "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612191/IMG_9655_ppnd4j.jpg",
//     "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612183/IMG_8698_r2dwjg.jpg",
//   ];

//   return (
//     <div className="mx-auto mt-5">
//       <h2 className="text-3xl font-bold text-center mb-6">Images Gallery</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
//         {imageUrls.map((url, index) => (
//           <div key={index} className="relative">
//             <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg shadow-lg">
//               <img
//                 src={url}
//                 alt={`Gallery Image ${index + 1}`}
//                 className="w-full h-full object-cover transition-transform transform hover:scale-110"
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageGallery;

// components/gallery.js (or wherever ImageGallery is defined)
import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase"; // Adjust path if necessary
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageUrls = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const galleryCollectionRef = collection(db, "galleryImages");
        // Fetch images ordered by upload time (newest first)
        const q = query(galleryCollectionRef, orderBy("uploadedAt", "desc"));
        const querySnapshot = await getDocs(q);

        const urls = querySnapshot.docs.map((doc) => doc.data().url);
        setImageUrls(urls);
      } catch (err) {
        console.error("Error fetching image URLs:", err);
        setError("Could not load gallery images.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageUrls();
  }, []); // Fetch once on component mount

  return (
    <div className="mx-auto mt-5">
      <h2 className="text-3xl font-bold text-center mb-6">Images Gallery</h2>

      {isLoading && <p className="text-center">Loading gallery...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && imageUrls.length === 0 && !error && (
        <p className="text-center">The gallery is currently empty.</p>
      )}

      {!isLoading && imageUrls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              {" "}
              {/* Added group class for potential future hover effects */}
              {/* Consider using Tailwind aspect-ratio plugin if not already */}
              {/* Simplified aspect ratio handling for broader compatibility */}
              <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-lg">
                {" "}
                {/* Explicit aspect ratio */}
                <img
                  src={url}
                  alt={`Gallery Image ${index + 1}`}
                  // Loading lazy helps with performance on pages with many images
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110" // Added group-hover
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
