// pages/seminars/index.js
import Link from "next/link";
import Image from "next/image";

const seminars = [
  // {
  //   id: "run",
  //   title: "July Run 2025",
  //   description:
  //     "🏃‍♂️  সচেতনতামূলক বার্তা ও আকর্ষণীয় পুরস্কার! আপনার বয়স ও সাইজ অনুযায়ী টি-শার্ট, ম্যাপসহ অংশগ্রহণ নিশ্চিত করুন।",
  //   banner:
  //     "https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/run%20for%20july%201.jpg?alt=media&token=8faf5906-1c3a-4f36-9b08-6192e0599468",
  // },
  {
    id: "fitness",
    title: "Self-Defense & Fitness Seminar",
    description:
      "💪 ফিটনেস, জিম এবং মার্শাল আর্ট সম্পর্কিত প্রশ্ন ও উত্তর, আলোচনা এবং প্রশিক্ষণ সেশনে অংশ নিন।",
    banner:
      "https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/fitness.jpg?alt=media&token=2a9d4a0e-8677-423a-a4f8-bd128537af15",
  },
];

export default function SeminarList() {
  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-brandTextPrimary dark:text-white">
          📢 Upcoming Events & Seminars
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {seminars.map((seminar) => (
            <Link
              href={`/seminars/${seminar.id}`}
              key={seminar.id}
              className="block bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {seminar.banner && (
                // The container maintains a consistent 16:9 shape
                <div className="aspect-w-16 aspect-h-9 bg-black">
                  <Image
                    src={seminar.banner}
                    alt={seminar.title}
                    layout="fill"
                    // ## FINAL FIX: Changed object-cover to object-contain ##
                    // This ensures the entire image is visible within the container.
                    objectFit="contain"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-2 text-brandTextPrimary dark:text-white group-hover:text-brandAccent dark:group-hover:text-brandAccentFocus transition-colors">
                  {seminar.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                  {seminar.description}
                </p>
                <div className="mt-4">
                  <span className="inline-block bg-brandAccent text-white font-bold py-2.5 px-6 rounded-lg shadow-lg transition-transform transform group-hover:scale-105 group-hover:bg-brandAccentHover">
                    Register Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
