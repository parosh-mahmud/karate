import {
  ShieldCheckIcon,
  LightningBoltIcon,
  UsersIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  FireIcon,
} from "@heroicons/react/outline";

// Cloudinary image URLs
const benefitOneImg =
  "https://firebasestorage.googleapis.com/v0/b/nirapod-lenden.firebasestorage.app/o/galleryImages%2Fd2e102e8-0844-4960-9a4f-613d3761b384-iphoneimage.jpg?alt=media&token=ee28b2be-b1d2-4ab3-bedf-f6210d1ee895";
const benefitTwoImg =
  "https://firebasestorage.googleapis.com/v0/b/nirapod-lenden.firebasestorage.app/o/galleryImages%2Fd2e102e8-0844-4960-9a4f-613d3761b384-iphoneimage.jpg?alt=media&token=ee28b2be-b1d2-4ab3-bedf-f6210d1ee895";

const benefitOne = {
  title: "Why Train with JK Combat Academy",
  desc: "At JK Combat Academy, we provide world-class combat training to help you become a skilled martial artist. Our programs are tailored to develop your strength, technique, and mental discipline, whether you’re a beginner or an experienced fighter.",
  image: benefitOneImg, // Pass image URL as a string
  bullets: [
    {
      title: "Expert Instructors",
      desc: "Learn from the best with our experienced and certified combat instructors.",
      icon: <ShieldCheckIcon />,
    },
    {
      title: "Intensive Training Programs",
      desc: "Our training programs are designed to push your limits and ensure rapid improvement.",
      icon: <LightningBoltIcon />,
    },
    {
      title: "Strong Community",
      desc: "Join a community of fighters dedicated to self-improvement and mutual support.",
      icon: <UsersIcon />,
    },
  ],
};

const benefitTwo = {
  title: "More Reasons to Join JK Combat Academy",
  desc: "We focus on providing a holistic combat training experience. From modern training facilities to flexible programs, JK Combat Academy offers everything you need to excel in martial arts.",
  image: benefitTwoImg, // Pass image URL as a string
  bullets: [
    {
      title: "Comprehensive Curriculum",
      desc: "Our curriculum covers various combat styles, including self-defense, weapon training, and fitness.",
      icon: <AcademicCapIcon />,
    },
    {
      title: "Global Recognition",
      desc: "Train with a globally recognized academy that values discipline, honor, and excellence.",
      icon: <GlobeAltIcon />,
    },
    {
      title: "Motivating Environment",
      desc: "Our academy fosters a motivating environment to keep you inspired and goal-oriented.",
      icon: <FireIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
