// frontend/app/components/Footer.jsx
"use client";
import { motion } from "framer-motion";
import { michroma, playwrite, inter } from "../../lib/fonts";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Hotel",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Rooms", href: "#rooms" },
        { name: "Amenities", href: "#amenities" },
        { name: "Gallery", href: "#gallery" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact", href: "#contact" },
      ]
    },
    {
      title: "Connect",
      links: [
        { name: "Facebook", href: "#" },
        { name: "Instagram", href: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-[#2d2a32] text-[#fafdf6]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/logo6.png"
                alt="Diamond Crown Hotel Logo"
                className="w-10 h-10 object-contain bg-white rounded-full p-1"
              />
              <div className={`${michroma.className} flex flex-col leading-none`}>
                <span className="text-[#fafdf6] font-bold text-sm tracking-tight">DIAMOND</span>
                <span className="text-[#ddd92a] font-bold text-xs tracking-wider">CROWN</span>
              </div>
            </div>
            <p className={`${inter.className} text-[#fafdf6]/70 text-sm leading-relaxed mb-6`}>
              Experience unparalleled luxury in the heart of Colombo. Where modern elegance meets authentic Sri Lankan hospitality.
            </p>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h3 className={`${inter.className} text-[#ddd92a] font-bold text-sm mb-4 tracking-wide`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      href={link.href}
                      className={`${inter.className} text-[#fafdf6]/70 hover:text-[#ddd92a] text-sm transition-colors duration-200 block py-1`}
                      whileHover={{ x: 2 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#fafdf6]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className={`${inter.className} text-[#fafdf6]/60 text-xs`}>
              © {currentYear} Diamond Crown Hotel. All rights reserved.
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;