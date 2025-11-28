// frontend/lib/adminAPI.js
import apiClient from "./api";

// Admin Dashboard API
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: () => apiClient("/admin/dashboard"),

  // Bookings Management
  getAllBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/admin/bookings?${queryString}`);
  },
  updateBookingStatus: (id, status) =>
    apiClient(`/admin/bookings/${id}`, { method: "PUT", body: { status } }),

  // Rooms Management
  getAllRooms: () => apiClient("/admin/rooms"),
  updateRoom: (id, roomData) =>
    apiClient(`/admin/rooms/${id}`, { method: "PUT", body: roomData }),

  //create a new room
  createRoom: (roomData) =>
    apiClient("/admin/rooms", { method: "POST", body: roomData }),

  // Delete a room
  deleteRoom: (id) => apiClient(`/admin/rooms/${id}`, { method: "DELETE" }),

  // Upload Images
  uploadImage: (formData) => {
    return apiClient("/admin/upload-image", {
      method: "POST",
      body: formData,
      isForm: true,
    });
  },

  // Users Management
  getAllUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/admin/users?${queryString}`);
  },

// Amenities Management
  getAmenities: () => apiClient('/admin/amenities'),
  createAmenity: (formData) => 
    apiClient('/admin/amenities', { 
      method: 'POST', 
      body: formData, 
      isForm: true 
    }),
  updateAmenity: (id, formData) => 
    apiClient(`/admin/amenities/${id}`, { 
      method: 'PUT', 
      body: formData, 
      isForm: true 
    }),
  deleteAmenity: (id) => 
    apiClient(`/admin/amenities/${id}`, { method: 'DELETE' }),


// Gallery Management
getGalleryImages: () => apiClient('/admin/gallery'),
createGalleryImage: (formData) =>
  apiClient('/admin/gallery', { 
    method: 'POST', 
    body: formData,
    isForm: true 
  }),
deleteGalleryImage: (id) => 
  apiClient(`/admin/gallery/${id}`, { 
    method: 'DELETE' }),
updateImageOrder: (images) =>
  apiClient('/admin/gallery/order', { 
    method: 'PUT', 
    body: {images}
  }),


 // Contact Management
  getContacts: () => apiClient('/contact/admin/contacts'),
  markContactAsRead: (id) => 
    apiClient(`/contact/admin/contacts/${id}/read`, { method: 'PUT' }),
};
