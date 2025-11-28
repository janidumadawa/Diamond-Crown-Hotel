// frontend/app/components/Admin/AdminDashboard.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { inter, michroma, playwrite } from '../../../lib/fonts';
import { adminAPI } from '../../../lib/adminAPI';
import AdminStats from './AdminStats';
import BookingsManagement from './BookingsManagement';
import RoomsManagement from './RoomsManagement';
import UsersManagement from './UsersManagement';
import AmenitiesManagement from './AmenitiesManagement';
import GalleryManagement from './GalleryManagement';
import ContactManagement from './ContactManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.stats);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard'},
    { id: 'bookings', name: 'Bookings'},
    { id: 'rooms', name: 'Rooms'},
    { id: 'users', name: 'Users'},
    { id: 'amenities', name: 'Amenities'},
    { id: 'gallery', name: 'Gallery'},
    { id: 'contact', name: 'Contact Messages'},
  ];

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#fafdf6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#ddd92a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${inter.className} text-[#2d2a32]/60`}>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafdf6]">
      {/* Header */}
      <div className="bg-[#2d2a32] text-white py-6 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`${michroma.className} text-3xl font-bold mb-2`}>
                Admin Dashboard
              </h1>
              <p className={`${inter.className} text-white/80`}>
                Manage your hotel operations
              </p>
            </div>
            <div className="text-right">
              <p className={`${playwrite.className} text-[#ddd92a] text-sm`}>
                Hotel Management
              </p>
              <p className={`${inter.className} text-white/60 text-xs`}>
                Diamond Crown Hotel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#2d2a32]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-[#ddd92a] text-[#2d2a32]'
                    : 'border-transparent text-[#2d2a32]/60 hover:text-[#2d2a32] hover:border-[#2d2a32]/30'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && stats && (
          <AdminStats stats={stats} onRefresh={fetchDashboardStats} />
        )}

        {activeTab === 'bookings' && (
          <BookingsManagement />
        )}

        {activeTab === 'rooms' && (
          <RoomsManagement />
        )}

        {activeTab === 'users' && (
          <UsersManagement />
        )}

        {activeTab === 'amenities' && (
          <AmenitiesManagement />
        )}

        {activeTab === 'gallery' && (
          <GalleryManagement />
        )}

        {activeTab === 'contact' && (
          <ContactManagement />
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;