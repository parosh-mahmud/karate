import Image from "next/image";
import { Button, Card, CardContent } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Security";
import AdjustIcon from "@mui/icons-material/Adjust";
import BrainIcon from "@mui/icons-material/Psychology";
import HeartIcon from "@mui/icons-material/Favorite";

export default function Component({ onEnrollClick }) {
  return (
    <div className="min-h-screen bg-neutral font-sans">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-primary">
        <Image
          src="/placeholder.svg?height=1080&width=1920" // Placeholder, ensure this image works well with dark bg
          alt="JK Combat Academy Training"
          layout="fill"
          objectFit="cover"
          className="opacity-40" // Adjusted opacity slightly if needed for primary background
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-accent mb-4 font-header">
              JK Combat Academy
            </h1>
            <p className="text-xl sm:text-2xl text-neutral font-body">
              Master the Art of Self-Defense
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 sm:py-16 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-10 sm:mb-12 font-header">
          Why Choose JK Combat Academy?
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12 sm:mb-16">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            {" "}
            {/* Added bg-white for card clarity on neutral bg */}
            <CardContent className="p-6">
              <ShieldIcon
                style={{ fontSize: 40 }}
                className="mb-4 text-brandBlue"
              />
              <h3 className="text-xl lg:text-2xl font-semibold mb-2 text-primary font-header">
                Comprehensive Training
              </h3>
              <p className="text-trueGray-700 font-body">
                Our academy offers a wide range of combat techniques, from
                striking to grappling, ensuring you're prepared for any
                situation.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <AdjustIcon
                style={{ fontSize: 40 }}
                className="mb-4 text-brandRed"
              />
              <h3 className="text-xl lg:text-2xl font-semibold mb-2 text-primary font-header">
                Expert Instructors
              </h3>
              <p className="text-trueGray-700 font-body">
                Learn from seasoned professionals with years of experience in
                various martial arts and real-world applications.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <BrainIcon
                style={{ fontSize: 40 }}
                className="mb-4 text-brandGreen"
              />
              <h3 className="text-xl lg:text-2xl font-semibold mb-2 text-primary font-header">
                Mental Toughness
              </h3>
              <p className="text-trueGray-700 font-body">
                Develop not just physical strength, but also mental resilience
                and quick decision-making skills.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <HeartIcon
                style={{ fontSize: 40 }}
                className="mb-4 text-secondary" // Using brand secondary color
              />
              <h3 className="text-xl lg:text-2xl font-semibold mb-2 text-primary font-header">
                Fitness and Health
              </h3>
              <p className="text-trueGray-700 font-body">
                Improve your overall fitness, flexibility, and cardiovascular
                health through our intensive training programs.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-10 sm:mb-12 font-header">
            Our Training Facilities
          </h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <Image
              src="https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612200/IMG_20221222_003514_221_acgg9h.jpg"
              alt="Training Area 1"
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-full shadow-md hover:scale-105 transition-transform duration-300"
            />
            <Image
              src="https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612198/IMG_9709_yk3bjm.jpg"
              alt="Training Area 2"
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-full shadow-md hover:scale-105 transition-transform duration-300"
            />
            <Image
              src="https://res.cloudinary.com/dpudfjkoq/image/upload/v1729612183/IMG_8698_r2dwjg.jpg"
              alt="Training Area 3"
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-full shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 font-header">
            Ready to Transform Your Life?
          </h2>
          <p className="mb-8 text-lg text-trueGray-700 max-w-2xl mx-auto font-body">
            Join JK Combat Academy today and embark on a journey of
            self-discovery, discipline, and empowerment.
          </p>
          <Button
            onClick={onEnrollClick}
            variant="contained"
            size="large"
            className="bg-secondary text-neutral hover:bg-orange-700 font-header py-3 px-8 text-lg transition-colors duration-300"
            // The className will override MUI's default "secondary" color if its specificity is high enough
            // or if MUI's styling for color prop isn't too aggressive.
            // For more robust MUI theme color override, you'd configure the MUI theme.
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}
