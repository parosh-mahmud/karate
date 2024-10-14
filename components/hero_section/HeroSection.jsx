function HeroSection() {
  return (
    <section className="bg-gray-100 p-8 text-center md:text-left md:flex md:justify-between md:items-center rounded-lg shadow-lg space-y-8 md:space-y-0">
      <div className="space-y-6 md:w-1/2">
        <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">
          Achieve <span className="text-blue-600">Peak Performance</span> with Karate Training!
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Discover the power of karate to enhance discipline, strength, and focus. Our training program offers effective, accessible ways to:
        </p>
        <ul className="list-disc list-inside text-left text-lg text-gray-600 space-y-1 pl-4">
          <li><span className="text-blue-600 font-semibold">Build Confidence</span></li>
          <li><span className="text-blue-600 font-semibold">Improve Physical Fitness</span></li>
          <li><span className="text-blue-600 font-semibold">Develop Mental Toughness</span></li>
        </ul>
        <p className="text-gray-700 leading-relaxed">
          Our <span className="font-bold text-gray-800">Karate Mastery Program</span> is designed by experts with over <span className="font-bold text-gray-800">20 years of experience</span>. Whether you’re training in-person or online, experience transformative results and become the best version of yourself!
        </p>
        <div className="text-lg font-semibold text-blue-600">
          More Strength, Confidence, and Discipline – start now!
        </div>
        <div className="text-2xl font-bold">
          <span className="line-through text-red-600 mr-2">$299</span> 
          <span className="text-green-600">$249*</span> 
          <span className="text-sm text-gray-500">(use code: KARATEPOWER)</span>
        </div>
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
          Join Now
        </button>
      </div>
      <div className="md:w-1/2 mt-6 md:mt-0">
        <img src="/images/hero_section.jpg" alt="Karate Training" className="w-full h-auto rounded-lg shadow-lg" />
      </div>
    </section>
  );
}

export default HeroSection;
