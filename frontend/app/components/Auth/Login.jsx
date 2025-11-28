"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { inter, michroma, playwrite } from '../../../lib/fonts';

const Login = ({ onSwitchToRegister, onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
    >
      <h2 className={`${michroma.className} text-2xl font-bold text-[#2d2a32] mb-6 text-center`}>
        Welcome Back
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`${inter.className} block text-sm font-medium text-[#2d2a32] mb-2`}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#2d2a32]/20 rounded-lg focus:outline-none focus:border-[#ddd92a] transition-colors"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className={`${inter.className} block text-sm font-medium text-[#2d2a32] mb-2`}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#2d2a32]/20 rounded-lg focus:outline-none focus:border-[#ddd92a] transition-colors"
            placeholder="Enter your password"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className={`${michroma.className} w-full bg-[#2d2a32] text-[#fafdf6] py-3 rounded-lg font-medium hover:bg-[#ddd92a] hover:text-[#2d2a32] transition-colors duration-200 disabled:opacity-50`}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className={`${inter.className} text-[#2d2a32]/70 text-sm`}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#ddd92a] hover:text-[#2d2a32] font-medium transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;