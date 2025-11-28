"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { inter, michroma } from '../../../lib/fonts';

const AdminStats = ({ stats, onRefresh }) => {
  const statCards = [
    {
      title: 'Total Revenue',
      value: `LKR ${stats.totalRevenue?.toLocaleString() || '0'}`,
      description: 'Last 30 days',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings || 0,
      description: 'All time bookings',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Total Rooms',
      value: stats.totalRooms || 0,
      description: `${stats.availableRooms || 0} available`,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings || 0,
      description: 'Active reservations',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Completed Bookings',
      value: stats.completedBookings || 0,
      description: 'Successfully stayed',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      description: 'Registered customers',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const bookingStatus = [
    { status: 'Confirmed', count: stats.confirmedBookings, color: 'bg-green-100 text-green-800' },
    { status: 'Pending', count: stats.pendingBookings, color: 'bg-yellow-100 text-yellow-800' },
    { status: 'Cancelled', count: stats.cancelledBookings, color: 'bg-red-100 text-red-800' },
    { status: 'Completed', count: stats.completedBookings, color: 'bg-blue-100 text-blue-800' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-[#2d2a32]/10 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${inter.className} text-[#2d2a32]/60 text-sm font-medium`}>
                  {stat.title}
                </p>
                <p className={`${michroma.className} text-2xl font-bold text-[#2d2a32] mt-1`}>
                  {stat.value}
                </p>
                <p className={`${inter.className} text-[#2d2a32]/40 text-xs mt-1`}>
                  {stat.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-[#2d2a32]/10 p-6"
      >
        <h3 className={`${michroma.className} text-lg font-bold text-[#2d2a32] mb-4`}>
          Booking Status Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {bookingStatus.map((status) => (
            <div key={status.status} className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.status}
              </div>
              <p className={`${michroma.className} text-2xl font-bold text-[#2d2a32] mt-2`}>
                {status.count || 0}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Room Availability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-[#2d2a32]/10 p-6"
      >
        <h3 className={`${michroma.className} text-lg font-bold text-[#2d2a32] mb-4`}>
          Room Availability
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${inter.className} text-[#2d2a32]/60`}>
              Available Rooms
            </p>
            <p className={`${michroma.className} text-2xl font-bold text-[#2d2a32]`}>
              {stats.availableRooms || 0} / {stats.totalRooms || 0}
            </p>
          </div>
          <div>
            <div className={`${inter.className} text-[#2d2a32]/60 text-sm mb-2`}>
              Availability Rate: {stats.totalRooms ? ((stats.availableRooms / stats.totalRooms) * 100).toFixed(2) : 0}%
            </div>
          </div>
          <div className="w-32">
            <div className="bg-[#2d2a32]/10 rounded-full h-3">
              <div 
                className="bg-[#ddd92a] rounded-full h-3 transition-all duration-500"
                style={{ 
                  width: `${stats.totalRooms ? (stats.availableRooms / stats.totalRooms) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminStats;