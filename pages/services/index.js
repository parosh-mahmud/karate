// pages/services/index.js
import Head from "next/head";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>Services | JK Combat Academy</title>
      </Head>

      <main className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-header text-brandTextPrimary mb-4">
          Our Services Coming Soon
        </h1>
        <p className="text-lg font-body text-brandTextSecondary mb-8">
          We are working on our service offerings. Please check back soon!
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-md bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent transition"
        >
          Go to Home
        </Link>
      </main>
    </>
  );
}
