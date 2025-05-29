// components/YourComponentName.js (Please rename this file and component appropriately)
"use client";

import Image from "next/image";
import Link from "next/link"; // Assuming onEnrollClick might navigate or open a modal

// Heroicons v1 (outline) - Make sure you have @heroicons/react installed
import {
  ShieldCheckIcon,
  AcademicCapIcon, // For Expert Instructors & Mental Toughness (or choose others)
  SparklesIcon, // Alternative for "Expert" or "Comprehensive"
  HeartIcon,
  LightningBoltIcon, // Alternative for "Mental Toughness" or "Dynamic"
} from "@heroicons/react/outline";

// Feature card data for easier management
const features = [
  {
    title: "Comprehensive Training",
    description:
      "Our academy offers a wide range of combat techniques, from striking to grappling, ensuring you're prepared for any situation.",
    Icon: ShieldCheckIcon, // Or SparklesIcon
    iconColor: "text-brandAccent dark:text-brandAccentFocus", // Using your accent color
  },
  {
    title: "Expert Instructors",
    description:
      "Learn from seasoned professionals with years of experience in various martial arts and real-world applications.",
    Icon: AcademicCapIcon,
    iconColor: "text-brandAccent dark:text-brandAccentFocus",
  },
  {
    title: "Mental Toughness",
    description:
      "Develop not just physical strength, but also mental resilience and quick decision-making skills.",
    Icon: LightningBoltIcon, // Or BrainIcon equivalent from Heroicons if available
    iconColor: "text-brandAccent dark:text-brandAccentFocus",
  },
  {
    title: "Fitness & Health",
    description:
      "Improve your overall fitness, flexibility, and cardiovascular health through our intensive training programs.",
    Icon: HeartIcon,
    iconColor: "text-brandAccent dark:text-brandAccentFocus",
  },
];

const facilityImages = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/nirapod-lenden.firebasestorage.app/o/galleryImages%2Fd2e102e8-0844-4960-9a4f-613d3761b384-iphoneimage.jpg?alt=media&token=ee28b2be-b1d2-4ab3-bedf-f6210d1ee895",
    alt: "Spacious Training Mat Area",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/nirapod-lenden.firebasestorage.app/o/galleryImages%2Fd2e102e8-0844-4960-9a4f-613d3761b384-iphoneimage.jpg?alt=media&token=ee28b2be-b1d2-4ab3-bedf-f6210d1ee895", // Replace with different image
    alt: "Modern Fitness Equipment Zone",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/nirapod-lenden.firebasestorage.app/o/galleryImages%2Fd2e102e8-0844-4960-9a4f-613d3761b384-iphoneimage.jpg?alt=media&token=ee28b2be-b1d2-4ab3-bedf-f6210d1ee895", // Replace with different image
    alt: "Dedicated Sparring Ring",
  },
];

export default function LandingPageContent({ onEnrollClick }) {
  return (
    <div className="min-h-screen bg-brandBackground dark:bg-slate-900 font-sans text-brandTextSecondary dark:text-slate-300">
      {/* Hero Section */}
      <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          // Use a more dynamic and relevant image for a combat academy
          src="/placeholder-hero-combat.jpg" // Replace with a real, high-quality hero image
          alt="JK Combat Academy Training Session"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-30 dark:opacity-20" // Darker overlay for better text contrast
          priority // Hero image should be priority
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "/placeholder.svg?height=1080&width=1920&text=Hero+Image";
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/50 to-transparent dark:from-slate-900/80 dark:via-slate-900/60"></div>

        <div className="relative z-10 p-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-header drop-shadow-md">
            JK Combat Academy
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-slate-200 dark:text-slate-300 font-body mb-8 drop-shadow-sm max-w-3xl mx-auto">
            Master the Art of Self-Defense, Build Confidence, Achieve Peak
            Fitness.
          </p>
          <button
            onClick={onEnrollClick}
            className="px-8 py-3 bg-brandAccent text-brandTextOnAccent text-lg font-semibold rounded-lg shadow-lg 
                       hover:bg-brandAccentHover focus:outline-none focus:ring-4 
                       focus:ring-brandAccentFocus/50 transition-all duration-300 ease-in-out 
                       transform hover:scale-105 font-header"
          >
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brandTextPrimary dark:text-slate-100 text-center mb-12 sm:mb-16 font-header">
            Why Choose JK Combat Academy?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-brandAccent/20 dark:hover:shadow-brandAccentFocus/20 
                           border border-slate-200 dark:border-slate-700 
                           transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <feature.Icon
                  className={`h-10 w-10 mb-4 ${feature.iconColor}`}
                  aria-hidden="true"
                />
                <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-brandTextPrimary dark:text-slate-100 font-header">
                  {feature.title}
                </h3>
                <p className="text-brandTextSecondary dark:text-slate-300 font-body text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Training Facilities Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-100 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brandTextPrimary dark:text-slate-100 text-center mb-12 sm:mb-16 font-header">
            Our Training Facilities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {facilityImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-xl overflow-hidden shadow-lg group transform hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-300 group-hover:opacity-90"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "/placeholder.svg?height=300&width=400&text=Facility";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-semibold drop-shadow-sm">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brandTextPrimary dark:text-slate-100 mb-6 font-header">
            Ready to Transform Your Life?
          </h2>
          <p className="mb-10 text-lg text-brandTextSecondary dark:text-slate-300 max-w-2xl mx-auto font-body leading-relaxed">
            Join JK Combat Academy today and embark on a journey of
            self-discovery, discipline, and empowerment. Our community is
            waiting for you.
          </p>
          <button
            onClick={onEnrollClick}
            className="px-10 py-4 bg-brandAccent text-brandTextOnAccent text-lg font-semibold rounded-lg shadow-lg 
                       hover:bg-brandAccentHover focus:outline-none focus:ring-4 
                       focus:ring-brandAccentFocus/50 transition-all duration-300 ease-in-out 
                       transform hover:scale-105 font-header"
          >
            Enroll Now & Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
