// // pages/index.js
// import { useState } from "react";
// import Head from "next/head";

// // Import Components
// import Hero from "../components/hero";
// import SectionTitle from "../components/sectionTitle";
// import Benefits from "../components/benefits";
// import Video from "../components/video";
// import ImageGallery from "../components/gallery";
// import BlogSection from "../components/blog";
// import Faq from "../components/faq";
// import Cta from "../components/cta";
// import PopupWidget from "../components/popupWidget";
// //  ←–– new imports for the calculators
// import BMRCalculator from "../components/calculators/BMRCalculator";
// import MacroCalculator from "../components/calculators/MacroCalculator";
// import BodyFatCalculator from "../components/calculators/BodyFat";
// // Data for Benefits
// import { benefitOne, benefitTwo } from "../components/data";

// export default function Home() {
//   const [activeTab, setActiveTab] = useState("bmr");
//   return (
//     <>
//       <Head>
//         <title>JK Combat Academy - Master the Art of Combat</title>
//         <meta
//           name="description"
//           content="Join JK Combat Academy and embark on a journey to master martial arts and combat training. Develop physical strength, mental resilience, and self-defense skills with our expert instructors."
//         />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       {/* Apply base font and background colors to the main container.
//         Individual sections/components below should also adhere to the branding
//         defined in tailwind.config.js for a consistent look and feel.
//       */}
//       <main className="font-sans bg-brandBackground dark:bg-brandTextPrimary">
//         <Hero />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
//           {/* ←–– Left column: tabs + calculator forms */}
//           {/* ←–– Left column: tabs + calculator forms */}
//           <div>
//             {/* Tab navigation */}
//             <div className="flex justify-center rounded-lg overflow-hidden mb-6">
//               {[
//                 { key: "bmr", label: "BMRCalculator" },
//                 { key: "macro", label: "MacroCalculator" },
//                 { key: "bodyfat", label: "Body Fat" },
//               ].map(({ key, label }, i) => (
//                 <button
//                   key={key}
//                   onClick={() => setActiveTab(key)}
//                   className={[
//                     "px-4 py-2 text-sm font-medium transition",
//                     activeTab === key
//                       ? "bg-brandAccent text-brandTextOnAccent"
//                       : "text-brandAccent hover:bg-brandAccentHover hover:text-white",
//                     i === 0 && "rounded-l-lg",
//                     i === 2 && "rounded-r-lg",
//                   ]
//                     .filter(Boolean)
//                     .join(" ")}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>

//             {/* Active calculator */}
//             <div>
//               {activeTab === "bmr" && <BMRCalculator />}
//               {activeTab === "macro" && <MacroCalculator />}
//               {activeTab === "bodyfat" && <BodyFatCalculator />}
//             </div>
//           </div>

//           {/* ←–– Right column: instructions */}
//           {/* ←–– Right column: instructions */}
//           <div className="space-y-4 font-body text-brandTextSecondary">
//             <h2 className="text-3xl font-header text-brandTextPrimary">
//               <strong>Instantly Calculate Your BMR, Macros & Body Fat</strong>
//             </h2>
//             <p>
//               Unlock your fitness potential with our powerful calculators.
//               Understand your body's unique needs and optimize your training and
//               nutrition for peak performance.
//             </p>
//             <p>
//               <strong>BMR (Basal Metabolic Rate):</strong> Discover the baseline
//               energy your body expends at rest. This crucial metric informs your
//               daily caloric needs for weight management and overall health.
//             </p>
//             <p>
//               <strong>TDEE (Total Daily Energy Expenditure):</strong> Calculate
//               your total calorie burn based on your activity level. Accurately
//               estimate your energy needs to fuel your workouts and daily life.
//             </p>
//             <p>
//               <strong>Macros (Macronutrients):</strong> Fine-tune your nutrition
//               with personalized macronutrient ratios. Optimize your intake of
//               carbohydrates, proteins, and fats to support your specific fitness
//               goals.
//             </p>
//             <p>
//               <strong>Body Fat %:</strong> Monitor your body composition and
//               track your progress towards a healthier physique. A lower body fat
//               percentage is associated with improved fitness and reduced health
//               risks.
//             </p>
//           </div>
//         </div>

//         <SectionTitle
//           pretitle="Welcome to JK Combat Academy"
//           title="Unleash Your Inner Warrior"
//         >
//           At JK Combat Academy, we offer comprehensive combat training programs
//           designed to empower you physically and mentally. Our expert
//           instructors are dedicated to helping you achieve excellence in martial
//           arts, self-defense, and personal development.
//         </SectionTitle>

//         <Benefits data={benefitOne} />
//         <Benefits imgPos="right" data={benefitTwo} />

//         <Video />

//         <SectionTitle pretitle="Gallery" title="Experience Our Training">
//           Get a glimpse of our state-of-the-art facilities and dynamic training
//           sessions. Our gallery showcases the intensity and camaraderie that
//           define the JK Combat Academy experience.
//         </SectionTitle>
//         <ImageGallery />

//         <SectionTitle pretitle="Latest News" title="Stay Updated with Our Blog">
//           Read our latest articles on martial arts, training tips, and upcoming
//           events. Stay informed and inspired with insights from our experts.
//         </SectionTitle>
//         <BlogSection />

//         <SectionTitle
//           pretitle="Frequently Asked Questions"
//           title="Have Questions?"
//         >
//           Find answers to common questions about our programs, schedules, and
//           membership options. We&apos;re here to help you start your journey
//           with confidence.
//         </SectionTitle>
//         <Faq />

//         <Cta />
//       </main>

//       {/* PopupWidget can stay here if it isn't already in Layout */}
//       <PopupWidget />
//     </>
//   );
// }

// pages/index.js
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Site Under Maintenance - JK Combat Academy</title>
        <meta
          name="description"
          content="We are currently performing maintenance. Please check back later."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">🚧 Site Under Maintenance</h1>
        <p className="text-lg">
          We're currently updating the JK Combat Academy website to serve you
          better.
          <br />
          Please check back soon.
        </p>
      </main>
    </>
  );
}
