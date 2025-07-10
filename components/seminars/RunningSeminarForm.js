// components/seminars/RunningSeminarForm.jsx
import { useState } from "react";
import Image from "next/image"; // Import the Next.js Image component
import { db } from "@/lib/firebase";
import { useEffect } from "react";

import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import {
  CalendarIcon,
  ClockIcon,
  LocationMarkerIcon,
  GiftIcon,
  PhoneIcon,
  FlagIcon,
} from "@heroicons/react/outline";
import { FaFacebookSquare } from "react-icons/fa"; // npm install react-icons

const RunningSeminarForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    occupation: "",
    institution: "",

    nid: "",
    tshirtSize: "",
    address: "",
    phone: "",
    email: "",
    paymentMethod: "",
    transactionNumber: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const SEMINAR_FEE = 700;
  const shareUrl = "https://www.jkcombatacademy.com/seminars/run"; // Replace with your actual event URL
  const shareText = encodeURIComponent(
    "Join the July Run 2025! Register now and be part of the event."
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Show toast when success changes to true
  useEffect(() => {
    if (success) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const counterRef = doc(db, "counters", "running_registrations_counter");
      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists()) {
          throw new Error(
            "Counter document does not exist! Please create it in Firestore."
          );
        }
        const newRegistrationNumber = counterDoc.data().currentNumber + 1;
        const newRegRef = doc(collection(db, "running_registrations"));
        transaction.set(newRegRef, {
          ...formData,
          registrationNumber: newRegistrationNumber,
          seminarFee: SEMINAR_FEE,
          status: "pending",
          createdAt: serverTimestamp(),
        });
        transaction.update(counterRef, {
          currentNumber: newRegistrationNumber,
        });
      });

      setSuccess(true);
      setFormData({
        name: "",
        age: "",
        gender: "",
        occupation: "",
        institution: "",

        nid: "",
        tshirtSize: "",
        address: "",
        phone: "",
        email: "",
        paymentMethod: "",
        transactionNumber: "",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        "Failed to submit your registration. Please check details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            July Run 2025 Registration
          </h1>
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
                  Thank you. Your submission is received and will be verified
                  soon.
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ## FIXED IMAGE ## */}
        <div className="mb-12 rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-w-16 aspect-h-9 bg-black">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/run%20for%20july%201.jpg?alt=media&token=8faf5906-1c3a-4f36-9b08-6192e0599468"
              alt="Running Event Banner"
              layout="fill"
              objectFit="contain" // Use "contain" to ensure the full image is visible
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* Left Column: Details & Form */}
          <div className="lg:col-span-2">
            {/* {success && (
              <div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6"
                role="alert"
              >
                <p className="font-bold">Registration Submitted!</p>
                <p>
                  Thank you. Your submission is received and will be verified
                  soon.
                </p>
              </div>
            )} */}
            {error && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6"
                role="alert"
              >
                <p className="font-bold">Submission Failed</p>
                <p>{error}</p>
              </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-lg mb-8 font-bangla">
              {/* Event Details and other text content */}
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                'জুলাই'- ইংরেজি ক্যালেন্ডারের একটি মাস হলেও আমাদের জন্য তা এক
                অবিস্মরণীয় অধ্যায়, সাহসিকতার প্রতীক। বৈষম্য এবং অন্যায়ের
                বিরুদ্ধে রুখে দাঁড়ানো প্রত্যেক সাহসী জুলাই যোদ্ধাকে স্মরণপূর্বক
                তাদের প্রতি সম্মান প্রদর্শন করতে **UP Bangladesh** আয়োজন করছে
                **July Run 5k**।
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                সময়ের সাথে সাথে আমাদের নিজেদের সুস্বাস্থ্য নিয়ে সচেতনতাকে
                অনুপ্রেরণা যোগাচ্ছে রানিং ইভেন্টগুলো। ঠিক তেমনই অন্যায় কিংবা
                দুর্নীতির বিরুদ্ধে আওয়াজ তোলার অনুপ্রেরণা যোগায় 'জুলাই'। সেই
                বিজয়গাঁথা বাংলাদেশের মানচিত্রে এঁকে তৈরি করা হয়েছে এক চমৎকার
                মেডেল, আকর্ষণীয় মেডেলটি অর্জনের জন্য এখনই রেজিস্ট্রেশন করুন!
              </p>
              {/* <div className="flex justify-center mb-6">
                <button
                  aria-label="Share on Facebook"
                  onClick={() => {
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${shareText}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="text-blue-600 hover:text-blue-800 text-3xl transition"
                  type="button"
                >
                  <FaFacebookSquare />
                </button>
              </div> */}
              <div className="p-6 bg-slate-50 rounded-lg border mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  ইভেন্ট এক নজরে
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <p>
                    <strong>ইভেন্ট:</strong> July Run 5k
                  </p>
                  <p>
                    <strong>ভেনুঃ</strong> টিএসসি, ঢাকা বিশ্ববিদ্যালয়
                  </p>
                  <p>
                    <strong>মোটোঃ</strong> Run For Freedom
                  </p>
                  <p>
                    <strong>দূরত্ব:</strong> ৫ কিলোমিটার
                  </p>
                  <p>
                    <strong>সময়:</strong> ১ ঘণ্টা
                  </p>
                  <p>
                    <strong>রেজিস্ট্রেশন ডেডলাইন:</strong> ২০ জুলাই, ২০২৫
                  </p>
                  <p>
                    <strong>কিট এক্সপোঃ</strong> ১ আগস্ট (বিকাল ৩টা - রাত ৯টা)
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                যা যা থাকছে আপনার জন্য:
              </h3>
              <ul className="space-y-3 text-gray-600 mb-8 list-disc list-inside">
                <li>রান ফ্রেন্ডলি টি-শার্ট</li>
                <li>ফিনিশার মেডেল</li>
                <li>চিপ টাইমিং</li>
                <li>ইউনিক বিব নং</li>
                <li>ই-সার্টিফিকেট</li>
                <li>গিফ্ট শোলাডার ব্যাগ</li>
                <li>মেডিকেল সুবিধা</li>
                <li>ওয়াশরুম সুবিধা</li>
                <li>নামাজের স্থান</li>
                <li>হাইড্রেশন পয়েন্ট</li>
                <li>ফটো বুথ</li>
                <li>কিট এক্সপো</li>
                <li>নাস্তা</li>
                <li>ফিনিশিং শ্রিমনি</li>
                <li>সেরা রানারদের জন্য পুরুস্কার (মেল ও ফিমেল)</li>
                <li>***থাকছে আরও অনেক কিছু.</li>
              </ul>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                পার্টনারস
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-8">
                <p>
                  <strong>স্ট্র্যাটেজিক:</strong> UP Bangladesh
                </p>
                <p>
                  <strong>ইয়ুথ এঙ্গেজমেন্ট:</strong> JK Combat Academy
                </p>
                <p>
                  <strong>কমিউনিটি:</strong> Morning Raiders
                </p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md">
                <p className="font-bold">বিশেষ দ্রষ্টব্য:</p>
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>রেজিস্ট্রেশন এবং সাবমিশন ডেডলাইন বাড়ানো হবে না।</li>
                  <li>
                    স্লট সংখ্যা সীমিত, তাই দ্রুত রেজিস্ট্রেশন করার জন্য উৎসাহিত
                    করা হচ্ছে।
                  </li>
                  <li>
                    ইভেন্টের যেকোন পরিবর্তন, পরিমার্জনের পূর্ণ অধিকার কতৃপক্ষের
                    রয়েছে।
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Registration Form
              </h2>
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="institution"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    id="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nid"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    NID / Birth Certificate No.
                  </label>
                  <input
                    type="text"
                    name="nid"
                    id="nid"
                    value={formData.nid}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="tshirtSize"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    T-shirt Size (Chest)
                  </label>
                  <select
                    name="tshirtSize"
                    id="tshirtSize"
                    value={formData.tshirtSize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" disabled>
                      Select Size
                    </option>
                    <option value="S">S (36")</option>
                    <option value="M">M (38")</option>
                    <option value="L">L (40")</option>
                    <option value="XL">XL (42")</option>
                    <option value="XXL">XXL (44")</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="01[3-9]\d{8}"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <hr className="md:col-span-2 my-4 border-gray-200" />
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    htmlFor="transactionNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    name="transactionNumber"
                    id="transactionNumber"
                    value={formData.transactionNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2 mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Complete Registration"}
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
                  Event Information
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <FlagIcon className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>**Event Date:** August 02, 2025</span>
                  </li>
                  <li className="flex items-start">
                    <ClockIcon className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>**Reporting Time:** 5:00 AM</span>
                  </li>
                  <li className="flex items-start">
                    <LocationMarkerIcon className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>**Venue:** TSC, Dhaka University</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Registration & Payment
                </h3>
                <p className="text-gray-700 mb-5 text-lg">
                  Fee:{" "}
                  <strong className="text-blue-600">BDT {SEMINAR_FEE}</strong>
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1 text-blue-600 font-bold">
                      1.
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">
                        Complete Payment
                      </h4>
                      <p className="text-sm text-gray-600">
                        Send fee via **"Send Money"** to:
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm text-gray-700">
                        <li>
                          <strong>bKash/Rocket:</strong> 01985540923
                        </li>
                        <li>
                          <strong>Nagad:</strong> 01780941195
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1 text-blue-600 font-bold">
                      2.
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">
                        Save Transaction ID
                      </h4>
                      <p className="text-sm text-gray-600">
                        After payment, copy the **TrxID**.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1 text-blue-600 font-bold">
                      3.
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-800">
                        Fill Out Form
                      </h4>
                      <p className="text-sm text-gray-600">
                        Enter your details and TrxID in the form to complete.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Helpline</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Noman Abdullah: +8801912318382
                    </li>
                    <li className="flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      Arman Hossen: +8801985540923
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunningSeminarForm;
