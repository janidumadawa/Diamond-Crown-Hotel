// frontend/app/rooms/[id]/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { roomsAPI } from "../../../lib/api";
import { useAuth } from "../../../contexts/AuthContext";
import BookingModal from "../../components/Booking/BookingModal";
import { useParams } from "next/navigation";

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params.id;
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await roomsAPI.getRoom(roomId, token);
        setRoom(data.room || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // Handle Book Now
  const handleBookNow = () => {
    if (!isAuthenticated) {
      document.querySelector("nav button")?.click();
      return;
    }
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  if (!room) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto border border-gray-200 ">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Room Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The room you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/rooms">
              <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                Back to Rooms
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-6">
          <Link href="/rooms">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Rooms</span>
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={room.images?.[0]}
                alt={room.name}
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {room.name}
                </h1>
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {room.type}
                </span>
              </div>
              <p className="text-gray-600">{room.description}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  LKR {room.price?.toLocaleString() || "N/A"}
                </span>
                <span className="text-gray-600">/ night</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {room.capacity || "N/A"}
                </div>
                <div className="text-sm text-gray-600">Guests</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {room.size || "N/A"}
                </div>
                <div className="text-sm text-gray-600">Square Feet</div>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Link href="/rooms" className="flex-1">
                <button className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Back to Rooms
                </button>
              </Link>
              <button
                onClick={handleBookNow}
                className="flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          room={selectedRoom}
          onSuccess={() => {
            setIsBookingModalOpen(false);
            setSelectedRoom(null);
            window.location.href = "/my-bookings";
          }}
        />
      </div>
    </div>
  );
}
