'use client';

import dynamic from 'next/dynamic';
import Image from "next/image";

const FadeContent = dynamic(() => import('@/components/FadeContent'), {
  ssr: false,
});

export default function Section2() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-8 overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg2.png"
          alt="Background"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
          decoding="async"
        />
      </div>
      
      <div className="container relative z-10 w-full px-4 sm:px-8 lg:px-20 py-2">
        {/* Row 1: Text on Left, Illustration on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 md:gap-x-2 lg:gap-x-16 items-center mb-16 relative mt-16 md:mt-0 lg:mt-0">
          <FadeContent slideFrom="left">
            <div className="space-y-4 text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#ffcd13]">
                Why Travelers Love Us
              </h2>
              <p className="sm:text-2xl md:text-2xl lg:text-2xl font-medium text-black">
                Hassle-free trips | Exclusive experiences | Meet your favorite influencers
              </p>
            </div>
          </FadeContent>

          <FadeContent slideFrom="right">
            <div className="flex justify-center md:justify-end">
              <div className="relative w-[300px] h-[300px]">
                <Image
                  src="/section2_illustration1.svg"
                  alt="Traveler with luggage"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  decoding="async"
                />
              </div>
            </div>
          </FadeContent>
        </div>

        {/* Row 2: Text on Left (mobile) / Right (desktop), Illustration on Right (mobile) / Left (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-2 lg:gap-x-16 items-center mb-16">
          <div className="order-2 md:order-1">
            <FadeContent slideFrom="left">
              <div className="flex justify-center md:justify-start">
                <div className="relative w-[300px] h-[300px]">
                  <Image
                    src="/section2_illustration2.svg"
                    alt="Excited traveler with luggage"
                    fill
                    loading="lazy"
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    decoding="async"
                  />
                </div>
              </div>
            </FadeContent>
          </div>

          <div className="order-1 md:order-2">
            <FadeContent slideFrom="right">
              <div className="space-y-6 text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#ffcd13]">
                  Travel Beyond Screens!
                </h2>
                <p className="sm:text-2xl md:text-2xl lg:text-2xl font-medium text-black">
                  Bridging the gap between influencers and you | Once in a lifetime experience | Premium and well-organized | safety and comfort ensured.
                </p>
              </div>
            </FadeContent>
          </div>
        </div>

        {/* Row 3: Text on Left, Illustration on Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-9 items-center">
          <FadeContent slideFrom="left">
            <div className="space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#ffcd13]">
                What's in it for Customers?
              </h2>
              <p className="sm:text-2xl md:text-2xl lg:text-2xl font-medium text-black">
                Curated itineraries | Exclusive access | Professional photography and content creation opportunities.
              </p>
            </div>
          </FadeContent>

          <FadeContent slideFrom="right">
            <div className="flex justify-center md:justify-end">
              <div className="relative w-[300px] h-[300px]">
                <Image
                  src="/section2_illustration3.svg"
                  alt="Traveler with backpack and suitcase"
                  fill
                  loading="lazy"
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  decoding="async"
                />
              </div>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}