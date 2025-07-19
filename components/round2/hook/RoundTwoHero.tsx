'use client';

import { CheckCircle } from 'lucide-react';

export default function RoundTwoHero() {
  return (
    <section
      style={{
        backgroundImage: 'linear-gradient(to bottom right, rgba(33, 109, 223, 1), #002B80)',
      }}
      className="w-full min-h-screen flex items-center flex-col justify-center text-center text-white"
    >
      <div className="w-full px-6 sm:px-8 md:px-12 flex flex-col items-center gap-6">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          You Have Not Applied For A Job.
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-5xl text-white/90">
          You’ve signed up for a mission
        </p>
      </div>
      <div>
        <button
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          className="mt-10 inline-block bg-white text-[#075985] font-bold px-8 py-4 rounded-full text-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
        >
          Start the Mission
        </button>
      </div>

    </section>


  );
}
