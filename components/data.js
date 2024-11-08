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
  "https://res.cloudinary.com/dpudfjkoq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1729612153/IMG_8079_aaltv5.jpg";
const benefitTwoImg =
  "https://res.cloudinary.com/dpudfjkoq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1729612198/IMG_9709_yk3bjm.jpg";

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
