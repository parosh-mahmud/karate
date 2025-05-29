// components/Hero.js
import Image from "next/image";
import Container from "./container";

export default function Hero() {
  return (
    <Container className="flex flex-wrap items-center py-20 md:py-32 bg-brandBackground dark:bg-brandTextPrimary font-header">
      {/* Left Column - Text Content */}
      <div className="w-full lg:w-1/2 lg:pr-10 xl:pr-12 mb-16 lg:mb-0">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-brandTextPrimary dark:text-brandBackground sm:text-5xl sm:leading-tight xl:text-6xl xl:leading-tight">
          Achieve Peak Performance with{" "}
          {/* Using brandAccent for light mode, brandAccentFocus (lighter sky) for dark mode for better visibility if needed */}
          <span className="text-brandAccent dark:text-brandAccentFocus">
            SELF DEFENCE!
          </span>
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-brandTextSecondary dark:text-slate-300 max-w-xl font-body">
          Discover the power of karate to enhance discipline, strength, and
          focus. Our training program offers effective, accessible ways to:
        </p>

        <ul className="mt-6 space-y-3">
          {[
            "Build Confidence",
            "Improve Physical Fitness",
            "Develop Mental Toughness",
          ].map((feature) => (
            <li
              key={feature}
              className="flex items-center text-md text-brandTextSecondary dark:text-slate-300 font-body"
            >
              <svg
                className="w-5 h-5 mr-3 flex-shrink-0 fill-brandAccentFocus dark:fill-brandAccent" // icon fill can be consistent or adapt
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-lg leading-relaxed text-brandTextSecondary dark:text-slate-300 max-w-xl font-body">
          Our Karate Mastery Program is designed by experts with over 20 years
          of experience. Transformative results await, whether you train
          in-person or online!
        </p>

        {/* h2 inherits font-header from Container */}
        <h2 className="mt-10 text-2xl font-bold text-brandTextSoft dark:text-slate-200 xl:text-3xl">
          More Strength, Confidence, Discipline – Start Today!
        </h2>

        <div className="mt-6 flex items-baseline space-x-3">
          <p className="text-xl font-semibold line-through text-brandTextMuted dark:text-slate-400 opacity-75 font-body">
            BDT 5000
          </p>
          {/* Using brandAccent for light mode, brandAccentFocus (lighter sky) for dark mode price */}
          <p className="text-3xl font-bold text-brandAccent dark:text-brandAccentFocus">
            BDT 3000
          </p>
          <p className="text-md font-medium text-brandTextInfo dark:text-slate-400 pb-1 font-body">
            (Promo: JKCOMBAT)
          </p>
        </div>

        <div className="mt-10">
          <a
            href="/admission"
            className="inline-block px-10 py-4 text-lg font-semibold rounded-lg shadow-lg
                       bg-brandAccent text-brandTextOnAccent 
                       hover:bg-brandAccentHover hover:shadow-xl 
                       focus:outline-none focus:ring-4 focus:ring-brandAccentFocus focus:ring-opacity-50 
                       transition-all duration-300 ease-in-out 
                       transform hover:-translate-y-1"
            // This button's explicit bg and text colors should work well in both light/dark modes
          >
            Join Now & Save 40%
          </a>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="w-full lg:w-1/2 flex items-center justify-center mt-12 lg:mt-0">
        <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/nirapod-lenden.firebasestorage.app/o/galleryImages%2Fd2e102e8-0844-4960-9a4f-613d3761b384-iphoneimage.jpg?alt=media&token=ee28b2be-b1d2-4ab3-bedf-f6210d1ee895"
            alt="Dynamic karate training session at JK Combat Academy with students practicing moves"
            width={1000}
            height={750}
            className="rounded-xl shadow-2xl object-cover w-full h-auto"
            priority
            quality={85}
          />
        </div>
      </div>
    </Container>
  );
}
