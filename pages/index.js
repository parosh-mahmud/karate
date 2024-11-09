import Head from "next/head";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import SectionTitle from "../components/sectionTitle";
import Benefits from "../components/benefits";
import Video from "../components/video";
import ImageGallery from "../components/gallery";
import Testimonials from "../components/testimonials";
import BlogSection from "../components/blog";
import Faq from "../components/faq";
import Cta from "../components/cta";
import Footer from "../components/footer";
import PopupWidget from "../components/popupWidget";

import { benefitOne, benefitTwo } from "../components/data";

export default function Home() {
  return (
    <>
      <Head>
        <title>JK Combat Academy - Master the Art of Combat</title>
        <meta
          name="description"
          content="Join JK Combat Academy and embark on a journey to master martial arts and combat training. Develop physical strength, mental resilience, and self-defense skills with our expert instructors."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />

      <SectionTitle
        pretitle="Welcome to JK Combat Academy"
        title="Unleash Your Inner Warrior"
      >
        At JK Combat Academy, we offer comprehensive combat training programs
        designed to empower you physically and mentally. Our expert instructors
        are dedicated to helping you achieve excellence in martial arts,
        self-defense, and personal development.
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <Video />

      <SectionTitle pretitle="Gallery" title="Experience Our Training">
        Get a glimpse of our state-of-the-art facilities and dynamic training
        sessions. Our gallery showcases the intensity and camaraderie that
        define the JK Combat Academy experience.
      </SectionTitle>
      <ImageGallery />

      <SectionTitle pretitle="Latest News" title="Stay Updated with Our Blog">
        Read our latest articles on martial arts, training tips, and upcoming
        events. Stay informed and inspired with insights from our experts.
      </SectionTitle>
      <BlogSection />

      <SectionTitle
        pretitle="Frequently Asked Questions"
        title="Have Questions?"
      >
        Find answers to common questions about our programs, schedules, and
        membership options. We're here to help you start your journey with
        confidence.
      </SectionTitle>
      <Faq />

      <Cta />

      <PopupWidget />
    </>
  );
}
