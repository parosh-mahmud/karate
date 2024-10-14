function AboutUs() {
  return (
    <section className="bg-white py-16 px-8 md:px-16 lg:px-32 text-center md:text-left space-y-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-4">About Us</h2>
      <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
        Welcome to <span className="font-bold text-blue-600">Karate Academy</span>, where tradition meets modern training techniques. We are dedicated to empowering individuals of all ages to build strength, confidence, and resilience through the art of karate. Established by seasoned martial arts experts, our academy offers a structured, supportive environment for everyone — from beginners to advanced practitioners.
      </p>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center mt-8">
        {/* Our Mission */}
        <div className="space-y-4 max-w-sm mx-auto md:mx-0">
          <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to promote personal growth through the discipline of karate. We aim to inspire each student to reach their highest potential, both on and off the mat, by instilling values of respect, dedication, and perseverance.
          </p>
        </div>

        {/* Our Instructors */}
        <div className="space-y-4 max-w-sm mx-auto md:mx-0">
          <h3 className="text-2xl font-bold text-gray-800">Our Instructors</h3>
          <p className="text-gray-700 leading-relaxed">
            Led by black belt instructors with over 20 years of experience, our team is committed to providing top-notch karate training. Our instructors are not only skilled martial artists but also dedicated mentors who work to foster a positive and encouraging learning atmosphere.
          </p>
        </div>

        {/* Our Philosophy */}
        <div className="space-y-4 max-w-sm mx-auto md:mx-0">
          <h3 className="text-2xl font-bold text-gray-800">Our Philosophy</h3>
          <p className="text-gray-700 leading-relaxed">
            At <span className="font-bold text-blue-600">Karate Academy</span>, we believe that karate is more than just a sport — it’s a way of life. Our philosophy emphasizes mental clarity, physical strength, and emotional balance. We aim to equip our students with the skills and mindset to overcome challenges both inside and outside the dojo.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
