import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
    const [animate, setAnimate] = useState(false);
    const [contentChanged, setContentChanged] = useState(false);
    const [rotating, setRotating] = useState(false); // ✅ Fix: Declare rotating state

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
                transition={{ duration: 1 }}
            >
                {!contentChanged ? (
                    <>
                        <div className="flex justify-center">
                            <Image src="/geosense_logo.png" width={100} height={100} alt="geosense" />
                        </div>
                        {/* Logo */}
                        <div className="flex justify-center mb-4 mt-[-24]">
                            <Image src="/aa.svg" width={500} height={100} alt="geosense" />
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
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-start ml-12">
                            {/* Heading */}
                            <div className="flex justify-center mb-4 mt-16">
                                <Image src="/ab.svg" width={500} height={100} alt="geosense" />
                            </div>
                            <div className="w-80 h-1 bg-blue-500 mb-12"></div>

                            <p className="text-xl italic">GeoSense is a fast and accurate online tool for measuring land area</p>
                            <p className="text-xl italic">effortlessly. Just enter a location and get instant results—no complex</p>
                            <p className="text-xl italic">tools or calculations needed. Whether for real estate, agriculture, or</p>
                            <p className="text-xl italic">urban planning, GeoSense makes land measurement simple and precise.</p>

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

            {/* Moving & Rotating Globe */}
            <motion.div
                className="mt-24"
                initial={{ x: 0, y: 0, rotate: 0 }}
                animate={animate ? { x: "50%", y: "-60%" } : {}}
                transition={{ duration: 1 }}
                onAnimationComplete={() => setRotating(true)} // ✅ Fix: Start rotating after moving
            >
                <motion.div
                    animate={rotating ? { rotate: 360 } : {}}
                    transition={rotating ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                >
                    <Image
                        src="https://freesvg.org/img/3d-Earth-Globe.png"
                        alt="Earth view from space"
                        height={600}
                        width={600}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
