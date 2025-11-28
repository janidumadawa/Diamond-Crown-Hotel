// frontend/app/components/AboutUs.jsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { michroma, playwrite, inter } from "../../lib/fonts";

const AboutUs = () => {
  const backgroundImage = "./images/img-1.jpg";

  return (
    <div
      id="about"
      className="relative py-20 min-h-screen flex items-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-fixed bg-no-repeat z-0"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent backdrop-blur-[1px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className={`${michroma.className} text-4xl md:text-5xl font-bold text-[#fafdf6] mb-4`}
          >
            OUR STORY
          </h2>
          <div className="w-24 h-1 bg-[#ddd92a] mx-auto"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* right Content */}
          <motion.div
            className="bg-[#2d2a32a2] p-10 rounded-3xl shadow-lg "
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3
              className={`${michroma.className} text-2xl md:text-3xl font-bold text-[#fafdf6] mb-6`}
            >
              Where Sri Lankan Hospitality Meets Modern Luxury
            </h3>

            <div className="space-y-6 text-[#fafdf6]/90">
              <motion.p
                className="text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Nestled in the heart of Sri Lanka's vibrant landscape,{" "}
                <span className="text-[#ddd92a] font-semibold">
                  Diamond Crown Hotel
                </span>{" "}
                emerges as a sanctuary where ancient traditions blend seamlessly
                with contemporary elegance. For generations, our family has
                embraced the timeless Sri Lankan value of "Athithi Devo Bhava" -
                the guest is God - and we carry this sacred tradition forward
                into every aspect of your stay.
              </motion.p>

              <motion.p
                className="text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Our story began with a vision to create more than just a hotel,
                but a gateway to the soul of Sri Lanka. From the moment you step
                into our lobby, scented with native frangipani and cinnamon, to
                the personalized service that anticipates your every need, we
                invite you to experience the warmth and generosity that defines
                our island nation.
              </motion.p>

              <motion.p
                className="text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                Through our innovative reservation system, we've made the luxury
                of authentic Sri Lankan hospitality accessible to the world.
                Whether you're seeking adventure in our ancient cities,
                tranquility on our golden beaches, or the vibrant energy of our
                cultural festivals, Diamond Crown Hotel serves as your perfect
                sanctuary and starting point.
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-2 gap-6 mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#ddd92a] rounded-full"></div>
                <span
                  className={`${inter.className} text-[#fafdf6] font-medium`}
                >
                  24/7 Concierge
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#eae151] rounded-full"></div>
                <span
                  className={`${inter.className} text-[#fafdf6] font-medium`}
                >
                  Local Experiences
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#ddd92a] rounded-full"></div>
                <span
                  className={`${inter.className} text-[#fafdf6] font-medium`}
                >
                  Cultural Tours
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-[#eae151] rounded-full"></div>
                <span
                  className={`${inter.className} text-[#fafdf6] font-medium`}
                >
                  Spa & Wellness
                </span>
              </div>
            </motion.div>
          </motion.div>


          {/* left content */}
          <motion.div
            className="w-full h-auto rounded-3xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* 3 images grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              <img
                src="./images/aboutus1.jpg"
                alt="About Us 1"
                className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-300"
              />
              <img
                src="./images/aboutus2.jpg"
                alt="About Us 2"
                className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-300"
              />
              <img
                src="./images/aboutus3.jpg"
                alt="About Us 3"
                className="w-full h-full object-cover rounded-3xl col-span-2 hover:scale-105 transition-transform duration-300"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
