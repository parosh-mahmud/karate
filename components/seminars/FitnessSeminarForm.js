// components/seminars/FitnessSeminarForm.js
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Example Heroicons for the new layout
import {
  UserIcon,
  AcademicCapIcon,
  SparklesIcon,
  CalendarIcon,
  ClockIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";

export default function FitnessSeminarForm() {
  const [form, setForm] = useState({
    name: "",
    department: "",
    phone: "",
    email: "",
    question: "",
    complement: "",
    paymentMethod: "",
    transactionId: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SEMINAR_FEE = 50; // Seminar fee in BDT

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(db, "fitness_registrations"), {
        ...form,
        seminarFee: SEMINAR_FEE,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setForm({
        name: "",
        department: "",
        phone: "",
        email: "",
        question: "",
        complement: "",
        paymentMethod: "",
        transactionId: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        "There was an error submitting your registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fitness & Self-Defense Seminar
          </h1>
          <p className="text-lg text-gray-500">
            Specially organized for the students of Dhaka University.
          </p>
        </div>

        {/* Banner Image */}
        <div className="mb-12 rounded-lg overflow-hidden shadow-2xl aspect-w-16 aspect-h-7">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/fitness.jpg?alt=media&token=2a9d4a0e-8677-423a-a4f8-bd128537af15"
            alt="Fitness Seminar Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* Left Column: Details & Form */}
          <div className="lg:col-span-2">
            {/* ## NICELY FORMATTED BANGLA TEXT ## */}
            <div className="font-bangla bg-white p-8 rounded-xl shadow-lg mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                জুলাই অভ্যুত্থানের পর আমরা বুঝেছি আত্মরক্ষা কৌশল শেখা কতটা
                জরুরি। দৈনন্দিন জীবনে সুস্থ থাকার জন্য নিয়মিত ব্যায়ামের জুড়ি
                নেই, কিন্তু যুবকদের মাঝে এসব বিষয়ে অনেক ভুল ধারণা এবং অজ্ঞতা
                রয়েছে। এজন্যই ঢাকা বিশ্ববিদ্যালয়ের শিক্ষার্থীদের জন্য এই
                সেমিনারের আয়োজন।
              </p>

              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-teal-500 pb-2">
                আমাদের বক্তারা
              </h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <UserIcon className="w-5 h-5 mr-3 mt-1 text-teal-600 flex-shrink-0" />
                  <span>
                    ফিটনেস সম্পর্কে আলোচনা রাখবেন, **আবু সুফিয়ান তাজ**।
                  </span>
                </li>
                <li className="flex items-start">
                  <UserIcon className="w-5 h-5 mr-3 mt-1 text-teal-600 flex-shrink-0" />
                  <span>
                    সেল্ফ ডিফেন্স সম্পর্কে কথা বলবেন, ঢাকা বিশ্ববিদ্যালয়ের
                    সাবেক শিক্ষার্থী এবং বিখ্যাত বক্সার, **সুরা কৃষ্ণ চাকমা**।
                  </span>
                </li>
                <li className="flex items-start">
                  <UserIcon className="w-5 h-5 mr-3 mt-1 text-teal-600 flex-shrink-0" />
                  <span>
                    আরো থাকবেন ঢাকা বিশ্ববিদ্যালয় জুডো-কারাতে কোচ **আব্দুল্লাহ
                    আন নোমান** এবং **আরমান**।
                  </span>
                </li>
                <li className="flex items-start">
                  <AcademicCapIcon className="w-5 h-5 mr-3 mt-1 text-teal-600 flex-shrink-0" />
                  <span>
                    এছাড়া উপস্থিত থাকবেন ঢাকা বিশ্ববিদ্যালয়ের মাননীয়
                    শিক্ষকবৃন্দ এবং জেকে কমব্যাট একাডেমির কোচবৃন্দ।
                  </span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-teal-500 pb-2">
                অংশগ্রহণকারীদের জন্য
              </h3>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-start">
                  <SparklesIcon className="w-5 h-5 mr-3 mt-1 text-teal-600 flex-shrink-0" />
                  <span>
                    পূর্বে প্রশিক্ষণ গ্রহণকারী শিক্ষার্থীরা সার্টিফিকেট ও
                    পুরস্কার গ্রহণ করবেন।
                  </span>
                </li>
                <li className="flex items-start">
                  <SparklesIcon className="w-5 h-5 mr-3 mt-1 text-teal-600 flex-shrink-0" />
                  <span>
                    সেমিনারে অংশগ্রহণকারী সকল নতুন শিক্ষার্থী সার্টিফিকেট পাবেন।
                  </span>
                </li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md">
                <p className="font-bold">দ্রুত রেজিস্ট্রেশন করুন!</p>
                <p>
                  আমাদের সীমিত আসন পূরণ হয়ে গেলে রেজিস্ট্রেশন বন্ধ করে দেওয়া
                  হবে।
                </p>
              </div>
            </div>

            {/* Registration Form Section */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Registration Form
              </h2>
              {success && (
                <div
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6"
                  role="alert"
                >
                  <p className="font-bold">Registration Submitted!</p>
                  <p>
                    Thank you. We have received your submission and will confirm
                    it after payment verification.
                  </p>
                </div>
              )}
              {error && (
                <div
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6"
                  role="alert"
                >
                  <p className="font-bold">Submission Failed</p>
                  <p>{error}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
                noValidate
              >
                {/* Form fields... */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Md. Arian Ahmed"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Department / Institution
                  </label>
                  <input
                    type="text"
                    name="department"
                    id="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Your Department or Institution"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g., 01xxxxxxxxx"
                    required
                    pattern="01[3-9]\d{8}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your active email for confirmation"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Question (Fitness/Gym/Martial Art)
                  </label>
                  <textarea
                    name="question"
                    id="question"
                    value={form.question}
                    onChange={handleChange}
                    placeholder="What topics are you most interested in?"
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition resize-y"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="complement"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    name="complement"
                    id="complement"
                    value={form.complement}
                    onChange={handleChange}
                    placeholder="Any other comments or suggestions?"
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition resize-y"
                  ></textarea>
                </div>
                <hr className="md:col-span-2 my-4 border-gray-200" />
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Payment Method Used (01985540923 - bKash/Nagad/Rocket)
                  </label>
                  <select
                    name="paymentMethod"
                    id="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition bg-white"
                  >
                    <option value="" disabled>
                      Select Method
                    </option>
                    <option value="Bkash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="transactionId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Transaction Number (TrxID)
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    id="transactionId"
                    value={form.transactionId}
                    onChange={handleChange}
                    placeholder="Enter the payment TrxID"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition"
                  />
                </div>
                <div className="md:col-span-2 mt-6">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar with Payment Info */}
          <div className="lg:col-span-1">
            <div className="lg:sticky top-24 space-y-8">
              {/* Event Details Box */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Event Details
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-3 text-teal-600" />
                    <span>**Date:** July 26, 2025</span>
                  </li>
                  <li className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-3 text-teal-600" />
                    <span>**Time:** 03:00 PM - 07:00 PM</span>
                  </li>
                  <li className="flex items-center">
                    <LocationMarkerIcon className="w-5 h-5 mr-3 text-teal-600" />
                    <span>**Venue:** TSC, University of Dhaka</span>
                  </li>
                </ul>
              </div>

              {/* ## PAYMENT INSTRUCTIONS AT RIGHT SECTION ## */}
              <div className="bg-teal-50 border border-teal-200 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Registration & Payment
                </h3>
                <p className="text-gray-700 mb-5 text-lg">
                  Registration Fee:{" "}
                  <strong className="text-teal-600">BDT {SEMINAR_FEE}</strong>
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1 text-teal-600 font-bold">
                      1.
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">
                        Complete Payment
                      </h4>
                      <p className="text-sm text-gray-600">
                        Send the fee to one of the numbers below via **"Send
                        Money"**:
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm text-gray-700">
                        <li>
                          <strong>bKash:</strong> 01985540923
                        </li>
                        <li>
                          <strong>Nagad:</strong> 01985540923
                        </li>
                        <li>
                          <strong>Rocket:</strong> 01985540923
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1 text-teal-600 font-bold">
                      2.
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">
                        Save Transaction ID
                      </h4>
                      <p className="text-sm text-gray-600">
                        After payment, copy the **Transaction ID (TrxID)**.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1 text-teal-600 font-bold">
                      3.
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">
                        Fill Out Form
                      </h4>
                      <p className="text-sm text-gray-600">
                        Enter your details and the **TrxID** in the form to
                        complete registration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
