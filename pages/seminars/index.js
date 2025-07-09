// pages/seminars/index.js
import Link from "next/link";
import Image from "next/image";

const seminars = [
  {
    id: "run",
    title: "July Run 2025",
    description:
      "🏃‍♂️ দৌড় প্রতিযোগিতা, সচেতনতামূলক বার্তা ও আকর্ষণীয় পুরস্কার! আপনার বয়স ও সাইজ অনুযায়ী টি-শার্ট, ম্যাপসহ অংশগ্রহণ নিশ্চিত করুন।",
    banner:
      "https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/run.jpeg?alt=media&token=cf62ce34-5f67-4bb0-a714-a0d5b01f5331",
  },
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
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-brandTextPrimary dark:text-white">
        📢 Upcoming Events
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {seminars.map((seminar) => (
          <div
            key={seminar.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
          >
            {seminar.banner && (
              <Image
                src={seminar.banner}
                alt={seminar.title}
                width={800}
                height={400}
                className="w-full object-cover h-64"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-brandTextPrimary dark:text-white">
                {seminar.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {seminar.description}
              </p>
              <Link
                href={`/seminars/${seminar.id}`}
                className="inline-block bg-brandAccent hover:bg-brandAccentHover text-white py-2 px-5 rounded-lg shadow transition"
              >
                Register Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
