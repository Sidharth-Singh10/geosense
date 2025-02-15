import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
    const [animate, setAnimate] = useState(false);
    const [contentChanged, setContentChanged] = useState(false);

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => setContentChanged(true), 1000); // Change content after animation
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
            {/* Content */}
            <motion.div
                className="relative text-center text-white px-6"
                animate={animate ? { x: "-50%", y: "40%" } : { x: 0, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    {!contentChanged ? (
                        <div className={`flex flex-col transition-opacity duration-1000 ${animate ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="flex justify-center mt-24">
                                <Image
                                    src="/geosense_logo.png"
                                    width={100}
                                    height={100}
                                    alt="geosense"
                                />
                            </div>
                            {/* Logo */}
                            <div className="flex justify-center mb-4 mt-[-24]">
                                <Image
                                    src="/aa.svg"
                                    width={500}
                                    height={100}
                                    alt="geosense"
                                />
                            </div>

                            {/* Heading */}
                            <p className="text-xl italic">Effortless Land Measurement at Your</p>
                            <p className="text-xl italic">Fingertips!</p>

                            {/* CTA Button */}
                            <button
                                className="mt-12 bg-white text-black text-lg font-medium px-6 py-3 rounded-full hover:bg-gray-300 transition"
                                onClick={handleClick}
                            >
                                Learn More →
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={`flex flex-col items-start ml-12 transition-opacity duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                                {/* Heading */}
                                <div className="flex justify-center mb-4 mt-16">
                                    <Image
                                        src="/ab.svg"
                                        width={500}
                                        height={100}
                                        alt="geosense"
                                    />
                                </div>
                                <div className="w-80 h-1 bg-blue-500 mb-12"></div>

                                <p className="text-xl italic">GeoSense is a fast and accurate online tool for measuring land</p>
                                <p className="text-xl italic">area effortlessly. Just enter a location and get instant </p>
                                <p className="text-xl italic">results—no complex tools or calculations needed. Whether </p>
                                <p className="text-xl italic">for real estate, agriculture, or urban planning, GeoSense </p>
                                <p className="text-xl italic">makes land measurement simple and precise.</p>

                                {/* CTA Button */}
                                <Link href="/globe">
                                    <button className="mt-6 bg-blue-500 text-white text-lg font-medium px-6 py-3 rounded-full hover:bg-blue-600 transition">
                                        Get Started →
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>

            <motion.div
                className={animate ? 'mt-24' : 'mt-32'}
                animate={animate ? { rotate: 90, x: "60%", y: "-60%" } : { rotate: 0, x: 0, y: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            >
                <Image
                    src="https://freesvg.org/img/3d-Earth-Globe.png"
                    alt="Earth view from space"
                    height={600}
                    width={600}
                />
            </motion.div>
        </div>
    );
}
