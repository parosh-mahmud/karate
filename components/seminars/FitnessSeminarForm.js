// components/seminars/FitnessSeminarForm.js
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function FitnessSeminarForm() {
  const [form, setForm] = useState({
    name: "",
    department: "",
    phone: "",
    question: "",
    complement: "",
    paymentMethod: "",
    transactionId: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SEMINAR_FEE = 100; // Seminar fee in BDT

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
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fitness Seminar Registration
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-bangla">
              আমাদের ফিটনেস সেমিনারে যোগ দিন এবং আপনার স্বাস্থ্য ও সুস্থতার
              যাত্রা শুরু করুন! এই সেমিনারে আপনি ফিটনেস, জিম প্রশিক্ষণ এবং
              মার্শাল আর্ট সম্পর্কিত প্রয়োজনীয় জ্ঞান অর্জন করবেন। এখনই নিবন্ধন
              করে আপনার ফিটনেস লক্ষ্য অর্জনের দিকে প্রথম পদক্ষেপ নিন।
            </p>
          </div>

          {/* Banner Image */}
          <div className="mb-10 rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/galleryImages%2F129ee04f-0ee6-4a2c-9a3d-86b2802c5b94-IMG_0983.JPG?alt=media&token=5c5afafd-db2c-4635-86f9-cb218d2fbc1a"
              alt="Fitness Seminar Banner"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Payment Instructions Section */}
          <div className="bg-teal-50 border border-teal-200 p-6 rounded-lg mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Registration Fee & Payment Process
            </h3>
            <p className="text-gray-700 mb-5 text-lg">
              The registration fee for the seminar is{" "}
              <strong className="text-teal-600">BDT {SEMINAR_FEE}</strong>.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-teal-600 font-bold">
                  1.
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Complete Your Payment
                  </h4>
                  <p className="text-gray-600">
                    Please send the registration fee to one of the following
                    numbers using the **"Send Money"** option:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
                    <li>
                      <strong>bKash:</strong> 01XXXXXXXXX (Personal)
                    </li>
                    <li>
                      <strong>Nagad:</strong> 01XXXXXXXXX (Personal)
                    </li>
                    <li>
                      <strong>Rocket:</strong> 01XXXXXXXXX (Personal)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-teal-600 font-bold">
                  2.
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Save Your Transaction ID
                  </h4>
                  <p className="text-gray-600">
                    After payment, you'll receive a **Transaction ID (TrxID)**.
                    Please copy or note it down.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-teal-600 font-bold">
                  3.
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Fill Out the Form Below
                  </h4>
                  <p className="text-gray-600">
                    Enter your details and the **TrxID** in the form to complete
                    your registration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Success & Error Messages */}
          {success && (
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6"
              role="alert"
            >
              <p className="font-bold">Registration Submitted!</p>
              <p>
                Thank you. We have received your submission and will confirm it
                after payment verification.
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

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
            noValidate
          >
            {/* Full Name */}
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

            {/* Department / Institution */}
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

            {/* Phone Number */}
            <div className="md:col-span-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>

            {/* Question */}
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

            {/* Additional Comments */}
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

            {/* Divider */}
            <hr className="md:col-span-2 my-4 border-gray-200" />

            {/* Payment Method */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Payment Method Used
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

            {/* Transaction ID */}
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

            {/* Submit Button */}
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
    </div>
  );
}
