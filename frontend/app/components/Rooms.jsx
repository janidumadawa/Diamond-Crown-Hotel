"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { inter, michroma, playwrite } from "../../lib/fonts";
import Link from "next/link";
import { roomsAPI } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import BookingModal from "./Booking/BookingModal";

const Rooms = () => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomsAPI.getRooms();
      setRooms(response.rooms);
    } catch (error) {
      setError("Failed to load rooms. Please try again.");
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter to show only 4 rooms
  const displayedRooms = rooms.slice(0, 4);

  // FIX: Update navigation functions to use displayedRooms
  const nextRoom = () => {
    setCurrentRoom((prev) => (prev + 1) % displayedRooms.length);
  };

  const prevRoom = () => {
    setCurrentRoom((prev) => (prev - 1 + displayedRooms.length) % displayedRooms.length);
  };

  const handleBookNow = (room) => {
    if (!isAuthenticated) {
      document.querySelector("nav button")?.click();
      return;
    }
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
    if (window.confirm("Booking confirmed! Would you like to view your bookings?")) {
      window.location.href = "/my-bookings";
    }
  };

  if (loading) {
    return (
      <div
        id="rooms"
        className="py-16 md:py-24 bg-[#fafdf6] min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#ddd92a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${inter.className} text-[#2d2a32]/60`}>
            Loading rooms...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        id="rooms"
        className="py-16 md:py-24 bg-[#fafdf6] min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <p className={`${inter.className} text-red-600 mb-4`}>{error}</p>
          <button
            onClick={fetchRooms}
            className={`${michroma.className} px-6 py-2 bg-[#2d2a32] text-[#fafdf6] rounded hover:bg-[#ddd92a] hover:text-[#2d2a32] transition-colors`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // FIX: Check displayedRooms instead of rooms
  if (!displayedRooms || displayedRooms.length === 0) {
    return (
      <div
        id="rooms"
        className="py-16 md:py-24 bg-[#fafdf6] min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <p className={`${inter.className} text-[#2d2a32]/60`}>
            No rooms available at the moment.
          </p>
        </div>
      </div>
    );
  }

  const currentRoomData = displayedRooms[currentRoom];

  return (
    <div
      id="rooms"
      className="py-16 md:py-24 bg-[#fafdf6] min-h-screen flex items-center"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Minimal Header */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2
            className={`${michroma.className} text-2xl md:text-4xl font-light text-[#2d2a32] mb-3 tracking-wide`}
          >
            ACCOMMODATIONS
          </h2>
          <div className="w-16 h-0.5 bg-[#ddd92a] mx-auto mb-4"></div>
          <p
            className={`${inter.className} text-sm md:text-base text-[#2d2a32]/60 max-w-2xl mx-auto`}
          >
            Ocean and city views from every room
          </p>
        </motion.div>

        {/* Room Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center"
            >
              {/* Room Image - Clean Layout */}
              <div className="relative w-full lg:w-1/2 h-72 md:h-96 lg:h-[500px] rounded-lg overflow-hidden">
                <img
                  src={currentRoomData.images?.[0] || '/images/default-room.jpg'}
                  alt={currentRoomData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/default-room.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Minimal Room Indicator */}
                <div className="absolute bottom-4 left-4">
                  <div className={`${michroma.className} text-white text-sm font-medium`}>
                    {currentRoom + 1}/{displayedRooms.length}
                  </div>
                </div>
              </div>

              {/* Room Details - Minimalist */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <div
                    className={`${inter.className} text-[#ddd92a] text-sm font-light mb-1 tracking-wide`}
                  >
                    {currentRoomData.type}
                  </div>
                  <h2
                    className={`${michroma.className} text-2xl md:text-3xl font-normal text-[#2d2a32] mb-3 leading-tight`}
                  >
                    {currentRoomData.name}
                  </h2>
                  <p className="text-[#2d2a32]/70 text-sm leading-relaxed">
                    {currentRoomData.description}
                  </p>
                </div>

                {/* Clean Specifications */}
                <div className="flex items-center space-x-6 text-[#2d2a32] text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">{currentRoomData.size}</span>
                    <span className="font-bold">sq ft</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span></span>
                    <span className="font-bold">
                      {currentRoomData.capacity} Beds
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span></span>
                    <span className="font-bold">
                      {currentRoomData.maxGuests} Guests
                    </span>
                  </div>
                  <div
                    className={`${michroma.className} font-extrabold text-[#ddd92a] bg-black px-3 py-1 rounded-full`}
                  >
                    LKR {currentRoomData.price?.toLocaleString() || '0'}/night
                  </div>
                </div>

                {/* Minimal Features */}
                <div>
                  <div
                    className={`${inter.className} text-[#2d2a32] text-sm font-medium mb-3`}
                  >
                    INCLUDES
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentRoomData.features
                      ?.slice(0, 4)
                      .map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#2d2a32]/5 text-[#2d2a32] text-xs rounded-full border border-[#2d2a32]/10"
                        >
                          {feature}
                        </span>
                      ))}
                    {currentRoomData.features?.length > 4 && (
                      <span className="px-3 py-1 bg-[#2d2a32]/5 text-[#2d2a32] text-xs rounded-full border border-[#2d2a32]/10">
                        +{currentRoomData.features.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Clean Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    onClick={() => handleBookNow(currentRoomData)}
                    className={`${michroma.className} flex-1 bg-[#2d2a32] text-[#fafdf6] py-2.5 rounded text-sm font-medium hover:bg-[#ddd92a] hover:text-[#2d2a32] transition-colors duration-200`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book Now
                  </motion.button>
                  <motion.button
                    className={`${inter.className} px-4 border border-[#2d2a32] text-[#2d2a32] rounded text-sm font-medium hover:bg-[#2d2a32] hover:text-[#fafdf6] transition-colors duration-200`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Subtle Navigation */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:px-4">
            <motion.button
              onClick={prevRoom}
              className="w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-sm flex items-center justify-center text-[#2d2a32] hover:text-[#ddd92a] transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            <motion.button
              onClick={nextRoom}
              className="w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-sm flex items-center justify-center text-[#2d2a32] hover:text-[#ddd92a] transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>

          {/* Minimal Dots - FIX: Wrap in div */}
          <div className="flex justify-center space-x-2 mt-8">
            {displayedRooms.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentRoom(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentRoom ? "bg-[#2d2a32]" : "bg-[#2d2a32]/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Subtle CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            className={`${michroma.className} px-6 py-2.5 text-[#2d2a32] border border-[#2d2a32] rounded text-sm font-medium hover:bg-[#2d2a32] hover:text-[#fafdf6] transition-colors duration-200`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/rooms">View All Rooms</Link>
          </motion.button>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        room={selectedRoom}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default Rooms;