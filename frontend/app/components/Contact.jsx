// frontend/app/components/Contact.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { michroma } from "../../lib/fonts";
import { contactAPI } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Clear form if no user is logged in
  useEffect(() => {
    if (!user) {
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear status when user starts typing
    if (status.type) setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const dataToSend = {
        ...formData,
        userId: user?._id || null,
      };

      const response = await contactAPI.submitContact(dataToSend);

      if (response.success) {
        setStatus({
          type: "success",
          message: "Thank you for your message! We'll get back to you soon.",
        });
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        type: "error",
        message:
          error.message ||
          "There was an error sending your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      title: "Visit Us",
      details: ["123 Galle Road, Colombo 03", "Sri Lanka"],
      link: "#",
    },
    {
      title: "Call Us",
      details: ["+94 11 234 5678", "+94 11 234 5679"],
      link: "tel:+94112345678",
    },
    {
      title: "Email Us",
      details: ["info@diamondcrown.lk", "reservations@diamondcrown.lk"],
      link: "mailto:info@diamondcrown.lk",
    },
    {
      title: "Opening Hours",
      details: ["24/7 Reception", "Restaurant: 6:00 AM - 11:00 PM"],
      link: "#",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div id="contact" className="relative min-h-screen bg-white py-20">
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
            CONTACT US
          </h2>
          <div className="w-24 h-1 bg-[#ddd92a] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us. We're here to make your stay unforgettable.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3
              className={`${michroma.className} text-2xl font-bold text-[#2d2a32] mb-8`}
            >
              Get in Touch
            </h3>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#ddd92a] transition-colors duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm mb-1">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map Section */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-100 rounded-xl p-6 border border-gray-200"
            >
              <h4
                className={`${michroma.className} text-xl font-bold text-[#2d2a32] mb-4`}
              >
                Our Location
              </h4>
              <div className="h-48 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  marginHeight="0"
                  marginWidth="0"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=102.497157%2C12.928375%2C102.501369%2C12.930629&layer=mapnik&marker=12.929502%2C102.499263"
                  className="border-0"
                />
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Diamond Crown Hotel - Your Location Address Here
              </p>

              <p className="text-xs text-gray-400 mt-1 italic">
                Note: The location shown on the map is a fake location used for
                dummy data purposes.
              </p>
              
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3
              className={`${michroma.className} text-2xl font-bold text-[#2d2a32] mb-6`}
            >
              Send us a Message
            </h3>

            {/* Status Message */}
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 ${
                  status.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {status.message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddd92a] focus:border-transparent transition-colors"
                    placeholder="Your full name"
                    disabled
                  />
                  {user && formData.name === user.name && (
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      Auto-filled from your profile
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddd92a] focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                    disabled
                  />
                  {user && formData.email === user.email && (
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      Auto-filled from your profile
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddd92a] focus:border-transparent resize-none transition-colors"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#ddd92a] text-[#2d2a32] py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#eae151] hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#2d2a32]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>

              {!user && (
                <p className="text-center text-sm text-gray-500">
                  Want faster service?{" "}
                  <a
                    href="/login"
                    className="text-[#ddd92a] hover:text-[#c9c426] font-semibold transition-colors"
                  >
                    Login
                  </a>{" "}
                  to auto-fill your details.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
