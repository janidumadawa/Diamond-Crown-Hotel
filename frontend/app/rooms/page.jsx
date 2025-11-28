// frontend/app/rooms/page.jsx
"use client";
import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { roomsAPI } from "../../lib/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await roomsAPI.getRooms();
        setRooms(data.rooms || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-16 mb-4">
            Our Rooms & Suites
          </h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of meticulously designed rooms, 
            each offering the perfect blend of luxury and comfort
          </p>
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Rooms Available
              </h3>
              <p className="text-gray-600">
                Please check back later for room availability
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <div className="bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Assistance?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our dedicated team is here to help you choose the perfect room for your stay. 
              Contact us for personalized recommendations and special requests.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">Best Price Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">Flexible Cancellation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}