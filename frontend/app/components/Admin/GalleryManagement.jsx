//

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { inter, michroma } from "../../../lib/fonts";
import { adminAPI } from "../../../lib/adminAPI";

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getGalleryImages();
      setImages(response.images || []);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      alert("Please fill all fields");
      return;
    }

    try {
      setUploading(true);
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("image", formData.image);

      await adminAPI.createGalleryImage(submitData);

      setFormData({ title: "", image: null });
      document.getElementById("image-input").value = "";
      fetchGalleryImages();

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await adminAPI.deleteGalleryImage(id);
      fetchGalleryImages();
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-[#ddd92a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-[#2d2a32]/10 p-6"
      >
        <h3
          className={`${michroma.className} text-xl font-bold text-[#2d2a32] mb-4`}
        >
          Add New Gallery Image
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`${inter.className} block text-sm font-medium text-[#2d2a32] mb-2`}
            >
              Image Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#2d2a32]/20 rounded-lg focus:ring-2 focus:ring-[#ddd92a] focus:border-transparent"
              placeholder="Enter image title"
              required
            />
          </div>

          <div>
            <label
              className={`${inter.className} block text-sm font-medium text-[#2d2a32] mb-2`}
            >
              Select Image
            </label>
            <input
              id="image-input"
              type="file"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
              className="w-full px-4 py-2 border border-[#2d2a32]/20 rounded-lg focus:ring-2 focus:ring-[#ddd92a] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-[#ddd92a] text-[#2d2a32] px-6 py-2 rounded-lg font-semibold hover:bg-[#eae151] transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </motion.div>

      {/* Gallery Images List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-[#2d2a32]/10 p-6"
      >
        <h3
          className={`${michroma.className} text-xl font-bold text-[#2d2a32] mb-6`}
        >
          Gallery Images ({images.length})
        </h3>

        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No images in gallery yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={image._id}
                className="border border-[#2d2a32]/10 rounded-lg overflow-hidden"
              >
                <div className="bg-[#f9f9f9] border-b border-[#2d2a32]/10">
                  <div className="text-center p-4">
                    <div className="text-lg font-semibold text-gray-700 mb-2">
                      {image.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      Image {index + 1}
                    </div>
                    {/* display image */}
                    <img
                      src={image.image}
                      alt={image.title}
                      className="mt-2 max-h-64 object-contain mx-auto"
                      onError={(e) => {
                        console.log(
                          "Gallery image failed to load:",
                          image.image
                        );
                        e.target.src = "/images/default-room.png";
                      }}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GalleryManagement;
