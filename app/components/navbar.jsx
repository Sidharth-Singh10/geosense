import { Search, MapPin, Route, RefreshCcw } from "lucide-react";
import Image from 'next/image';
import PlaceAutocomplete from "./autocomplete";

export default function Navbar() {
    return (
        <nav className="bg-gray-700 flex items-center justify-between px-6 py-3 shadow-md rounded-full h-16 mx-auto w-[90%]">
            {/* Left Section - Search Bar */}
            <div className="flex items-center bg-gray-700 px-4 py-2 rounded-full w-1/3 mr-8">
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                <PlaceAutocomplete/>
            </div>

            {/* Center Section - Navigation Icons */}
            <div className="flex items-center space-x-10"> {/* Increased spacing */}
                <MapPin className="w-6 h-6 text-gray-600 hover:text-black transition duration-300 cursor-pointer" />
                <Route className="w-6 h-6 text-gray-600 hover:text-black transition duration-300 cursor-pointer" />
                <RefreshCcw className="w-6 h-6 text-gray-600 hover:text-black transition duration-300 cursor-pointer" />
            </div>

            {/* Right Section - Geosense Logo (Aligned to Rightmost Corner) */}
            <div className="flex items-center ml-auto">
                <Image className="w-16 h-16 text-[#6BA5B4]"
                    src="/geosense_logo.png"
                    width={80}
                    height={80}
                    alt="geosense" />
            </div>
        </nav>
    );
}
