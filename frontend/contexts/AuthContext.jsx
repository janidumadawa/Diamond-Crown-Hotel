// frontend/contexts/AuthContext.jsx
"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../lib/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();

    // Listen for unauthorized events
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);



  const login = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });
    console.log("✅ Login successful:", response);
    
    // Store user in session storage as fallback
    if (response.user) {
      sessionStorage.setItem('user', JSON.stringify(response.user));
    }
    
    setUser(response.user);
    setIsAuthenticated(true);
    return { success: true };
  } catch (error) {
    console.error("❌ Login failed:", error);
    return { success: false, error: error.message };
  }
};


const checkAuthStatus = async () => {
  try {
    const response = await authAPI.getMe();
    console.log("✅ Auth check successful:", response);
    
    // Update session storage
    sessionStorage.setItem('user', JSON.stringify(response.data));
    
    setUser(response.data);
    setIsAuthenticated(true);
  } catch (error) {
    console.log("🔐 Auth check failed:", error.message);
    
    // Fallback to session storage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      console.log("✅ Using session storage fallback");
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  } finally {
    setLoading(false);
  }
};


  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      console.log("✅ Register successful:", response);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("❌ Register failed:", error);
      return { success: false, error: error.message };
    }
  };

const logout = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error("❌ Logout error:", error);
  } finally {
    // Clear session storage
    sessionStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }
};

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
