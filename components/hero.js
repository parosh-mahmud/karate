import Image from "next/image";
import Container from "./container";

export default function Hero() {
  return (
    <Container className="flex flex-wrap items-center py-20 md:py-32">
      {/* Left Column */}
      <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
        <h1 className="text-4xl font-extrabold leading-snug tracking-tight text-gray-800 lg:text-5xl lg:leading-tight xl:text-6xl xl:leading-tight">
          Achieve Peak Performance with{" "}
          <span className="text-indigo-600">SELF DEFENCE!</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          Discover the power of karate to enhance discipline, strength, and
          focus. Our training program offers effective, accessible ways to:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li className="flex items-center">
            <svg
              className="w-5 h-5 text-indigo-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l5-5z" />
            </svg>
            Build Confidence
          </li>
          <li className="flex items-center">
            <svg
              className="w-5 h-5 text-indigo-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l5-5z" />
            </svg>
            Improve Physical Fitness
          </li>
          <li className="flex items-center">
            <svg
              className="w-5 h-5 text-indigo-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l5-5z" />
            </svg>
            Develop Mental Toughness
          </li>
        </ul>
        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          Our Karate Mastery Program is designed by experts with over 20 years
          of experience. Whether you’re training in-person or online, experience
          transformative results and become the best version of yourself!
        </p>
        <h2 className="mt-8 text-2xl font-bold text-indigo-600">
          More Strength, Confidence, and Discipline – Start Now!
        </h2>
        <div className="mt-6">
          <p className="inline-block text-lg font-semibold text-gray-700">
            <span className="line-through text-gray-400">BDT 5000</span>{" "}
            <span className="text-indigo-600">BDT 3000</span>{" "}
            <span className="text-sm text-gray-500">(use code: JKCOMBAT)</span>
          </p>
        </div>
        <div className="mt-8">
          <a
            href="/admission"
            className="px-8 py-4 text-lg font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 transition duration-300"
          >
            Join Now
          </a>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="relative w-full h-64 sm:h-96 lg:h-full">
          <Image
            src="https://res.cloudinary.com/dpudfjkoq/image/upload/c_scale,w_800/v1729612200/IMG_20221222_003514_221_acgg9h.jpg"
            alt="Karate Training"
            layout="responsive" // Changed from 'fill' to 'responsive'
            width={800} // Added width
            height={600} // Added height
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
    </Container>
  );
}
