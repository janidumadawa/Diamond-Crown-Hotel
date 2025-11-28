"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { michroma } from "../../lib/fonts";
import { amenitiesAPI } from "../../lib/api";

const Amenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const backgroundImage = "./images/Amenities-bg.jpg";

    // Base URL for images
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            setLoading(true);
            const response = await amenitiesAPI.getAmenities();
            console.log('Amenities data:', response);
            
            // Ensure images have full URLs
            const amenitiesWithFullUrls = response.amenities?.map(amenity => ({
                ...amenity,
                image: amenity.image.startsWith('http') 
                    ? amenity.image 
                    : `${API_BASE_URL}${amenity.image}`
            })) || [];
            
            setAmenities(amenitiesWithFullUrls);
        } catch (err) {
            setError("Failed to load amenities");
            console.error("Error fetching amenities:", err);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    };

    if (loading) {
        return (
            <div id="amenities" className="relative py-20 min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center lg:bg-fixed bg-no-repeat z-0" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 to-transparent backdrop-blur-[1px]"></div>
                </div>
                <div className="relative z-10 text-center">
                    <div className="w-8 h-8 border-4 border-[#ddd92a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Loading amenities...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div id="amenities" className="relative py-20 min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center lg:bg-fixed bg-no-repeat z-0" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 to-transparent backdrop-blur-[1px]"></div>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button 
                        onClick={fetchAmenities}
                        className="px-6 py-2 bg-[#ddd92a] text-[#2d2a32] rounded font-semibold hover:bg-yellow-400 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!amenities || amenities.length === 0) {
        return (
            <div id="amenities" className="relative py-20 min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center lg:bg-fixed bg-no-repeat z-0" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/90 to-transparent backdrop-blur-[1px]"></div>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-white">No amenities available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div id="amenities" className="relative py-20 min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center lg:bg-fixed bg-no-repeat z-0" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="absolute inset-0 bg-gradient-to-l from-black/90 to-transparent backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Header Section */}            
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`${michroma.className} text-4xl md:text-5xl font-bold text-[#fafdf6] mb-4`}>
                        AMENITIES & SERVICES
                    </h2>
                    <div className="w-24 h-1 bg-[#ddd92a] mx-auto mb-6"></div>
                    <p className="font-inter text-lg text-[#fafdf6]/80 max-w-2xl mx-auto">
                        Experience unparalleled comfort with our comprehensive range of premium amenities 
                        designed to make your stay truly exceptional
                    </p>
                </motion.div>

                {/* Amenities Grid */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {amenities.map((amenity) => (
                        <motion.div
                            key={amenity._id}
                            className="bg-[#2d2a32a2] rounded-3xl overflow-hidden border border-[#ddd92a]/20 hover:border-[#ddd92a]/40 transition-all duration-300 hover:transform hover:scale-105"
                            variants={itemVariants}
                        >
                            {/* Image Section */}
                            <div className="h-48 relative">
                                <img 
                                    src={amenity.image} 
                                    alt={amenity.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error('Image failed to load:', amenity.image);
                                        // Use a placeholder image
                                        e.target.src = '/images/placeholder-amenity.jpg';
                                        e.target.className = 'w-full h-full object-cover bg-gray-200';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className={`${michroma.className} text-xl font-bold text-[#fafdf6] mb-3`}>
                                        {amenity.title}
                                    </h3>
                                    <p className="font-inter text-sm text-[#fafdf6]/70 leading-relaxed">
                                        {amenity.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Amenities;