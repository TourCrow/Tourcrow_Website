'use client'
import Image from "next/image";
import FadeContent from './FadeContent'; // Import the FadeContent component

const Section4 = () => {
  return (
    <div className="md:min-h-screen  pt-6 flex flex-col items-center">
      <FadeContent blur={true} duration={300} easing="ease-out" initialOpacity={0} delay={200} slideFrom="top">
        <h1 className="text-center text-black text-4xl sm:text-5xl md:text-6xl font-bold">
          Influencer Categories
        </h1>
      </FadeContent>

     

      <div className="grid grid-cols-2 md:grid-cols-4 place-items-center gap-y-8 h-full w-2/3 pt-5 lg:pt-24">
        {/* Travel influencer */}
        <FadeContent blur={true} duration={300} easing="ease-out" initialOpacity={0} slideFrom="top" delay={700}>
          <div className="w-full h-full text-center flex flex-col items-center">
            <Image
              src="/images/img1.svg"
              alt="Travel Influencers"
              priority={false}
              width={400}
              height={400}
              className="max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[180px] h-auto object-contain mt-28"
            />
          </div>
        </FadeContent>

        {/* Tech influencer */}
        <FadeContent blur={true} duration={300} easing="ease-out" initialOpacity={0} slideFrom="bottom" delay={700}>
          <div className="w-full h-full text-center flex flex-col items-center justify-end">
            <Image
              src="/images/img2.svg"
              alt="Tech Influencers"
              priority={false}
              width={400}
              height={400}
              className="max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[180px] h-auto object-contain mb-28"
            />
          </div>
        </FadeContent>

        {/* Fitness influencer */}
        <FadeContent blur={true} duration={300} easing="ease-out" initialOpacity={0} slideFrom="top" delay={700}>
          <div className="w-full h-full text-center flex flex-col items-center">
            <Image
              src="/images/img3.svg"
              alt="Fitness Influencers"
              priority={false}
              width={400}
              height={400}
              className="max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[180px] h-auto object-contain mt-28"
            />
          </div>
        </FadeContent>

        {/* Fashion influencer */}
        <FadeContent blur={true} duration={300} easing="ease-out" initialOpacity={0} slideFrom="bottom" delay={700}>
          <div className="w-full h-full text-center flex flex-col items-center justify-end">
            <Image
              src="/images/img4.svg"
              alt="Fashion Influencers"
              priority={false}
              width={400}
              height={400}
              className="max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[180px] h-auto object-contain mb-28"
            />
          </div>
        </FadeContent>
      </div>
    </div>
  );
};

export default Section4;
