"use client"
import Link from "next/link"
import Image from "next/image"

export default function Section1() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-8 overflow-hidden relative"
      style={{ backgroundImage: "url('/bg_section1.svg')" }}
    >
      {/* Flying Crow Animations */}
      <div className="absolute top-10 left-0 w-full pointer-events-none">
        {/* First Crow - Using Next/Image for optimization */}
        <div className="absolute animate-fly1 left-[-15%] top-[50px] w-24 sm:w-32 md:w-40 z-[9999]">
          <Image
            src="/bird.gif"
            alt="Flying Crow 1"
            width={160}
            height={120}
            priority
            className="w-full h-auto"
            unoptimized={true} // Use unoptimized for GIFs to prevent Next.js from optimizing them
          />
        </div>
        
        {/* Second Crow - Using Next/Image for optimization */}
        <div className="absolute animate-fly2 left-[-15%] top-[100px] w-24 sm:w-32 md:w-40 z-[9999]">
          <Image
            src="/bird.gif"
            alt="Flying Crow 2"
            width={160}
            height={120}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Title Image */}
      <div className="relative z-10 max-w-4xl text-center space-y-12">
        <div className="flex justify-center mt-[24px] sm:mt-[-80px] md:mt-[40px]">
          <Image
            src="/TourCrowText.svg"
            alt="TourCrow text"
            width={1000}
            height={500}
            priority
            className="w-full h-auto max-w-3xl mx-auto opacity-0 animate-fadeIn"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8">
          <Link href="/host-trip" className="inline-block">
            <button 
              className="w-[200px] sm:w-auto bg-white hover:bg-[#fec90f] text-[#231f20] font-bold py-4 px-8 sm:px-12 rounded-full transition-colors duration-300 text-lg sm:text-xl border-2 border-black"
              aria-label="Host a Trip"
            >
              Host Trip
            </button>
          </Link>
          <Link href="/join-trip" className="inline-block">
            <button 
              className="w-[200px] sm:w-auto bg-white hover:bg-[#fec90f] text-[#231f20] font-bold py-4 px-8 sm:px-12 rounded-full transition-colors duration-300 text-lg sm:text-xl border-2 border-black"
              aria-label="Join a Trip"
            >
              Join Trip
            </button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        /* Prevent Horizontal Scroll */
        html, body {
          overflow-x: hidden;
        }
        
        /* Animation keyframes */
        @keyframes flyAcross {
          from {
            transform: translateX(-20%);
          }
          to {
            transform: translateX(110vw);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Animation classes */
        .animate-fly1 {
          animation: flyAcross 6s linear infinite;
          will-change: transform;
        }
        
        .animate-fly2 {
          animation: flyAcross 8s linear infinite;
          will-change: transform;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-in-out forwards;
        }
      `}</style>
    </section>
  )
}