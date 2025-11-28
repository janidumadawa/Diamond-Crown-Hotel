// frontend/app/components/Hero.jsx
"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { michroma, playwrite } from './../../lib/fonts';

const Hero = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Enhanced video loading handler
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        console.log('Video loaded successfully');
        setIsVideoLoaded(true);
      };
      
      const handleError = () => {
        console.error('Video failed to load');
        setVideoError(true);
        setIsVideoLoaded(true); // Show fallback content
      };

      const handleCanPlayThrough = () => {
        console.log('Video can play through without stopping');
        video.play().catch(e => console.log('Autoplay prevented:', e));
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      video.addEventListener('canplaythrough', handleCanPlayThrough);
      
      // Preload video more aggressively
      video.load();
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, []);

  // Parallax effects
  const yHeading = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const ySubtitle = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Video Background with Enhanced Loading State */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale: videoScale }}
      >
        {/* Enhanced loading placeholder with background image fallback */}
        {!isVideoLoaded && (
          <div 
            className="w-full h-full bg-[#fafdf6] flex items-center justify-center relative"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="text-[#2d2a32] flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-[#ddd92a] border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm">Loading...</p>
            </div>
          </div>
        )}
        
        {/* Video element with enhanced attributes */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto" // Changed from "metadata" to "auto" for faster loading
          disablePictureInPicture
          disableRemotePlayback
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isVideoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
          }`}
          poster="/images/video-poster.jpg" 
        >
          <source src="/video/video2.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback background if video errors */}
        {videoError && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/fallback-hero.jpg)'
            }}
          />
        )}
        
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        
        {/* Brand color overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ddd92a]/5 via-[#eae151]/10 to-[#eeefa8]/5 mix-blend-soft-light"></div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-16">
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
        >
          <motion.h1
            className={`${michroma.className} text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 drop-shadow-2xl tracking-tight`}
            style={{ y: yHeading }}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 60,
              },
              visible: { 
                opacity: 1, 
                y: 0,
              }
            }}
            transition={{
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99]
            }}
          >
            {"HOTEL DIAMOND CROWN".split("  ").map((char, index) => ( // Fixed: split("") not split("  ")
              <motion.span
                key={index}
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 60,
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                  }
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut"
                }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className={`${playwrite.className} text-lg sm:text-2xl lg:text-2xl text-white mt-4 sm:mt-6 lg:mt-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg tracking-wide`}
            style={{ y: ySubtitle }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Where luxury meets comfort in the heart of the city
          </motion.p>


          {/* book now button */}
          {/* <motion.div
            className="mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <a
              href="#rooms"
              className="inline-block bg-[#ddd92a] hover:bg-[#c4c127] text-[#2d2a32] font-semibold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
            >
              Book Now
            </a>
          </motion.div> */}
          
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;