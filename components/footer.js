function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo and Address */}
        <div className="col-span-2">
          <img
            src="/logos/logo_arman.png"
            alt="Karate Academy Logo"
            className="h-16 w-auto mb-4"
          />
          <p className="text-sm">
            123 Karate Street, Martial Arts District,
            <br />
            Main City, State 12345
          </p>
          <p className="text-sm mt-2">
            <span className="font-semibold">Contact:</span> +1 (555) 123-4567
            <br />
            <span className="font-semibold">Email:</span> info@karateacademy.com
          </p>
        </div>

        {/* Training Programs */}
        <div>
          <h3 className="font-bold text-lg mb-2">TRAINING PROGRAMS</h3>
          <ul className="text-sm space-y-1">
            <li>Beginner Karate Classes</li>
            <li>Advanced Karate Techniques</li>
            <li>Self-Defense for All Ages</li>
            <li>Karate for Kids</li>
          </ul>
        </div>

        {/* Membership Options */}
        <div>
          <h3 className="font-bold text-lg mb-2">MEMBERSHIP</h3>
          <ul className="text-sm space-y-1">
            <li>Individual Membership</li>
            <li>Family Membership</li>
            <li>Monthly & Yearly Plans</li>
            <li>Corporate Training Packages</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-bold text-lg mb-2">RESOURCES</h3>
          <ul className="text-sm space-y-1">
            <li>Instructor Profiles</li>
            <li>Student Success Stories</li>
            <li>Karate Blog</li>
            <li>Events & Workshops</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center border-t border-gray-700 pt-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Karate Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
