"use client"; // Add this to make it a client component

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the mobile menu

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-5 bg-gradient-to-b from-black/50 to-transparent">
      <nav className="max-w-4xl mx-auto">
        <div className="hidden md:flex justify-center">
          <div className="border-2 border-brand-yellow rounded-full px-12 py-2 bg-black/80">
            {/* Navigation links */}
            <ul className="flex space-x-14 text-brand-yellow items-center">
              <li>
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <Image
                    src="/Logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className=""
                  />
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-80 transition-opacity">
                  About
                </Link>
              </li>
              <li>
                <Link href="/join-trip" className="hover:opacity-80 transition-opacity">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/join-trip" className="hover:opacity-80 transition-opacity">
                  Places
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Responsive) */}
      <div className="md:hidden flex justify-between items-center">
        {/* Hamburger icon for mobile */}
        <button
          className="text-brand-black hover:text-brand-yellow transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <span className="text-2xl">X</span> : <span className="text-2xl"><Image
                    src="/Logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className=""
                  /></span>}
        </button>

        {/* Mobile Navigation Links */}
        <div
          className={`${isOpen ? "block" : "hidden"
            } absolute top-16 left-0 right-0 bg-black/80 p-4`}
        >
          <ul className="flex flex-col items-center space-y-6 text-brand-yellow">
            <li>
              <Link href="/" className="hover:opacity-80 transition-opacity">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:opacity-80 transition-opacity">
                About
              </Link>
            </li>
            <li>
              <Link href="/join-trip" className="hover:opacity-80 transition-opacity">
                Discover
              </Link>
            </li>
            <li>
              <Link href="/join-trip" className="hover:opacity-80 transition-opacity">
                Places
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;