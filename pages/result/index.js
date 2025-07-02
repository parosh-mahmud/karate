// pages/result/index.js

import dynamic from "next/dynamic";
import Head from "next/head";

// Dynamically import the gallery to disable SSR (react-pdf requires window)
const ResultsGallery = dynamic(
  () => import("../../components/ResultsGallery"),
  { ssr: false }
);

export default function ResultsPage() {
  return (
    <>
      <Head>
        <title> Results</title>
        <meta name="description" content="View your university result PDFs" />
      </Head>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
            Results
          </h1>
          <ResultsGallery />
        </div>
      </main>
    </>
  );
}
