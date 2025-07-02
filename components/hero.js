// components/Hero.js
import Image from "next/image";
import Container from "./container";

export default function Hero() {
  return (
    <Container className="flex flex-wrap items-center py-20 md:py-32 bg-brandBackground dark:bg-brandTextPrimary font-header">
      {/* Left Column – Welcome Text */}
      <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-brandTextPrimary dark:text-brandBackground leading-tight">
          Welcome to <br />
          <span className="text-brandAccent dark:text-brandAccentFocus">
            JK Combat Academy
          </span>
        </h1>

        <div className="mt-6 space-y-6 text-lg text-brandTextSecondary dark:text-slate-300 font-body max-w-xl">
          <p>Bangladesh’s first dedicated Martial Arts and Fitness Center.</p>
          <p>
            At JK Combat Academy, we specialize in strength and functional
            training, Judo, Karate, and MMA. Our modern, fully equipped
            facilities and expert trainers ensure you receive the highest
            standard of instruction and support.
          </p>
          <p>
            We offer customized, one-on-one training programs designed to help
            both men and women build strength, skill, and confidence in a safe
            and motivating environment.
          </p>
        </div>

        <div className="mt-10">
          <a
            href="/admission"
            className="inline-block px-8 py-4 text-lg font-semibold rounded-lg shadow-lg
                       bg-brandAccent text-brandTextOnAccent 
                       hover:bg-brandAccentHover hover:shadow-xl 
                       focus:outline-none focus:ring-4 focus:ring-brandAccentFocus focus:ring-opacity-50 
                       transition-transform duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Join Now
          </a>
        </div>
      </div>

      {/* Right Column – Hero Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <div className="relative w-full max-w-md">
          <Image
            // src="https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/hero.png?alt=media&token=d5c3510f-e6ba-4c72-84da-86d915b9f04a"
            src="https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/IMG_8698.png?alt=media&token=15d11040-af6a-4377-998b-cfa5aaae6c95"
            alt="Students training in martial arts at JK Combat Academy"
            width={800}
            height={600}
            className="rounded-xl shadow-2xl object-cover"
            priority
            quality={85}
          />
        </div>
      </div>
    </Container>
  );
}
