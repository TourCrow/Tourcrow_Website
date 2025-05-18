"use client"; // Add this to make it a client component

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the mobile menu
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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

      {/* User Profile and Authentication Links */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {user ? (
          <>
            <Link href="/profile" className="ml-2 px-4 py-1 rounded-full bg-brand-yellow text-black font-semibold shadow hover:bg-yellow-400 transition-colors">
              <span className="inline-block align-middle mr-1">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2"/></svg>
              </span>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-1 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-colors flex items-center"
            >
              <span className="inline-block align-middle mr-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M16 17l5-5m0 0l-5-5m5 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h4a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="ml-2 px-4 py-1 rounded-full bg-brand-yellow text-black font-semibold shadow hover:bg-yellow-400 transition-colors flex items-center">
              <span className="inline-block align-middle mr-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M15 12H3m0 0l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="17" cy="12" r="4" stroke="currentColor" strokeWidth="2"/></svg>
              </span>
              Login
            </Link>
            <Link href="/signup" className="ml-2 px-4 py-1 rounded-full bg-black text-brand-yellow font-semibold shadow hover:bg-gray-900 transition-colors flex items-center border border-brand-yellow">
              <span className="inline-block align-middle mr-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2"/><path d="M12 12v4m2-2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;