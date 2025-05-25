import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showLogo?: boolean;
}

export function AuthLayout({ children, title, subtitle, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-yellow/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle, ${tailwindColors.brandYellow}20 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Logo Section */}
        {showLogo && (
          <div className="mb-8 text-center animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-brand-dark" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-brand-yellow">TourCrow</h1>
            <p className="text-gray-400 text-sm">Your Travel Companion</p>
          </div>
        )}

        {/* Main Auth Card */}
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/5 via-transparent to-brand-yellow/5 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                <p className="text-gray-400">{subtitle}</p>
              </div>
              
              {children}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2024 TourCrow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

// Tailwind colors for dynamic use
const tailwindColors = {
  brandYellow: '#fec90f',
  brandDark: '#231f20'
};
