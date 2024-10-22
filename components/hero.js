import Image from "next/image";
import Container from "./container";

export default function Hero() {
  return (
    <>
      <Container className="flex flex-wrap">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Achieve Peak Performance with Karate Training!
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Discover the power of karate to enhance discipline, strength, and
              focus. Our training program offers effective, accessible ways to:
            </p>
            <ul className="list-disc list-inside text-gray-500 dark:text-gray-300">
              <li>Build Confidence</li>
              <li>Improve Physical Fitness</li>
              <li>Develop Mental Toughness</li>
            </ul>
            <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Our Karate Mastery Program is designed by experts with over 20
              years of experience. Whether you’re training in-person or online,
              experience transformative results and become the best version of
              yourself!
            </p>
            <h2 className="text-2xl font-bold text-indigo-600">
              More Strength, Confidence, and Discipline – start now!
            </h2>
            <p className="py-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
              <span className="line-through">$299</span> $249{" "}
              <span className="text-xs">(use code: KARATEPOWER)</span>
            </p>
            <a
              href="#join"
              className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md"
            >
              Join Now
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="hidden lg:block">
            {/* Wrapping Image in a div with the desired styling */}
            <div className="border-4 border-indigo-600 rounded-lg shadow-lg">
              <Image
                src="https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612107/DSC07263_yinuwi.jpg"
                width="800"
                height="500"
                alt="Hero Illustration"
                layout="intrinsic"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
