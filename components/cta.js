import React from "react";
import Container from "./container";

export default function Cta() {
  return (
    <Container>
      {" "}
      {/* Container likely provides padding and max-width */}
      <div
        className="flex flex-wrap items-center justify-between w-full max-w-4xl gap-5 mx-auto 
                      bg-brandAccent text-brandTextOnAccent 
                      px-7 py-7 lg:px-12 lg:py-12 rounded-xl shadow-lg font-sans"
      >
        <div className="flex-grow text-center lg:text-left">
          <h2 className="text-2xl font-bold lg:text-3xl font-header">
            Ready to join JK Combat Academy?
          </h2>
          <p className="mt-2 font-medium text-brandTextOnAccent/90 lg:text-xl font-body">
            {" "}
            {/* Using opacity for slight text softening */}
            Start your journey to mastering combat and self-defense today.
          </p>
        </div>
        <div className="flex-shrink-0 w-full text-center lg:w-auto mt-6 lg:mt-0">
          <a
            href="/join" // Ensure this link points to your desired join/admission page
            target="_blank" // Consider if this should open in a new tab
            rel="noopener noreferrer" // Good practice for _blank links
            className="inline-block py-3 lg:py-4 px-7 lg:px-10 mx-auto 
                       text-lg font-semibold text-center 
                       text-brandAccent bg-white 
                       rounded-lg shadow-md 
                       hover:bg-slate-100 hover:shadow-lg
                       focus:outline-none focus:ring-4 focus:ring-brandAccentFocus/50 
                       transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 font-body"
          >
            Join Now
          </a>
        </div>
      </div>
    </Container>
  );
}
