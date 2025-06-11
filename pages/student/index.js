// pages/student/index.js
"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOutlined,
  HourglassEmptyOutlined,
  PersonOutlined,
  EventOutlined,
} from "@mui/icons-material";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [admission, setAdmission] = useState(null);
  const [loadingAdmission, setLoadingAdmission] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch this user's admission record
  useEffect(() => {
    if (!user) {
      setAdmission(null);
      setLoadingAdmission(false);
      return;
    }
    const loadAdmission = async () => {
      setLoadingAdmission(true);
      try {
        const admissionsRef = collection(db, "admissions");
        const q = query(admissionsRef, where("uid", "==", user.uid));
        const snap = await getDocs(q);

        if (!snap.empty) {
          // Map and attach a unified timestamp
          const docs = snap.docs
            .map((d) => {
              const data = d.data();
              const ts = data.timestamp ?? data.createdAt;
              return { id: d.id, ...data, _ts: ts };
            })
            // Sort descending by seconds
            .sort((a, b) => (b._ts?.seconds || 0) - (a._ts?.seconds || 0));

          setAdmission(docs[0]);
        }
      } catch (e) {
        console.error("Error loading admission:", e);
      } finally {
        setLoadingAdmission(false);
      }
    };
    loadAdmission();
  }, [user]);

  // Static placeholders for now
  const enrolledCourses = 3; // TODO: fetch real count
  const profileCompletion = 85; // TODO: compute real %
  const upcomingSessions = [
    // TODO: fetch real sessions
    {
      id: "1",
      course: "Self Defence Basics",
      date: "2025-06-15",
      time: "10:00 AM",
    },
    { id: "2", course: "Advanced Combat", date: "2025-06-20", time: "2:00 PM" },
  ];

  // Determine display name
  const displayName =
    admission?.fullName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Student";

  // Title-case status
  const applicationStatus = loadingAdmission
    ? "Loading…"
    : admission?.status
    ? admission.status.charAt(0).toUpperCase() + admission.status.slice(1)
    : "Not Applied";

  return (
    <>
      <Head>
        <title>Dashboard | JK Combat Academy</title>
      </Head>

      <main className="min-h-screen bg-brandBackground dark:bg-slate-900 p-8 font-sans">
        {/* Greeting */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-header text-brandTextPrimary">
            Welcome back, {displayName}!
          </h1>
          <p className="mt-1 text-brandTextSecondary font-body">
            Here’s what’s going on with your account.
          </p>
        </div>

        {/* My Admission Card */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingAdmission ? (
              <p className="text-center col-span-3">Loading admission…</p>
            ) : !admission ? (
              <p className="text-center col-span-3">You haven’t applied yet.</p>
            ) : (
              <>
                {/* Picture */}
                {admission.picture && (
                  <img
                    src={admission.picture}
                    alt="Your Portrait"
                    className="w-32 h-32 object-cover rounded-full border border-slate-300 dark:border-slate-700 mx-auto"
                  />
                )}

                {/* Key Details */}
                <div className="space-y-2 font-body text-sm text-brandTextSecondary dark:text-slate-300">
                  <p>
                    <span className="font-semibold text-brandTextPrimary">
                      Student ID:
                    </span>{" "}
                    {admission.studentId || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-brandTextPrimary">
                      Status:
                    </span>{" "}
                    {applicationStatus}
                  </p>
                  <p>
                    <span className="font-semibold text-brandTextPrimary">
                      DOB:
                    </span>{" "}
                    {admission.dateOfBirth}
                  </p>
                  <p>
                    <span className="font-semibold text-brandTextPrimary">
                      Gender:
                    </span>{" "}
                    {admission.gender}
                  </p>
                  <p>
                    <span className="font-semibold text-brandTextPrimary">
                      Mobile:
                    </span>{" "}
                    {admission.mobile}
                  </p>
                  <p>
                    <span className="font-semibold text-brandTextPrimary">
                      Email:
                    </span>{" "}
                    {admission.email}
                  </p>
                </div>

                {/* View Full Details */}
                <div className="text-center md:text-right">
                  <Link
                    href="/student/admission-details"
                    className="inline-block bg-brandAccent hover:bg-brandAccentHover text-brandTextOnAccent px-4 py-2 rounded-md font-body transition"
                  >
                    View Full Details
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-5 flex items-center">
            <BookOutlined className="h-8 w-8 text-brandAccent mr-4" />
            <div>
              <p className="text-2xl font-semibold text-brandTextPrimary">
                {enrolledCourses}
              </p>
              <p className="text-sm text-brandTextSecondary font-body">
                Courses Enrolled
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-5 flex items-center">
            <HourglassEmptyOutlined className="h-8 w-8 text-brandAccent mr-4" />
            <div>
              <p className="text-2xl font-semibold text-brandTextPrimary">
                {applicationStatus}
              </p>
              <p className="text-sm text-brandTextSecondary font-body">
                Application Status
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-5 flex items-center">
            <PersonOutlined className="h-8 w-8 text-brandAccent mr-4" />
            <div>
              <p className="text-2xl font-semibold text-brandTextPrimary">
                {profileCompletion}%
              </p>
              <p className="text-sm text-brandTextSecondary font-body">
                Profile Complete
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-5 flex items-center">
            <EventOutlined className="h-8 w-8 text-brandAccent mr-4" />
            <div>
              <p className="text-2xl font-semibold text-brandTextPrimary">
                {upcomingSessions.length}
              </p>
              <p className="text-sm text-brandTextSecondary font-body">
                Upcoming Sessions
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions Table */}
        <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-header text-brandTextPrimary">
              Upcoming Sessions
            </h2>
          </div>
          {upcomingSessions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {upcomingSessions.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-brandTextPrimary font-body">
                      {s.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-brandTextSecondary font-body">
                      {s.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-brandTextSecondary font-body">
                      {s.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link
                        href={`/student/sessions/${s.id}`}
                        className="text-brandAccent hover:underline text-sm font-body"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-brandTextSecondary font-body">
              You have no upcoming sessions.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
