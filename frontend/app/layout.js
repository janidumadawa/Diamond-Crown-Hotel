import "./globals.css";
import localFont from "next/font/local";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "./components/Navbar";

const michroma = localFont({
  src: "../public/fonts/Michroma-Regular.ttf",
  display: "swap",
  variable: "--font-michroma",
});

const Bbhsans = localFont({
  src: "../public/fonts/BBHSansBartle-Regular.ttf",
  display: "swap",
  variable: "--font-bbh",
});

const smooch = localFont({
  src: "../public/fonts/SmoochSans-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-smooch",
});

export const metadata = {
  title: "Diamond Crown Hotel",
  description: "Luxury hotel in the heart of the city",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${michroma.variable} ${Bbhsans.variable} ${smooch.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}