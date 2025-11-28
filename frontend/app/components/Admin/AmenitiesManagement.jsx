"use client";
import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../lib/adminAPI";

const AmenitiesManagement = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null
    });

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAmenities();
            console.log('Amenities response:', response);
            setAmenities(response.amenities || []);
        } catch (error) {
            console.error("Error fetching amenities:", error);
            alert('Error loading amenities: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            if (editingAmenity) {
                await adminAPI.updateAmenity(editingAmenity._id, submitData);
                alert('Amenity updated successfully!');
            } else {
                await adminAPI.createAmenity(submitData);
                alert('Amenity created successfully!');
            }
            
            resetForm();
            fetchAmenities();
        } catch (error) {
            console.error("Error saving amenity:", error);
            alert('Error saving amenity: ' + error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this amenity?")) {
            try {
                await adminAPI.deleteAmenity(id);
                alert('Amenity deleted successfully!');
                fetchAmenities();
            } catch (error) {
                console.error("Error deleting amenity:", error);
                alert('Error deleting amenity: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            image: null
        });
        setEditingAmenity(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    <p className="text-gray-600 mt-2">Loading amenities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Amenities Management
                    </h2>
                    <p className="text-gray-600">
                        Manage hotel amenities and services
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                >
                    {showForm ? "Cancel" : "Add New Amenity"}
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Luxury Bathroom"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                placeholder="e.g., Experience spa-like luxury with our premium bathroom amenities"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                required={!editingAmenity}
                            />
                            {formData.image && (
                                <p className="text-sm text-green-600 mt-1">
                                    {formData.image.name} selected
                                </p>
                            )}
                            {editingAmenity && !formData.image && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Current image will be kept if no new file selected
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                disabled={creating}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating}
                                className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                            >
                                {creating ? "Saving..." : (editingAmenity ? "Update Amenity" : "Create Amenity")}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Amenities List */}
            {amenities.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Amenities Found</h3>
                    <p className="text-gray-600">Get started by adding your first amenity.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {amenities.map((amenity) => (
                        <div key={amenity._id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex gap-6">
                                {/* Amenity Image */}
                                <div className="flex-shrink-0">
                                    <img 
                                        src={amenity.image} 
                                        alt={amenity.title}
                                        className="w-32 h-32 object-cover rounded-lg border"
                                    />
                                </div>
                                
                                {/* Amenity Details */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{amenity.title}</h3>
                                    <p className="text-gray-600 mb-4">{amenity.description}</p>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingAmenity(amenity);
                                                setFormData({
                                                    title: amenity.title,
                                                    description: amenity.description,
                                                    image: null
                                                });
                                                setShowForm(true);
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(amenity._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AmenitiesManagement;