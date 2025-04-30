"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./components/user_context";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
            draggable
          />
          <APIProvider
            apiKey={"AIzaSyCBUWqISO_DOQUKhwb7q09wQteK87WOEec"}
            libraries={["places"]}
          >
            {children}
            <div id="navC" className=" z-[999]">
              <Sidebar />
            </div>
          </APIProvider>
        </UserProvider>
      </body>
    </html>
  );
}
