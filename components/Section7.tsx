import Image from "next/image"
import React from 'react';
import Link from "next/link"
import { FaLinkedin, FaInstagram } from "react-icons/fa"

export default function Section7() {
  return (
    <main className="h-auto text-white relative bg-black pb-12">
      {/* Indian monuments silhouette at the bottom */}
      <div className="absolute -top-12 md:-top-24 left-0 right-0">
        <Image
          src="/indiastencil.png"
          alt="India Stencil"
          priority={false}
          width={1920}
          height={100}
          className="w-full h-[50px] md:h-[100px] object-cover"
        />
      </div>
      <div className="bg-black absolute inset-0 z-0"></div>
      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center lg:gap-24">
          {/* Logo + Travel Section */}
          <div className="flex flex-col md:flex-row items-center md:gap-8 lg:gap-16 space-y-4 md:space-y-0 md:space-x-6">
            <Image
              src="/Logo.svg"
              alt="Logo"
              priority={false}
              width={100}
              height={100}
              className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
            />
            <div className="space-y-2 text-center md:text-left">
              <h2 className="font-semibold text-lg">Travel Beyond Screens</h2>
              <div className="flex flex-col"></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 lg:gap-20 text-center md:text-left mt-6 md:mt-0">
            <div className="space-y-2">
              <h2 className="font-semibold text-lg">About</h2>
              <ul className="space-y-1 text-sm text-white">
                <li>
                  <Link href="/about" className="hover:text-[#fec90f]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#fec90f]">
                    New & Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-semibold text-lg">Company</h2>
              <ul className="space-y-1 text-sm text-white">
                <li>
                  <Link href="#" className="hover:text-[#fec90f]">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#fec90f]">
                    Join our Influencer's Club
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="font-semibold text-lg">Support</h2>
              <ul className="space-y-1 text-sm text-white">
                <li>
                  <Link href="#" className="hover:text-[#fec90f]">
                    FAQs
                  </Link>
                </li>
                {/* <li>
                  <Link href="#" className="hover:text-[#fec90f]">
                    Contact Us
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </nav>

        {/* Social Media Icons */}
        {/* <div className="flex justify-center mt-0 gap-6 ">
          <Link href="https://www.linkedin.com/company/tourcrowtravel/" target="_blank">
            <FaLinkedin className="text-white hover:text-[#fec90f] text-2xl" />
            </Link>
            <Link href="https://www.instagram.com/tourcrow/" target="_blank">
              <FaInstagram className="text-white hover:text-[#fec90f] text-2xl" />
            </Link>
        </div> */}

        <div className="flex flex-col md:flex-row justify-center items-center md:gap-20 gap-6 py-6  text-white text-center">
          {/* Call Us */}
          <div className="border-r border-white px-6 md:px-10">
            <p className="text-sm mb-1">Call Us</p>
            <p className="text-xl font-medium">+91 95827 48945</p>
          </div>

          {/* Email Us */}
          <div className="border-r border-white px-6 md:px-10">
            <p className="text-sm mb-1">Email Us</p>
            <p className="text-xl font-medium">collaborations.tourcrow@gmail.com</p>
          </div>

          {/* Follow Us */}
          <div className="px-6 md:px-10">
            <p className="text-sm mb-1">Follow Us</p>
            <div className="flex justify-center gap-4 mt-1">
              <Link href="https://www.linkedin.com/company/tourcrowtravel/" target="_blank">
                <FaLinkedin className="text-white hover:text-[#fec90f] text-2xl" />
              </Link>
              <Link href="https://www.instagram.com/tourcrow/" target="_blank">
                <FaInstagram className="text-white hover:text-[#fec90f] text-2xl" />
              </Link>
            </div>
          </div>
        </div>

          {/* copyright */}
        {/* <p className="text-sm text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} TourCrow Travel. All rights reserved.
        </p> */}


      </div>
    </main>
  )
}