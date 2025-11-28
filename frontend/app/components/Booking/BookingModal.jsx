"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { inter, michroma, playwrite } from '../../../lib/fonts';
import { bookingsAPI } from '../../../lib/api';

const BookingModal = ({ isOpen, onClose, room, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: ''
    });

    if (!isOpen || !room) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const calculateTotal = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0;
        
        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return room.price * diffDays;
    };

    const validateDates = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) {
            setError('Please select both check-in and check-out dates');
            return false;
        }

        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            setError('Check-in date cannot be in the past');
            return false;
        }

        if (checkOut <= checkIn) {
            setError('Check-out date must be after check-in date');
            return false;
        }

        if (bookingData.guests > room.maxGuests) {
            setError(`This room can accommodate maximum ${room.maxGuests} guests`);
            return false;
        }

        return true;
    };

    const handleNextStep = () => {
        if (validateDates()) {
            setStep(2);
        }
    };

    const handleBooking = async () => {
        try {
            setLoading(true);
            setError('');

            const bookingPayload = {
                roomId: room._id,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                guests: parseInt(bookingData.guests),
                specialRequests: bookingData.specialRequests
            };

            const token = localStorage.getItem('token');
            await bookingsAPI.createBooking(bookingPayload, token);
            onSuccess();
        } catch (error) {
            setError(error.message || 'Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = calculateTotal();
    const nights = totalAmount / room.price;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#2d2a32] text-white p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className={`${michroma.className} text-xl font-bold mb-2`}>
                                    {step === 1 ? 'Book Your Stay' : 'Confirm Booking'}
                                </h2>
                                <p className={`${inter.className} text-white/80 text-sm`}>
                                    {room.name}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            <div className="space-y-6">
                                {/* Date Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`${inter.className} block text-sm font-medium text-[#2d2a32] mb-2`}>
                                            Check-in Date
                                        </label>
                                        <input
                                            type="date"
                                            name="checkIn"
                                            value={bookingData.checkIn}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-2 border border-[#2d2a32]/20 rounded-lg focus:outline-none focus:border-[#ddd92a] transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className={`${inter.className} block text-sm font-medium text-[#2d2a32] mb-2`}>
                                            Check-out Date
                                        </label>
                                        <input
                                            type="date"
                                            name="checkOut"
                                            value={bookingData.checkOut}
                                            onChange={handleInputChange}
                                            min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-2 border border-[#2d2a32]/20 rounded-lg focus:outline-none focus:border-[#ddd92a] transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Guests */}
                                <div>
                                    <label className={`${inter.className} block text-sm font-medium text-[#2d2a32] mb-2`}>
                                        Number of Guests
                                    </label>
                                    <select
                                        name="guests"
                                        value={bookingData.guests}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#2d2a32]/20 rounded-lg focus:outline-none focus:border-[#ddd92a] transition-colors"
                                    >
                                        {[...Array(room.maxGuests)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Special Requests */}
                                <div>
                                    <label className={`${inter.className} block text-sm font-medium text-[#2d2a32] mb-2`}>
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        name="specialRequests"
                                        value={bookingData.specialRequests}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-[#2d2a32]/20 rounded-lg focus:outline-none focus:border-[#ddd92a] transition-colors resize-none"
                                        placeholder="Any special requirements or requests..."
                                    />
                                </div>

                                {/* Price Summary */}
                                {totalAmount > 0 && (
                                    <div className="bg-[#fafdf6] border border-[#ddd92a]/20 rounded-lg p-4">
                                        <h3 className={`${inter.className} font-medium text-[#2d2a32] mb-2`}>
                                            Price Summary
                                        </h3>
                                        <div className="flex justify-between text-sm">
                                            <span>LKR {room.price.toLocaleString()} × {nights} nights</span>
                                            <span className={`${michroma.className} font-medium text-[#ddd92a]`}>
                                                LKR {totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Booking Confirmation */}
                                <div className="bg-[#fafdf6] border border-[#ddd92a]/20 rounded-lg p-4">
                                    <h3 className={`${inter.className} font-medium text-[#2d2a32] mb-4`}>
                                        Booking Details
                                    </h3>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[#2d2a32]/70">Room:</span>
                                            <span className="font-medium">{room.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#2d2a32]/70">Check-in:</span>
                                            <span className="font-medium">
                                                {new Date(bookingData.checkIn).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#2d2a32]/70">Check-out:</span>
                                            <span className="font-medium">
                                                {new Date(bookingData.checkOut).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#2d2a32]/70">Guests:</span>
                                            <span className="font-medium">{bookingData.guests}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#2d2a32]/70">Duration:</span>
                                            <span className="font-medium">{nights} nights</span>
                                        </div>
                                        <div className="border-t border-[#2d2a32]/10 pt-2 mt-2">
                                            <div className="flex justify-between font-medium">
                                                <span>Total Amount:</span>
                                                <span className={`${michroma.className} text-[#ddd92a]`}>
                                                    LKR {totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {bookingData.specialRequests && (
                                    <div>
                                        <h4 className={`${inter.className} font-medium text-[#2d2a32] mb-2`}>
                                            Special Requests
                                        </h4>
                                        <p className="text-sm text-[#2d2a32]/70 bg-[#fafdf6] p-3 rounded-lg">
                                            {bookingData.specialRequests}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className={`${inter.className} text-blue-700 text-sm`}>
                                        💳 <strong>Note:</strong> This is a demo application. No real payment will be processed.
                                        Your booking will be confirmed immediately.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-[#2d2a32]/10 p-6">
                        <div className="flex justify-between space-x-4">
                            {step === 1 ? (
                                <>
                                    <button
                                        onClick={onClose}
                                        className={`${playwrite.className} px-6 py-2 border border-[#2d2a32] text-[#2d2a32] rounded-lg hover:bg-[#2d2a32] hover:text-[#fafdf6] transition-colors duration-200`}
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        onClick={handleNextStep}
                                        disabled={!bookingData.checkIn || !bookingData.checkOut}
                                        className={`${michroma.className} px-6 py-2 bg-[#2d2a32] text-[#fafdf6] rounded-lg hover:bg-[#ddd92a] hover:text-[#2d2a32] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                            
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Continue
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setStep(1)}
                                        className={`${playwrite.className} px-6 py-2 border border-[#2d2a32] text-[#2d2a32] rounded-lg hover:bg-[#2d2a32] hover:text-[#fafdf6] transition-colors duration-200`}
                                    >
                                        Back
                                    </button>
                                    <motion.button
                                        onClick={handleBooking}
                                        disabled={loading}
                                        className={`${michroma.className} px-6 py-2 bg-[#ddd92a] text-[#2d2a32] rounded-lg hover:bg-[#2d2a32] hover:text-[#fafdf6] transition-colors duration-200 disabled:opacity-50`}
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {loading ? 'Booking...' : 'Confirm Booking'}
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BookingModal;