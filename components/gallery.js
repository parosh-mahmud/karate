import React from "react";

const ImageGallery = () => {
  // Add your Cloudinary image URLs here
  const imageUrls = [
    "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612208/IMG_9702_dcho01.jpg",
    "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612207/IMG_9749_eybfru.jpg",
    "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612204/IMG_9690_thx3jf.jpg",
    "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612200/IMG_9706_leal4a.jpg",
    "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612200/IMG_20221222_003514_221_acgg9h.jpg",
    "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612198/IMG_9709_yk3bjm.jpg",
    "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612191/IMG_9655_ppnd4j.jpg",
    "https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612183/IMG_8698_r2dwjg.jpg",
  ];

  return (
    <div className="mx-auto mt-5">
      <h2 className="text-3xl font-bold text-center mb-6">Images Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative">
            <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg shadow-lg">
              <img
                src={url}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform transform hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
