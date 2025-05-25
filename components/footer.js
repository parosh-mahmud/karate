// components/Footer.js
import Image from "next/image";
import logo from "../assets/logos/Arman.png"; // adjust path as needed

function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 p-8">
      {" "}
      {/* Deep slate background, light gray text */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo and Address */}
        <div className="md:col-span-2">
          <Image
            src={logo}
            alt="Company Logo" // Generic alt text
            width={64}
            height={64}
            className="mb-4 rounded-md" // Optional: bg-white p-1 if logo needs contrast
          />
          <p className="text-sm">
            Haji Muhammad Muhsin Hall, University of Dhaka,
            <br />
            Dhaka, 1000, Bangladesh
          </p>
          <p className="text-sm mt-4">
            <span className="font-semibold text-slate-100">Contact:</span>{" "}
            +8801765622562
            <br />
            <span className="font-semibold text-slate-100">Email:</span>{" "}
            <a
              href="mailto:arman.du.j2k@gmail.com"
              className="hover:text-sky-400 transition-colors duration-200" // Light blue hover
            >
              arman.du.j2k@gmail.com
            </a>
          </p>
        </div>

        {/* Training Programs */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">
            {" "}
            {/* White heading */}
            TRAINING PROGRAMS
          </h3>
          <ul className="text-sm space-y-2">
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Beginner Karate Classes
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Advanced Karate Techniques
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Self-Defense for All Ages
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Karate for Kids
            </li>
          </ul>
        </div>

        {/* Membership Options */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">
            {" "}
            {/* White heading */}
            MEMBERSHIP
          </h3>
          <ul className="text-sm space-y-2">
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Individual Membership
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Family Membership
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Monthly & Yearly Plans
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Corporate Training Packages
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-white">
            {" "}
            {/* White heading */}
            RESOURCES
          </h3>
          <ul className="text-sm space-y-2">
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Instructor Profiles
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Student Success Stories
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Karate Blog
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Events & Workshops
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-sky-400 transition-colors duration-200 cursor-pointer">
              Terms of Service
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center border-t border-slate-700 pt-6">
        {" "}
        {/* Subtle border */}
        <p className="text-xs text-slate-400">
          {" "}
          {/* Muted copyright text */}© {new Date().getFullYear()} JK Combat
          Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
