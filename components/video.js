import { useState } from "react";
import Container from "./container";

export default function Video() {
  const [playVideo, setPlayVideo] = useState(false);

  // ✅ Use your actual video embed URL here
  const videoEmbedUrl = "https://www.youtube.com/embed/MSLbdB8Xvmg";

  return (
    <Container>
      <div className="w-full max-w-4xl mx-auto mb-20 overflow-hidden rounded-2xl shadow-xl">
        <div
          onClick={() => setPlayVideo(true)}
          className="relative cursor-pointer aspect-w-16 aspect-h-9 
                     bg-gradient-to-br from-brandAccent via-brandAccentFocus to-sky-400 
                     rounded-lg overflow-hidden group"
        >
          {!playVideo && (
            <>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              <button
                aria-label="Play Video"
                className="absolute inset-auto text-brandTextOnAccent 
                           transform -translate-x-1/2 -translate-y-1/2 
                           w-20 h-20 md:w-24 md:h-24 top-1/2 left-1/2 
                           bg-black/40 hover:bg-black/60 dark:bg-black/50 dark:hover:bg-black/70
                           rounded-full transition-all duration-300 ease-in-out 
                           focus:outline-none focus:ring-4 focus:ring-brandAccentFocus focus:ring-opacity-75 
                           flex items-center justify-center scale-100 group-hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 md:w-12 md:h-12"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Play Video</span>
              </button>
            </>
          )}
          {playVideo && (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`${videoEmbedUrl}?autoplay=1`}
              title="Round Kick ঘুরিয়ে লাথি দেওয়ার বেসিক কৌশল"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </Container>
  );
}
