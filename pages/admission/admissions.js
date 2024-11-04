import Image from "next/image";
import { Button, Card, CardContent } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Security";
import AdjustIcon from "@mui/icons-material/Adjust";
import BrainIcon from "@mui/icons-material/Psychology";
import HeartIcon from "@mui/icons-material/Favorite";

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-black">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="JK Combat Academy Training"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              JK Combat Academy
            </h1>
            <p className="text-xl text-white">Master the Art of Self-Defense</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose JK Combat Academy?
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <ShieldIcon
                style={{ fontSize: 40, color: "blue" }}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Training
              </h3>
              <p>
                Our academy offers a wide range of combat techniques, from
                striking to grappling, ensuring you're prepared for any
                situation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <AdjustIcon
                style={{ fontSize: 40, color: "red" }}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p>
                Learn from seasoned professionals with years of experience in
                various martial arts and real-world applications.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <BrainIcon
                style={{ fontSize: 40, color: "green" }}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Mental Toughness</h3>
              <p>
                Develop not just physical strength, but also mental resilience
                and quick decision-making skills.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <HeartIcon
                style={{ fontSize: 40, color: "purple" }}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Fitness and Health</h3>
              <p>
                Improve your overall fitness, flexibility, and cardiovascular
                health through our intensive training programs.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our Training Facilities
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Training Area 1"
              width={400}
              height={300}
              className="rounded-lg"
            />
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Training Area 2"
              width={400}
              height={300}
              className="rounded-lg"
            />
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Training Area 3"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="mb-6 text-lg">
            Join JK Combat Academy today and embark on a journey of
            self-discovery, discipline, and empowerment.
          </p>
          <Button variant="contained" color="secondary" size="large">
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}
