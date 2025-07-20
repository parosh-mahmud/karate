// pages/admin/index.js
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { db, auth } from "../../lib/firebase"; // Make sure this path is correct
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
// --- EXISTING ICONS ---
const ProductIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2 text-brandAccent"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
    />
  </svg>
);
const OrderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2 text-brandAccent"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
    />
  </svg>
);
const AdmissionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2 text-brandAccent"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);
const GalleryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2 text-brandAccent"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);
const BlogIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2 text-brandAccent"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25h-1.5m-6 0h1.5m-1.5-6h1.5m-6 0h1.5m-6 0h1.5m0 9H3.75c-.621 0-1.125-.504-1.125-1.125V7.5c0-.621.504-1.125 1.125-1.125h3.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-3.375m0 0c1.676 0 3.017-.174 4.125-.523m0 0c1.676 0 3.017-.174 4.125-.523m0 0c1.108-.349 2.449-.523 4.125-.523m0 0c1.108.349 2.449.523 4.125.523m-8.25 0c1.108.349 2.449.523 4.125.523"
    />
  </svg>
);

// --- NEW ICONS for Registrations ---
const RunningSeminarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2 text-brandAccent"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.75 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);
const FitnessSeminarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 mr-2 text-brandAccent"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 4.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 10.5h.008v.008h-.008V10.5z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 13.5v-3" />
  </svg>
);

// --- Helper component to display recent registrations ---
const RegistrationList = ({
  title,
  registrations,
  loading,
  error,
  viewAllLink,
}) => {
  if (loading)
    return (
      <p className="text-brandTextSecondary dark:text-slate-400">
        Loading registrations...
      </p>
    );
  if (error)
    return <p className="text-red-500">Error loading registrations: {error}</p>;
  if (registrations.length === 0)
    return (
      <p className="text-brandTextSecondary dark:text-slate-400">
        No recent registrations found.
      </p>
    );

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-brandTextPrimary dark:text-brandBackground">
          {title}
        </h3>
        <Link
          href={viewAllLink}
          className="text-brandAccent hover:text-brandAccentHover text-sm font-medium"
        >
          View All &rarr;
        </Link>
      </div>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {registrations.slice(0, 5).map((reg) => (
          <li key={reg.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-brandTextPrimary dark:text-slate-300">
                {reg.name}
              </p>
              <p className="text-sm text-brandTextSecondary dark:text-slate-400">
                {reg.phone}
              </p>
            </div>
            <p className="text-sm text-brandTextSecondary dark:text-slate-500">
              {reg.createdAt?.toDate().toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function AdminHomePage() {
  const [runningRegistrations, setRunningRegistrations] = useState([]);
  const [fitnessRegistrations, setFitnessRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, loadingAuth] = useAuthState(auth);

  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        router.push("/"); // redirect to login
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData?.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/unauthorized"); // redirect non-admins
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setError("Access denied.");
        router.push("/unauthorized");
      }
    };

    verifyAdmin();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchRegistrations = async () => {
      try {
        // Fetch running and fitness registrations (same as before)
        const runningQuery = query(
          collection(db, "running_registrations"),
          orderBy("createdAt", "desc")
        );
        const runningSnapshot = await getDocs(runningQuery);
        setRunningRegistrations(
          runningSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const fitnessQuery = query(
          collection(db, "fitness_registrations"),
          orderBy("createdAt", "desc")
        );
        const fitnessSnapshot = await getDocs(fitnessQuery);
        setFitnessRegistrations(
          fitnessSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError("Could not load registration data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [isAdmin]);

  // useEffect(() => {
  //   const fetchRegistrations = async () => {
  //     try {
  //       // Fetch Running Seminar Registrations
  //       const runningQuery = query(
  //         collection(db, "running_registrations"),
  //         orderBy("createdAt", "desc")
  //       );
  //       const runningSnapshot = await getDocs(runningQuery);
  //       setRunningRegistrations(
  //         runningSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  //       );

  //       // Fetch Fitness Seminar Registrations
  //       const fitnessQuery = query(
  //         collection(db, "fitness_registrations"),
  //         orderBy("createdAt", "desc")
  //       );
  //       const fitnessSnapshot = await getDocs(fitnessQuery);
  //       setFitnessRegistrations(
  //         fitnessSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  //       );
  //     } catch (err) {
  //       console.error("Error fetching registrations:", err);
  //       setError("Could not load registration data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRegistrations();
  // }, []);

  const cardBaseStyle =
    "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-brandAccent/30 transition-shadow duration-300 flex flex-col";
  const cardTitleStyle =
    "text-xl font-semibold text-brandTextPrimary dark:text-brandBackground mb-2 flex items-center font-header";
  const cardDescriptionStyle =
    "text-brandTextSecondary dark:text-slate-400 mb-4 font-sans flex-grow";
  const cardLinkStyle =
    "text-brandAccent hover:text-brandAccentHover font-medium transition-colors duration-300 font-sans mt-auto";

  return (
    <div className="font-sans">
      <h1 className="text-3xl font-bold text-brandTextPrimary dark:text-brandBackground mb-8 font-header">
        Admin Dashboard
      </h1>

      {/* --- Main Dashboard Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Manage Products Card */}
        <div className={cardBaseStyle}>
          <h2 className={cardTitleStyle}>
            <ProductIcon /> Products
          </h2>
          <p className={cardDescriptionStyle}>
            View, add, edit, and manage combat game products.
          </p>
          <Link href="/admin/products" className={cardLinkStyle}>
            Manage Products &rarr;
          </Link>
        </div>

        {/* View Orders Card */}
        <div className={cardBaseStyle}>
          <h2 className={cardTitleStyle}>
            <OrderIcon /> Orders
          </h2>
          <p className={cardDescriptionStyle}>
            View and manage customer orders.
          </p>
          <Link href="/admin/orders" className={cardLinkStyle}>
            View Orders &rarr;
          </Link>
        </div>

        {/* Admissions Card */}
        <div className={cardBaseStyle}>
          <h2 className={cardTitleStyle}>
            <AdmissionIcon /> Admissions
          </h2>
          <p className={cardDescriptionStyle}>
            View and manage student admissions.
          </p>
          <Link href="/admin/admissions" className={cardLinkStyle}>
            Go to Admissions &rarr;
          </Link>
        </div>

        {/* Running Seminar Registrations Card */}
        <div className={cardBaseStyle}>
          <h2 className={cardTitleStyle}>
            <RunningSeminarIcon /> Running Seminar
          </h2>
          <p className={cardDescriptionStyle}>
            {loading
              ? "Loading..."
              : `${runningRegistrations.length} total registrations.`}
          </p>
          {/* CREATE THIS PAGE: /admin/registrations/running */}
          <Link href="/admin/registrations/running" className={cardLinkStyle}>
            Manage Registrations &rarr;
          </Link>
        </div>

        {/* Fitness Seminar Registrations Card */}
        <div className={cardBaseStyle}>
          <h2 className={cardTitleStyle}>
            <FitnessSeminarIcon /> Fitness Seminar
          </h2>
          <p className={cardDescriptionStyle}>
            {loading
              ? "Loading..."
              : `${fitnessRegistrations.length} total registrations.`}
          </p>
          {/* CREATE THIS PAGE: /admin/registrations/fitness */}
          <Link href="/admin/registrations/fitness" className={cardLinkStyle}>
            Manage Registrations &rarr;
          </Link>
        </div>

        {/* Gallery Card */}
        <div className={cardBaseStyle}>
          <h2 className={cardTitleStyle}>
            <GalleryIcon /> Gallery
          </h2>
          <p className={cardDescriptionStyle}>
            Upload and manage gallery images.
          </p>
          <Link href="/admin/gallery" className={cardLinkStyle}>
            Go to Gallery &rarr;
          </Link>
        </div>

        {/* Blog Card */}
        <div className={cardBaseStyle}>
          <h2 className={cardTitleStyle}>
            <BlogIcon /> Blog
          </h2>
          <p className={cardDescriptionStyle}>Create and manage blog posts.</p>
          <Link href="/admin/blogs/create" className={cardLinkStyle}>
            Write New Blog Post &rarr;
          </Link>
        </div>
      </div>

      {/* --- Recent Registrations Section --- */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-brandTextPrimary dark:text-brandBackground mb-6 font-header">
          Recent Registrations
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RegistrationList
            title="Running Seminar"
            registrations={runningRegistrations}
            loading={loading}
            error={error}
            viewAllLink="/admin/registrations/running"
          />
          <RegistrationList
            title="Fitness Seminar"
            registrations={fitnessRegistrations}
            loading={loading}
            error={error}
            viewAllLink="/admin/registrations/fitness"
          />
        </div>
      </div>
    </div>
  );
}

// Wrap this page in AdminLayout
AdminHomePage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
