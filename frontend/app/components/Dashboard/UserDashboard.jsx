"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { inter, michroma, playwrite } from '../../../lib/fonts';
import { bookingsAPI } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext'; // Import auth context

const UserDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth(); // Get auth status

    useEffect(() => {
        if (isAuthenticated) {
            fetchBookings();
        } else {
            // If not authenticated, clear data and stop loading
            setBookings([]);
            setLoading(false);
            setError('');
        }
    }, [isAuthenticated]); // Re-run when auth status changes

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await bookingsAPI.getBookings();
            console.log('Bookings data:', response);
            
            // Filter out any bookings with null room data
            const validBookings = (response.bookings || []).filter(booking => booking.room != null);
            setBookings(validBookings);
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('token')) {
                // Token expired or invalid - clear data
                setBookings([]);
                setError('');
            } else {
                setError('Failed to load bookings');
            }
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await bookingsAPI.cancelBooking(bookingId);
            // Refresh bookings
            fetchBookings();
        } catch (error) {
            alert('Failed to cancel booking: ' + error.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
            case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    // Safe room data access
    const getRoomName = (booking) => {
        return booking.room?.name || 'Room Not Available';
    };

    const getNightsCount = (booking) => {
        if (!booking.room?.price) return 'Unknown';
        return Math.round(booking.totalPrice / booking.room.price);
    };

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <h3 className={`${michroma.className} text-lg font-medium text-yellow-800 mb-2`}>
                        Sign In Required
                    </h3>
                    <p className={`${inter.className} text-yellow-700`}>
                        Please sign in to view your bookings
                    </p>
                </div>
                <Link 
                    href="/#rooms"
                    className={`${michroma.className} inline-block px-6 py-2 bg-[#2d2a32] text-[#fafdf6] rounded hover:bg-[#ddd92a] hover:text-[#2d2a32] transition-colors`}
                >
                    Book a Room
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#ddd92a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className={`${inter.className} text-[#2d2a32]/60`}>Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className={`${michroma.className} text-2xl font-bold text-[#2d2a32] mb-2`}>
                    My Bookings
                </h2>
                <p className={`${inter.className} text-[#2d2a32]/60`}>
                    Manage your upcoming and past stays
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="text-center py-12">
                    <p className={`${inter.className} text-[#2d2a32]/60 mb-4`}>
                        You haven't made any bookings yet.
                    </p>
                    <Link 
                        href="/#rooms"
                        className={`${michroma.className} inline-block px-6 py-2 bg-[#2d2a32] text-[#fafdf6] rounded hover:bg-[#ddd92a] hover:text-[#2d2a32] transition-colors`}
                    >
                        Book a Room
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-[#2d2a32]/10 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    {/* SAFE: Room name with fallback */}
                                    <h3 className={`${michroma.className} text-lg font-medium text-[#2d2a32] mb-2`}>
                                        {getRoomName(booking)}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className={`${inter.className} text-[#2d2a32]/70`}>Check-in:</span>
                                            <p className="font-medium">
                                                {new Date(booking.checkIn).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`${inter.className} text-[#2d2a32]/70`}>Check-out:</span>
                                            <p className="font-medium">
                                                {new Date(booking.checkOut).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`${inter.className} text-[#2d2a32]/70`}>Guests:</span>
                                            <p className="font-medium">{booking.guests}</p>
                                        </div>
                                    </div>

                                    {booking.specialRequests && (
                                        <div className="mt-3">
                                            <span className={`${inter.className} text-[#2d2a32]/70 text-sm`}>
                                                Special Requests:
                                            </span>
                                            <p className="text-sm text-[#2d2a32]/80 mt-1">
                                                {booking.specialRequests}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <div className="text-right">
                                        <p className={`${michroma.className} text-lg font-medium text-[#ddd92a]`}>
                                            LKR {booking.totalPrice?.toLocaleString() || '0'}
                                        </p>
                                        {/* SAFE: Nights calculation with fallback */}
                                        <span className={`${inter.className} text-[#2d2a32]/60 text-sm`}>
                                            {getNightsCount(booking)} nights
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className={`${inter.className} text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                                        </span>
                                        
                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className={`${playwrite.className} text-xs px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors`}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;