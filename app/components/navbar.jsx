"use client";
import { Search, MapPin, Route, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PlaceAutocomplete from "./autocomplete";
import { useUserContext } from "./user_context";

export default function Navbar() {
  const { overlayOn, setOverlayOn } = useUserContext();

  return (
    <nav className="bg-transparent flex items-center justify-between px-6 py-3 shadow-md rounded-full h-16 mx-auto w-[90%]">
      {/* Left Section - Search Bar */}
      <div className="flex items-center bg-gray-700 px-4 py-2 rounded-full w-1/3 mr-8">
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <PlaceAutocomplete />
      </div>

      {/* Center Section - Navigation Icons */}
      <div className="flex items-center space-x-10">
        <MapPin className="w-6 h-6 text-gray-600 hover:text-black transition duration-300 cursor-pointer" />
        <Route
          className={`w-6 h-6 cursor-pointer transition duration-300 ${
            overlayOn ? "text-blue-500" : "text-gray-600 hover:text-black"
          }`}
          onClick={() => setOverlayOn((prev) => !prev)}
        />
        <RefreshCcw className="w-6 h-6 text-gray-600 hover:text-black transition duration-300 cursor-pointer" />
      </div>

      {/* Right Section - Geosense Logo */}
      <div className="flex items-center ml-auto">
        <Link href="/">
          <Image
            className="w-16 h-16 cursor-pointer"
            src="/geosense_logo.png"
            width={80}
            height={80}
            alt="geosense"
          />
        </Link>
      </div>
    </nav>
  );
}
