// frontend/app/my-bookings/page.js
"use client";
import React from 'react';
import UserDashboard from '../components/Dashboard/UserDashboard';
import Footer from '../components/Footer';
import { inter, michroma } from '../../lib/fonts';

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-[#fafdf6]">
      {/* Navigation Spacer */}
      <div className="h-16 md:h-20"></div>

      {/* Page Header */}
      <div className="bg-[#2d2a32] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`${michroma.className} text-4xl md:text-5xl font-bold mb-4`}>
              My Bookings
            </h1>
            <p className={`${inter.className} text-white/80 text-lg max-w-2xl mx-auto`}>
              Manage your upcoming stays and booking history
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserDashboard />
        </div>
      </div>

      <Footer />
    </div>
  );
}