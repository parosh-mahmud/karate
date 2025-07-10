// components/seminars/RunningSeminarForm.jsx
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
  ClockIcon,
  FlagIcon,
  LocationMarkerIcon,
  PhoneIcon,
} from "@heroicons/react/outline";

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

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const SEMINAR_FEE = 700;

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
      case "age":
        if (!value) return "Age is required.";
        if (!/^\d+$/.test(value) || parseInt(value, 10) < 10)
          return "Please enter a valid age (minimum 10).";
        return "";
      case "gender":
        return value ? "" : "Please select your gender.";
      case "occupation":
        return value.trim() ? "" : "Occupation is required.";
      case "nid":
        return value.trim() ? "" : "NID or Birth Certificate is required.";
      case "tshirtSize":
        return value ? "" : "Please select your T-shirt size.";
      case "address":
        return value.trim() ? "" : "Full Address is required.";
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
      case "transactionNumber":
        return value.trim() ? "" : "Transaction ID (TrxID) is required.";
      // 'institution' is optional, so no validation needed
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    for (const [key, value] of Object.entries(formData)) {
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

    setSubmitting(true);
    setSuccess(false);

    try {
      const counterRef = doc(db, "counters", "running_registrations_counter");
      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists()) {
          throw new Error("Counter document could not be found.");
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
      setErrors({});
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({
        form: "Failed to submit registration. Please check your connection and try again.",
      });
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
                  Thank you. Your submission will be verified soon.
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mb-12 rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-w-16 aspect-h-9 bg-black">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/run%20for%20july%201.jpg?alt=media&token=8faf5906-1c3a-4f36-9b08-6192e0599468"
              alt="Running Event Banner"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
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

            <div className="bg-white p-8 rounded-xl shadow-lg mb-8 font-bangla">
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
                <li>গিফ্ট শোল্ডার ব্যাগ</li>
                <li>মেডিকেল সুবিধা</li>
                <li>ওয়াশরুম সুবিধা</li>
                <li>নামাজের স্থান</li>
                <li>হাইড্রেশন পয়েন্ট</li>
                <li>ফটো বুথ</li>
                <li>কিট এক্সপো</li>
                <li>নাস্তা</li>
                <li>ফিনিশিং সিরিমনি</li>
                <li>সেরা রানারদের জন্য পুরুস্কার (মেল ও ফিমেল)</li>
                <li>***এবং আরও অনেক কিছু।</li>
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
                    ইভেন্টের যেকোন পরিবর্তন, পরিমার্জনের পূর্ণ অধিকার
                    কর্তৃপক্ষের রয়েছে।
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
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
                noValidate
              >
                {/* Form Fields with Required Sign */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={formData.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="10"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.age ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Occupation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.occupation ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.occupation && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.occupation}
                    </p>
                  )}
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
                    NID / Birth Certificate No.{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nid"
                    id="nid"
                    value={formData.nid}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nid ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.nid && (
                    <p className="text-red-500 text-xs mt-1">{errors.nid}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="tshirtSize"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    T-shirt Size (Chest) <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tshirtSize"
                    id="tshirtSize"
                    value={formData.tshirtSize}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${
                      errors.tshirtSize ? "border-red-500" : "border-gray-300"
                    }`}
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
                  {errors.tshirtSize && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tshirtSize}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
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
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <hr className="md:col-span-2 my-4 border-gray-200" />
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMethod"
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white ${
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
                    htmlFor="transactionNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Transaction ID (TrxID){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="transactionNumber"
                    id="transactionNumber"
                    value={formData.transactionNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.transactionNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.transactionNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.transactionNumber}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 transition-opacity"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Complete Registration"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky top-24 space-y-8 mt-8 lg:mt-0">
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Event Information
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <FlagIcon className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>
                      <strong>Event Date:</strong> August 02, 2025
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ClockIcon className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>
                      <strong>Reporting Time:</strong> 5:00 AM
                    </span>
                  </li>
                  <li className="flex items-start">
                    <LocationMarkerIcon className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>
                      <strong>Venue:</strong> TSC, Dhaka University
                    </span>
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
                        Send the fee via <strong>"Send Money"</strong> to:
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
                        After payment, copy the <strong>TrxID</strong>.
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
                        Enter your details and TrxID in the form to complete
                        registration.
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
