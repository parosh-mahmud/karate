// components/seminars/FitnessSeminarForm.js
import { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
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
    hall: "",
    session: "",
    phone: "",
    email: "",
    question: "",
    complement: "",
    paymentMethod: "",
    transactionId: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const SEMINAR_FEE = 50;

  useEffect(() => {
    if (success) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Full Name is required.";
      case "department":
        return value.trim() ? "" : "Department or Institution is required.";
      case "hall":
        return value.trim() ? "" : "Hall name is required.";
      case "session":
        return value.trim() ? "" : "Session is required.";
      case "question":
        return value.trim()
          ? ""
          : "Please enter a question or topic of interest.";
      case "phone":
        if (!value) return "Phone number is required.";
        if (!/^01[3-9]\d{8}$/.test(value))
          return "Please enter a valid 11-digit Bangladeshi phone number.";
        return "";
      case "email":
        if (!value) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address.";
        return "";
      case "paymentMethod":
        return value ? "" : "Please select a payment method.";
      case "transactionId":
        return value.trim() ? "" : "Transaction ID (TrxID) is required.";
      // 'complement' is optional, no validation needed.
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    for (const [key, value] of Object.entries(form)) {
      const error = validateField(key, value);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    }
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setSuccess(false);

    try {
      const counterRef = doc(db, "counters", "fitness_registrations_counter");
      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists()) {
          throw new Error("Counter document is missing!");
        }
        const newRegNumber = counterDoc.data().currentNumber + 1;
        const newRegRef = doc(collection(db, "fitness_registrations"));
        transaction.set(newRegRef, {
          ...form,
          registrationNumber: newRegNumber,
          seminarFee: SEMINAR_FEE,
          status: "pending",
          createdAt: serverTimestamp(),
        });
        transaction.update(counterRef, { currentNumber: newRegNumber });
      });

      setSuccess(true);
      setForm({
        name: "",
        department: "",
        hall: "",
        session: "",
        phone: "",
        email: "",
        question: "",
        complement: "",
        paymentMethod: "",
        transactionId: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({
        form: "Submission failed. Please check your connection and try again.",
      });
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

        {showToast && (
          <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center pointer-events-none">
            <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up pointer-events-auto">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <div className="font-bold">Registration Submitted!</div>
                <div className="text-sm">
                  Thank you. Your submission will be confirmed after payment
                  verification.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-12 rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-w-16 aspect-h-9 bg-black">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/fitness.jpg?alt=media&token=2a9d4a0e-8677-423a-a4f8-bd128537af15"
              alt="Fitness Seminar Banner"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* Left Column: Details & Form */}
          <div className="lg:col-span-2">
            {errors.form && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6"
                role="alert"
              >
                <p className="font-bold">Submission Failed</p>
                <p>{errors.form}</p>
              </div>
            )}

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
                    ফিটনেস সম্পর্কে আলোচনা রাখবেন,{" "}
                    <strong>আবু সুফিয়ান তাজ</strong>।
                  </span>
                </li>
                <li className="flex items-start">
                  <UserIcon className="w-5 h-5 mr-3 mt-1 text-teal-600 flex-shrink-0" />
                  <span>
                    সেল্ফ ডিফেন্স সম্পর্কে কথা বলবেন, ঢাকা বিশ্ববিদ্যালয়ের
                    সাবেক শিক্ষার্থী এবং বিখ্যাত বক্সার,{" "}
                    <strong>সুরা কৃষ্ণ চাকমা</strong>।
                  </span>
                </li>
                <li className="flex items-start">
                  <UserIcon className="w-5 h-5 mr-3 mt-1 text-teal-600 flex-shrink-0" />
                  <span>
                    আরো থাকবেন ঢাকা বিশ্ববিদ্যালয় জুডো-কারাতে কোচ{" "}
                    <strong>আব্দুল্লাহ আন নোমান</strong> এবং{" "}
                    <strong>আরমান</strong>।
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

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Registration Form
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
                noValidate
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Md. Arian Ahmed"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Department / Institution{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    id="department"
                    value={form.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your Department or Institution"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition ${
                      errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="hall"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hall <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hall"
                    id="hall"
                    value={form.hall}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your Hall Name"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition ${
                      errors.hall ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.hall && (
                    <p className="text-red-500 text-xs mt-1">{errors.hall}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="session"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Session <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="session"
                    id="session"
                    value={form.session}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 2021-22"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition ${
                      errors.session ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.session && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.session}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone / WhatsApp Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 01xxxxxxxxx"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your active email for confirmation"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Question (Fitness/Gym/Martial Art){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="question"
                    id="question"
                    value={form.question}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="What topics are you most interested in?"
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition resize-y ${
                      errors.question ? "border-red-500" : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.question && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.question}
                    </p>
                  )}
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
                <div className="md:col-span-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 bg-teal-50 border border-teal-200 rounded px-3 py-2 mb-2">
                    <span className="font-semibold text-teal-700">
                      Send Money to:
                    </span>
                    <span className="font-semibold">bKash/Nagad/Rocket</span>
                    <span className="font-mono text-teal-700">01985540923</span>

                    <span className="ml-4 text-gray-600">
                      Use <span className="font-semibold">"Send Money"</span>{" "}
                      option, Copy your TransactionID and past here.
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Payment Method Used <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMethod"
                    id="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition bg-white ${
                      errors.paymentMethod
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Select Method
                    </option>
                    <option value="Bkash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="transactionId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Transaction Number (TrxID){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    id="transactionId"
                    value={form.transactionId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter the payment TrxID"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 transition ${
                      errors.transactionId
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.transactionId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.transactionId}
                    </p>
                  )}
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

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky top-24 space-y-8 mt-8 lg:mt-0">
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Event Details
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-3 text-teal-600" />
                    <span>
                      <strong>Date:</strong> July 26, 2025
                    </span>
                  </li>
                  <li className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-3 text-teal-600" />
                    <span>
                      <strong>Time:</strong> 03:00 PM - 07:00 PM
                    </span>
                  </li>
                  <li className="flex items-center">
                    <LocationMarkerIcon className="w-5 h-5 mr-3 text-teal-600" />
                    <span>
                      <strong>Venue:</strong> TSC, University of Dhaka
                    </span>
                  </li>
                </ul>
              </div>
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
                        Send fee via <strong>"Send Money"</strong> to:
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm text-gray-700">
                        <li>
                          <strong>bKash/Nagad/Rocket</strong> 01985540923
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
                        After payment, copy the{" "}
                        <strong>Transaction ID (TrxID)</strong>.
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
                        Enter details and the <strong>TrxID</strong> in the form
                        to complete registration.
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
