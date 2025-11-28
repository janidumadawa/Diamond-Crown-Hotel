// frontend/lib/fonts.js
import localFont from "next/font/local";

export const michroma = localFont({
  src: "../public/fonts/Michroma-Regular.ttf",
  display: "swap",
  variable: "--font-michroma",
});

export const Bbhsans = localFont({
  src: "../public/fonts/BBHSansBartle-Regular.ttf",
  display: "swap",
  variable: "--font-bbh",
});

export const smooch = localFont({
  src: "../public/fonts/SmoochSans-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-smooch",
});

export const inter = localFont({
  src: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
  display: "swap",
  variable: "--font-inter",
});

export const playwrite = localFont({
  src: "../public/fonts/PlaywriteUSModern-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-playwrite",
});