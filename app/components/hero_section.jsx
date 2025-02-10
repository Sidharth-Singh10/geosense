import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black bg-cover bg-center bg-no-repeat relative overflow-hidden">
            <div className="relative z-10 container mx-auto px-6 lg:px-20 py-8">
                {/* Centered Logo */}
                <div className="flex justify-center items-center mb-12">
                    <Image className="w-36 h-36 text-[#6BA5B4]"
                        src="/geosense_logo.png"
                        width={150}
                        height={150}
                        alt="geosense" />
                </div>

                {/* Main Content (Left-Aligned) */}
                <div className="max-w-3xl text-left">
                    <h1 className="text-blue-500 text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
                        Measure <br />
                        land area <br />
                        easily with
                    </h1>
                    <div className="text-white text-6xl md:text-7xl lg:text-8xl font-semibold font-serif mb-12">geosense</div>

                    {/* CTA Button */}
                    <Link
                        href="/globe"
                        className="inline-block border-2 border-white text-white text-xl md:text-2xl px-12 font-semibold py-4 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
                    >
                        GET STARTED →
                    </Link>
                </div>
            </div>

            {/* Earth Image - Positioned to the right */}
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-full opacity-80">
                <Image
                    src="/bg.jpg" // Replace with actual image path
                    alt="Earth view from space"
                    width={1800}
                    height={2000}
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    )
}
