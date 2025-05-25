// pages/about/index.js
import React from "react";
import Head from "next/head";
import Image from "next/image";

const demoTrainers = [
  {
    id: "t1",
    name: "Md. Rahim Uddin",
    specialization: "Judo Sensei",
    bio: "7-time national champion and certified IJF coach with 10 years of teaching experience.",
    photoUrl: "/images/trainers/rahim.jpg", // Ensure these paths are correct
  },
  {
    id: "t2",
    name: "Sara Begum",
    specialization: "Karate Instructor",
    bio: "Black belt 5th dan, former international competitor, passionate about youth development.",
    photoUrl: "/images/trainers/sara.jpg", // Ensure these paths are correct
  },
  {
    id: "t3",
    name: "Anik Khan",
    specialization: "Self-Defense Expert",
    bio: "Ex-military hand-to-hand combat trainer, specializes in Krav Maga.",
    photoUrl: "/images/trainers/anik.jpg", // Ensure these paths are correct
  },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | JK Combat Academy</title>
        <meta
          name="description"
          content="Learn more about JK Combat Academy, our mission, our dedicated CEO, and expert trainers. Join us to develop your combat skills."
        />
      </Head>
      <div className="min-h-screen bg-brandBackground dark:bg-slate-900 font-sans">
        <div className="container mx-auto py-12 px-4 md:py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 md:mb-16 text-brandTextPrimary dark:text-brandBackground font-header">
            About JK Combat Academy
          </h1>

          {/* CEO Section */}
          <section className="max-w-xl mx-auto mb-16 md:mb-20 text-center">
            <h2 className="text-3xl font-semibold mb-8 text-brandTextPrimary dark:text-brandBackground font-header">
              Our Visionary CEO
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 relative mb-6 border-4 border-brandAccent dark:border-brandAccentFocus rounded-full shadow-lg">
                <Image
                  src="/images/ceo.jpg" // Ensure this path is correct
                  alt="Arman Hossain, CEO of JK Combat Academy"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h3 className="text-2xl font-semibold text-brandTextPrimary dark:text-brandBackground font-header">
                Arman Hossain
              </h3>
              <p className="text-brandTextSecondary dark:text-slate-300 mt-3 leading-relaxed font-body">
                Founder and CEO of JK Combat Academy, Arman brings over 15 years
                of martial arts experience and leadership in training
                world‐class fighters. His vision is to create a community where
                discipline, respect, and strength are paramount.
              </p>
            </div>
          </section>

          {/* Trainers Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-10 md:mb-12 text-center text-brandTextPrimary dark:text-brandBackground font-header">
              Meet Our Expert Trainers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {demoTrainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-white dark:bg-brandTextSoft rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 text-center border border-slate-200 dark:border-slate-700 flex flex-col items-center"
                >
                  <div className="w-32 h-32 relative mx-auto mb-5 border-4 border-brandAccentFocus dark:border-brandAccent rounded-full shadow-md">
                    <Image
                      src={trainer.photoUrl}
                      alt={trainer.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-brandTextPrimary dark:text-brandBackground mb-1 font-header">
                    {trainer.name}
                  </h3>
                  <p className="text-brandAccent dark:text-brandAccentFocus font-semibold text-sm mb-3 font-body">
                    {trainer.specialization}
                  </p>
                  <p className="text-brandTextSecondary dark:text-slate-300 text-sm leading-relaxed font-body">
                    {trainer.bio}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
