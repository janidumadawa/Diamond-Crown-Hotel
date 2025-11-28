// frontend/app/components/Admin/RoomsManagement.jsx
"use client";
import React, { useEffect, useState } from "react";
import { adminAPI } from "../../../lib/adminAPI";

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    name: "",
    type: "Deluxe Room",
    price: "",
    size: "",
    capacity: "",
    maxGuests: "",
    description: "",
    features: [],
    images: [],
    available: true,
    maintenance: false,
  });

  const roomTypes = [
    "Deluxe Room",
    "Premier Room",
    "Executive Suite",
    "Business Suite",
    "Standard Room",
  ];

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllRooms();
      setRooms(response.rooms || []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      console.log("Creating room with data:", newRoom);
      console.log("Images being sent:", newRoom.images);

      const roomData = {
        roomNumber: newRoom.roomNumber,
        name: newRoom.name,
        type: newRoom.type,
        price: Number(newRoom.price),
        size: newRoom.size,
        capacity: Number(newRoom.capacity),
        maxGuests: Number(newRoom.maxGuests),
        description: newRoom.description,
        features: Array.isArray(newRoom.features)
          ? newRoom.features
          : newRoom.features
              .split(",")
              .map((f) => f.trim())
              .filter((f) => f),
        images: newRoom.images || [],
        available: newRoom.available,
        maintenance: newRoom.maintenance,
      };

      console.log("Final room data being sent:", roomData);

      await adminAPI.createRoom(roomData);
      alert("Room created successfully!");
      resetForm();
      fetchRooms();
    } catch (err) {
      console.error("Error creating room:", err);
      alert("Error creating room: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);

    if (!files.length) {
      console.log("No files selected");
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      console.log(`Appending file ${index}:`, file.name);
      formData.append("images", file);
    });

    try {
      console.log("Uploading images...");
      const response = await adminAPI.uploadImage(formData);
      console.log("Upload response:", response);

      if (response.success) {
        // Make sure we're properly updating the state
        setNewRoom((prev) => {
          const updatedImages = [...prev.images, ...(response.urls || [])];
          console.log("Updated images array:", updatedImages);
          return {
            ...prev,
            images: updatedImages,
          };
        });

        alert(`Successfully uploaded ${response.urls?.length || 0} image(s)`);
      } else {
        alert("Upload failed: " + (response.message || "Unknown error"));
      }

      e.target.value = "";
    } catch (err) {
      console.error("Error uploading images:", err);
      alert("Image upload failed: " + err.message);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await adminAPI.deleteRoom(id);
      fetchRooms();
      alert("Room deleted successfully!");
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("Error deleting room. Please try again.");
    }
  };

  const handleUpdateRoomStatus = async (roomId, field, value) => {
    try {
      await adminAPI.updateRoom(roomId, { [field]: value });
      fetchRooms();
    } catch (err) {
      console.error("Error updating room:", err);
      alert("Error updating room status. Please try again.");
    }
  };

  const resetForm = () => {
    setNewRoom({
      roomNumber: "",
      name: "",
      type: "Deluxe Room",
      price: "",
      size: "",
      capacity: "",
      maxGuests: "",
      description: "",
      features: [],
      images: [],
      available: true,
      maintenance: false,
    });
    setShowForm(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewRoom((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Rooms Management
          </h2>
          <p className="text-gray-600">
            Manage hotel rooms, availability, and maintenance
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium"
        >
          {showForm ? "Cancel" : "Add New Room"}
        </button>
      </div>

      {/* Create Room Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Room
          </h3>
          <form
            onSubmit={handleCreateRoom}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                value={newRoom.roomNumber}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, roomNumber: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                required
              />
            </div>
            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Name *
              </label>
              <input
                type="text"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                required
              />
            </div>
            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                value={newRoom.type}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (LKR) *
              </label>
              <input
                type="number"
                value={newRoom.price}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, price: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                required
              />
            </div>
            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (sqm)
              </label>
              <input
                type="text"
                value={newRoom.size}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, size: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="e.g., 45 sqm"
              />
            </div>
            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                value={newRoom.capacity}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, capacity: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            {/* Max Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests
              </label>
              <input
                type="number"
                value={newRoom.maxGuests}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, maxGuests: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={newRoom.available ? "true" : "false"}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    available: e.target.value === "true",
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, description: e.target.value })
                }
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>

            {/* Features */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features (comma-separated)
              </label>
              <input
                type="text"
                value={newRoom.features.join(", ")}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    features: e.target.value.split(",").map((f) => f.trim()),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="WiFi, AC, TV, Mini Bar"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Room Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              />

              {/* ADD THIS - Image Previews */}
              {newRoom.images && newRoom.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Uploaded images ({newRoom.images.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {newRoom.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional: Show message when no images */}
              {(!newRoom.images || newRoom.images.length === 0) && (
                <p className="text-xs text-gray-500 mt-1">
                  No images uploaded yet
                </p>
              )}
            </div>
            {/* Form Actions */}
            <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium disabled:bg-gray-400"
              >
                {creating ? "Creating..." : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="text-gray-600 mt-2">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No Rooms Found
          </h3>
          <p className="text-gray-600">
            Get started by adding your first room.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Room Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room, index) => (
                <tr
                  key={room._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 text-sm border-b">
                    <div className="font-medium text-gray-900">
                      {room.roomNumber}
                    </div>
                    <div className="text-gray-500">{room.name}</div>
                  </td>
                  <td className="px-4 py-3 text-sm border-b">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {room.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm border-b">
                    <div className="font-semibold text-gray-900">
                      LKR {room.price?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm border-b space-y-1">
                    <select
                      value={room.available ? "true" : "false"}
                      onChange={(e) =>
                        handleUpdateRoomStatus(
                          room._id,
                          "available",
                          e.target.value === "true"
                        )
                      }
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                    <select
                      value={room.maintenance ? "true" : "false"}
                      onChange={(e) =>
                        handleUpdateRoomStatus(
                          room._id,
                          "maintenance",
                          e.target.value === "true"
                        )
                      }
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    >
                      <option value="false">No Maintenance</option>
                      <option value="true">Under Maintenance</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm border-b">
                    <button
                      onClick={() => handleDeleteRoom(room._id)}
                      className="text-red-600 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && rooms.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900">
              {rooms.length}
            </div>
            <div className="text-sm text-gray-600">Total Rooms</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {rooms.filter((room) => room.available).length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">
              {rooms.filter((room) => !room.available).length}
            </div>
            <div className="text-sm text-gray-600">Unavailable</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {rooms.filter((room) => room.maintenance).length}
            </div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsManagement;
