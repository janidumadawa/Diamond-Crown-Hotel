// frontend/app/page.js
"use client";
import { useAuth } from '../contexts/AuthContext';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Rooms from './components/Rooms';
import Amenities from './components/Amenities';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import UserDashboard from './components/Dashboard/UserDashboard';
import Footer from './components/Footer';
import ChatPage from './chat/page';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative">
            
      <section id="home">
        <Hero />
      </section>

      <section id="about">
        <AboutUs />
      </section>

      <section id="rooms">
        <Rooms />
      </section>

      {/* User Dashboard - Only show when user is authenticated */}
      {/* {isAuthenticated && (
        <section id="dashboard" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UserDashboard />
          </div>
        </section>
      )} */}

      <section id="amenities">
        <Amenities />
      </section>

      <section id="gallery">
        <Gallery />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <section id="chat">
        <ChatPage />
      </section>

      <Footer />
    </div>
  );
}