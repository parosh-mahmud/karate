// pages/courses/index.js
import Head from "next/head";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <>
      <Head>
        <title>Courses | JK Combat Academy</title>
      </Head>

      <main className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-header text-brandTextPrimary">
          Course List Coming Soon
        </h1>

        <p className="text-lg font-body text-brandTextSecondary mb-6">
          Our course details will be available shortly. Stay tuned!
        </p>

        <Link
          href="/"
          className="bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent px-6 py-3 rounded-md transition"
        >
          Go to Home
        </Link>
      </main>
    </>
  );
}
