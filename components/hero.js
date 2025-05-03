import Image from "next/image"; // Assuming next/image is used
import Container from "./container"; // Assuming Container component exists

// Import color constants (adjust path if necessary)
import { colors } from "../utils/colors"; // Example path, adjust as needed

export default function Hero() {
  return (
    <>
      {/* Include Google Font - Poppins. In Next.js, prefer next/font */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap");
        /* Apply Poppins globally or scope it if needed */
        .font-poppins {
          font-family: "Poppins", sans-serif;
        }
      `}</style>

      {/* Apply Poppins font class to the container */}
      <Container
        className={`flex flex-wrap items-center py-20 md:py-32 font-poppins bg-[${colors.background}]`}
      >
        {/* Left Column - Text Content */}
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 pr-4 lg:pr-10">
          {" "}
          {/* Added padding right */}
          <h1
            className={`text-4xl font-extrabold leading-snug tracking-tight text-[${colors.textPrimary}] lg:text-5xl lg:leading-tight xl:text-6xl xl:leading-tight`}
          >
            Achieve Peak Performance with{" "}
            <span className={`text-[${colors.primary}]`}>SELF DEFENCE!</span>
          </h1>
          <p
            className={`mt-6 text-lg leading-relaxed text-[${colors.textSecondary}]`}
          >
            Discover the power of karate to enhance discipline, strength, and
            focus. Our training program offers effective, accessible ways to:
          </p>
          {/* Feature List */}
          <ul className={`mt-4 space-y-2 text-[${colors.textSecondary}]`}>
            <li className="flex items-center">
              <svg
                className={`w-5 h-5 text-[${colors.primary}] mr-2 flex-shrink-0`} // Use primary color
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd" // Added fillRule for better SVG rendering
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" // Corrected checkmark path slightly
                  clipRule="evenodd"
                />
              </svg>
              Build Confidence
            </li>
            <li className="flex items-center">
              <svg
                className={`w-5 h-5 text-[${colors.primary}] mr-2 flex-shrink-0`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Improve Physical Fitness
            </li>
            <li className="flex items-center">
              <svg
                className={`w-5 h-5 text-[${colors.primary}] mr-2 flex-shrink-0`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Develop Mental Toughness
            </li>
          </ul>
          <p
            className={`mt-6 text-lg leading-relaxed text-[${colors.textSecondary}]`}
          >
            Our Karate Mastery Program is designed by experts with over 20 years
            of experience. Transformative results await, whether you train
            in-person or online!
          </p>
          {/* Callout/Sub-heading */}
          <h2 className={`mt-8 text-2xl font-bold text-[${colors.primary}]`}>
            More Strength, Confidence, Discipline – Start Today!
          </h2>
          {/* Pricing/Offer */}
          <div className="mt-6">
            <p className="inline-block text-lg font-semibold text-[${colors.textPrimary}]">
              <span
                className={`line-through text-[${colors.textSecondary}] opacity-70`}
              >
                BDT 5000
              </span>{" "}
              <span className={`text-[${colors.primary}] text-xl font-bold`}>
                BDT 3000
              </span>{" "}
              <span
                className={`text-sm text-[${colors.textSecondary}] font-medium`}
              >
                (Promo: JKCOMBAT)
              </span>
            </p>
          </div>
          {/* Call to Action Button */}
          <div className="mt-8">
            <a
              href="/admission" // Link to your admission page
              className={`inline-block px-8 py-4 text-lg font-medium text-[${colors.textLight}] bg-[${colors.primary}] rounded-md shadow-lg hover:bg-[${colors.primaryHover}] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${colors.primary}] transition duration-300 ease-in-out transform hover:-translate-y-1`} // Added hover effect
            >
              Join Now & Save 40%
            </a>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="w-full lg:w-1/2 flex items-center justify-center mt-10 lg:mt-0">
          {/* Ensure the container div allows the image to scale */}
          <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
            {" "}
            {/* Adjusted max-width */}
            <Image
              src="https://res.cloudinary.com/dpudfjkoq/image/upload/c_scale,w_800/v1729612200/IMG_20221222_003514_221_acgg9h.jpg"
              alt="Karate training session at JK Combat Academy" // More descriptive alt text
              width={800} // Provide intrinsic width
              height={600} // Provide intrinsic height
              className="rounded-lg shadow-xl object-cover w-full h-auto" // Added object-cover, w-full, h-auto
              priority // Load image eagerly if it's above the fold
              quality={85} // Slightly adjust quality
            />
          </div>
        </div>
      </Container>
    </>
  );
}
