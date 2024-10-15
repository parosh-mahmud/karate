export default function AboutUs() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white">
      <div className="md:w-1/2 px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Hello, I'm Jackson.
        </h1>
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-700 mb-6">
          I'm a Website Developer.
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          I've been creating and developing websites professionally and as part of my agency for more than four years now.
        </p>
        <div className="flex items-center space-x-4">
          <button className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition">
            Let's Talk
          </button>
          <a href="#" className="text-gray-700 font-semibold hover:underline">
            Check My Blogs →
          </a>
        </div>
        <div className="flex mt-6 space-x-4 text-gray-600">
          {/* Icons can be placed here as links */}
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-whatsapp"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-envelope"></i></a>
        </div>
      </div>
      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
        <Image
          src={profilePic}
          alt="Jackson's Profile Picture"
          className="rounded-lg"
          width={300}
          height={400}
        />
      </div>
    </div>
  );
}