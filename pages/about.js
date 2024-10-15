import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function AboutUs() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white">
      <div className="md:w-1/2 px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Hello, I'm Arman Hossen.
        </h1>
        <h2 className="text-4xl md:text-3xl font-semibold text-gray-700 mb-6">
          Founder of JK Combat Academy.
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          I've been training and coaching in martial arts professionally and as
          part of my <span className="text-red-600 font-semibold">academy</span>{" "}
          for more than four years now.
        </p>
        <div className="flex items-center space-x-8 mb-4">
          {" "}
          {/* Increased spacing */}
          <button className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition">
            Let's Talk
          </button>
          <a href="#" className="text-gray-700 font-semibold hover:underline">
            Check My Blog →
          </a>
          <div className="flex space-x-4 text-red-600 ml-8">
            <a href="#" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </a>
            <a href="#" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="#" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
            </a>
            <a href="#" aria-label="YouTube">
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </a>
            <a href="mailto:example@example.com" aria-label="Email">
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
            </a>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
        <Image
          src="/images/me.jpg"
          alt="Arman Hossen's Profile Picture"
          className="rounded-lg"
          width={500}
          height={1000}
        />
      </div>
    </div>
  );
}
