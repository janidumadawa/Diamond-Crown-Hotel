"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { michroma } from "../../lib/fonts";


const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch gallery images from backend
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/gallery");
      const data = await response.json();
      if (data.success) {
        setGalleryImages(data.images || []);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Duplicate images multiple times for longer seamless loop
  const duplicatedImages = [
    ...galleryImages,
    ...galleryImages,
    ...galleryImages,
    ...galleryImages,
  ];

  return (
    <div id="gallery" className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className={`${michroma.className} text-4xl md:text-6xl font-bold text-[#2d2a32] mb-6`}
          >
            GALLERY
          </h2>
          <p className="text-[#2d2a32]/80 font-[inter] max-w-2xl mx-auto">
            Explore the beauty and elegance of our hotel through our curated
            gallery. Each image captures the essence of luxury and comfort that
            defines your stay with us.
          </p>
        </motion.div>

        {/* Carousel Section */}
        {galleryImages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="w-full overflow-hidden py-8">
              <div
                className="slider-track"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              >
                <div className="slider-content">
                  {duplicatedImages.map((image, index) => (
                    <div
                      key={`${image._id}-${index}`}
                      className="slider-item"
                      onClick={() => openModal(image)}
                    >
                      <div className="image-wrapper">
                        <img
                          src={
                            image.image && (image.image.startsWith("http") || image.image.startsWith("//"))
                              ? image.image
                              : `http://localhost:5000/uploads/${image.image}`
                          }
                          alt={image.title}
                          className="slider-image"
                          onError={(e) => {
                            console.log("Image failed to load:", image.image);
                            e.target.style.backgroundColor = "#f3f4f6";
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CSS Styles */}
            <style jsx>{`
              .slider-track {
                display: flex;
                animation: slide 40s linear infinite;
              }

              .slider-content {
                display: flex;
                gap: 1.5rem;
              }

              .slider-item {
                flex-shrink: 0;
                width: 500px;
                height: 350px;
                cursor: pointer;
                transition: all 0.3s ease;
              }

              .slider-item:hover {
                transform: scale(1.08);
                z-index: 10;
              }

              .image-wrapper {
                width: 100%;
                height: 100%;
              }

              .slider-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
                transition: all 0.3s ease;
              }

              .slider-item:hover .slider-image {
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
              }

              @keyframes slide {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(
                    calc(
                      -500px * ${galleryImages.length} - 1.5rem * ${galleryImages.length}
                    )
                  );
                }
              }

              /* Responsive styles */
              @media (max-width: 768px) {
                .slider-item {
                  width: 500px;
                  height: 350px;
                }

                @keyframes slide {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(
                      calc(
                        -500px * ${galleryImages.length} - 1.5rem * ${galleryImages.length}
                      )
                    );
                  }
                }
              }

              @media (max-width: 640px) {
                .slider-item {
                  width: 500px;
                  height: 350px;
                }

                .slider-content {
                  gap: 1rem;
                }

                @keyframes slide {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(
                      calc(
                        -500px * ${galleryImages.length} - 1rem * ${galleryImages.length}
                      )
                    );
                  }
                }
              }
            `}</style>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Images Available
              </h3>
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg overflow-hidden max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={
                  selectedImage.image && (selectedImage.image.startsWith("http") || selectedImage.image.startsWith("//"))
                    ? selectedImage.image
                    : `http://localhost:5000/uploads/${selectedImage.image}`
                }
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-all"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;
