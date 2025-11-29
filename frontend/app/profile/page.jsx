// frontend/app/profile/page.jsx
"use client";
import { redirect } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      redirect("/");
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
      fetchUserMessages();
    }
  }, [loading, isAuthenticated, user]);

const fetchUserMessages = async () => {
  try {
    setMessagesLoading(true);
    
    console.log("Fetching user messages..."); // Debug line

    // Use credentials: "include" to send cookies automatically
    const response = await fetch('http://localhost:5000/api/contact/user/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // This sends cookies automatically
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response data:", data);
    
    if (data.success) {
      setUserMessages(data.data || []);
    } else {
      console.error('API error:', data.message);
      setUserMessages([]);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    setUserMessages([]);
  } finally {
    setMessagesLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-auto bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="text-center mt-16 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Profile
          </h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-yellow-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 border border-transparent">
                      {user?.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-yellow-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 border border-transparent">
                      {user?.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-yellow-500 focus:outline-none"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 border border-transparent">
                      {user?.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Save Button */}
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            {/* My Messages Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  My Messages
                </h2>
              </div>

              {messagesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                  <span className="ml-2 text-gray-600">Loading messages...</span>
                </div>
              ) : userMessages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">You haven't sent any messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userMessages.map((message) => (
                    <div 
                      key={message._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            message.status === 'read' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {message.status === 'read' ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Seen by Admin
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Sent
                              </>
                            )}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.href = '/my-bookings'}
                  className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  View My Bookings
                </button>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  Contact Support
                </button>
              </div>
            </div>

            {/* Membership Status */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Membership
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">
                  {user?.role || 'Standard Member'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Enjoy exclusive benefits and personalized service
              </p>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Our concierge team is here to assist you
              </p>
              <button 
                onClick={() => window.location.href = '/contact'}
                className="w-full px-3 py-2 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50"
              >
                Contact Support
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <button 
                onClick={logout}
                className="w-full px-3 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}