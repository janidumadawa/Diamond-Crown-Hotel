// frontend/lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function for API calls
export const apiClient = async (endpoint, options = {}) => {
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Keep this
    ...options,
  };

  // Remove Content-Type for FormData
  if (options.isForm) {
    config.body = options.body;
    delete config.headers["Content-Type"];
  } else if (options.body && !options.isForm) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle unauthorized (will trigger logout)
    if (response.status === 401) {
      // Token is invalid/expired
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("unauthorized"));
      }
      throw new Error("Authentication required");
    }

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.message || data || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Client Error:", error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiClient("/auth/register", { method: "POST", body: userData }),
  login: (credentials) =>
    apiClient("/auth/login", { method: "POST", body: credentials }),
  logout: () => apiClient("/auth/logout", { method: "GET" }),
  getMe: () => apiClient("/auth/me", { method: "GET" }),
  updateProfile: (data) =>
    apiClient("/auth/profile", { method: "PUT", body: data }),
};

// Rooms API
export const roomsAPI = {
  getRooms: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(queryString ? `/rooms?${queryString}` : `/rooms`);
  },

  getRoom: (id) => apiClient(`/rooms/${id}`),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (data) =>
    apiClient("/bookings", { method: "POST", body: data }),
  getBookings: () => apiClient("/bookings"),
  getBooking: (id) => apiClient(`/bookings/${id}`),
  cancelBooking: (id) => apiClient(`/bookings/${id}`, { method: "PUT" }),
};

// Amenities API
export const amenitiesAPI = {
  getAmenities: () => apiClient("/amenities"),
  getAmenity: (id) => apiClient(`/amenities/${id}`),
  createAmenity: (data) =>
    apiClient("/amenities", { method: "POST", body: data }),
  updateAmenity: (id, data) =>
    apiClient(`/amenities/${id}`, { method: "PUT", body: data }),
  deleteAmenity: (id) => apiClient(`/amenities/${id}`, { method: "DELETE" }),
};

// Contact API
export const contactAPI = {
  submitContact: (formData) =>
    apiClient("/contact", { method: "POST", body: formData }),
  getUserMessages: () => apiClient("/contact/user/messages"),
};

export default apiClient;
