// frontend/app/admin/page.js
"use client";
import React from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/');
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafdf6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#ddd92a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2d2a32]/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#fafdf6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}