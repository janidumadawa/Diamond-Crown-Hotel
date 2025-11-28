"use client";
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../lib/adminAPI';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllBookings(); 
      console.log('Bookings data:', response);
      setBookings(response.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedBooking) return;

    try {
      setUpdating(true);
      await adminAPI.updateBookingStatus(selectedBooking._id, newStatus);
      
      // Refresh bookings
      await fetchBookings();
      
      // Update selected booking in modal
      setSelectedBooking(prev => ({
        ...prev,
        status: newStatus
      }));
      
      alert(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert('Failed to update booking status: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bookings Management</h2>
        <p className="text-gray-600">Manage all hotel bookings and reservations</p>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="text-gray-600 mt-2">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Bookings Found</h3>
          <p className="text-gray-600">There are no bookings in the system.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Booking ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Guest</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Room</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Check-in</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Check-out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Guests</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking, index) => {
                const nights = calculateNights(booking.checkIn, booking.checkOut);
                
                return (
                  <tr key={booking._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm border-b">
                      <div className="font-mono text-gray-900 text-xs">{booking._id?.substring(0, 8)}...</div>
                    </td>
                    <td className="px-4 py-3 text-sm border-b">
                      <div className="font-medium text-gray-900">{booking.user?.name || 'Unknown User'}</div>
                      {booking.user?.email && (
                        <div className="text-gray-500 text-xs">{booking.user.email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm border-b">
                      <div className="font-medium text-gray-900">{booking.room?.name || 'Unknown Room'}</div>
                      {booking.room?.type && (
                        <div className="text-gray-500 text-xs">{booking.room.type}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm border-b">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                      {formatDate(booking.checkIn)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                      {formatDate(booking.checkOut)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                      <div className="text-center">
                        <span className="font-medium">{booking.guests || 1}</span>
                        <div className="text-gray-500 text-xs">guests</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                      <div className="text-center">
                        <span className="font-medium text-green-600">LKR {booking.totalPrice?.toLocaleString() || '0'}</span>
                        <div className="text-gray-500 text-xs">{nights} nights</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                      <button 
                        onClick={() => handleViewBooking(booking)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div 
          className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                  <p className="text-gray-600">Booking ID: {selectedBooking._id}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guest Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Guest Information</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.user?.name || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.user?.email || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.user?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Room Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Room Information</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.room?.name || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Room Type</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.room?.type || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price per Night</label>
                      <p className="mt-1 text-sm text-gray-900">LKR {selectedBooking.room?.price?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Booking Details</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.checkIn)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedBooking.checkOut)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)} nights
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedBooking.guests || 1} guests</p>
                    </div>
                  </div>
                </div>

                {/* Payment & Status */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment & Status</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <p className="mt-1 text-lg font-bold text-green-600">
                        LKR {selectedBooking.totalPrice?.toLocaleString() || '0'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Booking Status</label>
                      <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                      <span className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBooking.paymentStatus === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : selectedBooking.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedBooking.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Booking Created</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDateTime(selectedBooking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">Special Requests</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3 justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus('confirmed')}
                        disabled={updating}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? 'Confirming...' : 'Confirm Booking'}
                      </button>
                    )}
                    
                    {selectedBooking.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus('completed')}
                        disabled={updating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? 'Marking...' : 'Mark as Completed'}
                      </button>
                    )}
                    
                    {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this booking?')) {
                            handleUpdateStatus('cancelled');
                          }
                        }}
                        disabled={updating}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;