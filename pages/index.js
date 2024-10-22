import Head from "next/head";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import SectionTitle from "../components/sectionTitle";

import { benefitOne, benefitTwo } from "../components/data";
import Video from "../components/video";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import Cta from "../components/cta";
import Faq from "../components/faq";
import PopupWidget from "../components/popupWidget";
import BlogSection from "../components/blog";
import ImageGallery from "../components/gallery";

export default function Home() {
  return (
    <>
      <Head>
        <title>JK Combat Academy - Master the Art of Combat</title>
        <meta
          name="description"
          content="JK Combat Academy is your destination for mastering martial arts and combat training. Join our academy to develop physical strength, mental resilience, and self-defense skills."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Hero />
      <BlogSection />
      <ImageGallery />
      <SectionTitle
        pretitle="Why Train with Us"
        title="Empower Yourself at JK Combat Academy"
      >
        At JK Combat Academy, we specialize in intense combat training programs
        that help students develop not only physical prowess but also mental
        discipline and resilience. Whether you're a beginner or an experienced
        fighter, our programs are designed to push your limits.
      </SectionTitle>
      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      <SectionTitle
        pretitle="Watch Our Training in Action"
        title="Step Into the Combat Zone"
      >
        Watch our combat training sessions in action, led by our experienced
        instructors. Learn techniques that will prepare you for real-world
        self-defense and competitive fighting.
      </SectionTitle>
      <Video />
      {/* <SectionTitle
        pretitle="What Our Fighters Say"
        title="Testimonials from Our Combat Students"
      >
        Our students have achieved incredible results in their combat journey.
        Hear their stories and find out how JK Combat Academy has empowered them
        to reach new heights. */}
      {/* </SectionTitle> */}
      {/* <Testimonials /> */}
      <SectionTitle pretitle="FAQ" title="Questions About Combat Training?">
        Find answers to frequently asked questions about our combat programs,
        schedules, and memberships. Whether you're looking for personal training
        or group classes, we have options for every fighter.
      </SectionTitle>
      <Faq />
      <Cta />
      <Footer />
      <PopupWidget />
    </>
  );
}
