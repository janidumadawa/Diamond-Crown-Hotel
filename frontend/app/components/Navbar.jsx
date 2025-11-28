"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ADD THIS IMPORT
import { motion, AnimatePresence } from "framer-motion";
import { michroma, playwrite, inter } from "../../lib/fonts";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "./Auth/AuthModal";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname(); // ADD THIS LINE

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "#about" },
    { name: "Rooms", href: "#rooms" },
    { name: "Amenities", href: "#amenities" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

//  Smooth scroll function
const scrollToSection = (href) => {
  // If we're not on the home page AND user clicked a section link (not Home)
  if (pathname !== '/' && href.startsWith('#')) {
    // Navigate to home page with the section hash
    window.location.href = `/${href}`;
    return;
  }
  
  // If we're not on home page and user clicked "Home", just go to home page
  if (pathname !== '/' && href === '/') {
    window.location.href = '/';
    return;
  }
  
  // If already on home page, do smooth scrolling
  if (href === '/') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  
  if (href.startsWith('#')) {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  setIsMobileMenuOpen(false);
};

  const handleLogout = async () => {
    try{
      await logout();
      setIsMobileMenuOpen(false);
    }catch(error){
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#fafdf6]/90 backdrop-blur-md shadow-sm py-2"
            : "bg-[#fafdf6]/20 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo - MAKE IT CLICKABLE */}
            <div className="flex items-center space-x-3">
              <Link href="/">
                <img
                  src="/logo6.png"
                  alt="Diamond Crown Hotel Logo"
                  className="w-10 h-10 object-contain cursor-pointer"
                />
              </Link>
              <Link href="/">
                <div
                  className={`${michroma.className} flex flex-col leading-none cursor-pointer`}
                >
                  <span className="text-[#2d2a32] font-bold text-sm tracking-tight">
                    DIAMOND
                  </span>
                  <span className="text-[#ddd92a] font-bold text-xs tracking-wider">
                    CROWN
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex w-full justify-between items-center">
              {/* Centered Navigation Links */}
              <div className="flex-1 flex justify-center">
                <div className="flex space-x-8">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`${inter.className} text-[#2d2a32] hover:text-[#ddd92a] transition-colors duration-300 relative text-sm font-medium`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right-aligned Auth Section */}
              <div className="flex items-center space-x-6">
                {/* My Bookings Link for Authenticated Users */}
                {isAuthenticated && user?.role !== "admin" && (
                  <Link
                    href="/my-bookings"
                    className={`${inter.className} text-[#2d2a32] hover:text-[#ddd92a] transition-colors duration-300 relative text-sm font-medium`}
                  >
                    My Bookings
                  </Link>
                )}

                {/* Admin Link for Admin Users */}
                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`${inter.className} text-[#2d2a32] hover:text-[#ddd92a] transition-colors duration-300 relative text-sm font-medium`}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* User Greeting and Logout/Book Now */}
                <div className="flex items-center space-x-4">
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleLogout}
                        className={`${inter.className} px-4 py-2 bg-red-400 rounded-lg text-white hover:bg-red-600 transition-colors text-sm`}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => setIsAuthModalOpen(true)}
                      className={`${inter.className} px-6 py-2 bg-[#ddd92a] text-[#2d2a32] rounded-full hover:bg-[#2d2a32] hover:text-[#fafdf6] transition-all duration-300 text-sm font-medium`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Now
                    </motion.button>
                  )}
                </div>
                {isAuthenticated && (
                  <Link
                    href="/profile"
                    className="hidden lg:block"
                  >
                    <img
                      src={"/user-icon.png"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#ddd92a]"
                    />
                  </Link>
                )} 
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden flex flex-col space-y-1 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <motion.span
                className="w-6 h-0.5 bg-[#2d2a32] block"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
              />
              <motion.span
                className="w-6 h-0.5 bg-[#2d2a32] block"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-[#2d2a32] block"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
              />
            </motion.button>
            
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#2d2a32]/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-full bg-[#fafdf6] shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex flex-col h-full pt-20 px-6">
                {/* Mobile Menu Items */}
                <div className="space-y-6">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className={`${inter.className} block text-[#2d2a32] text-xl font-medium hover:text-[#ddd92a] transition-colors duration-300 w-full text-left`}
                      >
                        {item.name}
                      </button>
                    </motion.div>
                  ))}

                  {isAuthenticated && (
                    <motion.div
                      key="profile-mobile"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navItems.length * 0.15 }}
                    >
                      <Link
                        href="/profile"
                        className={`${inter.className} block text-[#2d2a32] text-xl font-medium hover:text-[#ddd92a] transition-colors duration-300`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </motion.div>
                  )}

                  {/* My Bookings Link for Authenticated Users */}
                  {isAuthenticated && user?.role !== "admin" && (
                    <motion.div
                      key="my-bookings-mobile"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navItems.length * 0.1 }}
                    >
                      <Link
                        href="/my-bookings"
                        className={`${inter.className} block text-[#2d2a32] text-xl font-medium hover:text-[#ddd92a] transition-colors duration-300`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                    </motion.div>
                  )}

                  {/* Admin Link for Admin Users */}
                  {isAuthenticated && user?.role === "admin" && (
                    <motion.div
                      key="admin-dashboard-mobile"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navItems.length * 0.1 }}
                    >
                      <Link
                        href="/admin"
                        className={`${inter.className} block text-[#2d2a32] text-xl font-medium hover:text-[#ddd92a] transition-colors duration-300`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Mobile Auth Section */}
                <div className="mt-auto pb-8">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <p
                          className={`${inter.className} text-[#2d2a32] text-lg font-medium`}
                        >
                          Welcome, {user?.name}
                        </p>
                        <p
                          className={`${inter.className} text-[#2d2a32]/60 text-sm`}
                        >
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={`${inter.className} w-full px-6 py-3 bg-red-500 text-[#fafdf6] rounded-full hover:bg-red-600 hover:text-[#2d2a32] transition-all duration-300 font-medium`}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className={`${inter.className} w-full px-6 py-3 bg-[#2d2a32] text-[#fafdf6] rounded-full hover:bg-[#ddd92a] hover:text-[#2d2a32] transition-all duration-300 font-medium`}
                    >
                      Book Now
                    </button>
                  )}

                  {/* Decorative Elements */}
                  <div className="flex space-x-2 justify-center mt-6">
                    <div className="w-2 h-2 bg-[#ddd92a] rounded-full opacity-60" />
                    <div className="w-2 h-2 bg-[#eae151] rounded-full opacity-60" />
                    <div className="w-2 h-2 bg-[#eeefa8] rounded-full opacity-60" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;