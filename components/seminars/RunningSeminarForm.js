// components/seminars/RunningSeminarForm.jsx
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const RunningSeminarForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    occupation: "",
    institution: "",
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

  const SEMINAR_FEE = 600; // Seminar fee in BDT

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(""); // Clear previous errors
    setSuccess(false); // Clear previous success message

    try {
      await addDoc(collection(db, "running_registrations"), {
        ...formData,
        seminarFee: SEMINAR_FEE, // Add seminar fee to the document
        status: "pending", // Add a status field for payment verification
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      // Reset form fields after successful submission
      setFormData({
        name: "",
        age: "",
        occupation: "",
        institution: "",
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
        "Failed to submit your registration. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Running Seminar Registration
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-bangla">
              আমাদের এই রানিং সেমিনারে আপনাকে স্বাগতম! সকল স্তরের দৌড়বিদদের জন্য
              বিশেষভাবে ডিজাইন করা এই সেমিনারে আপনি দৌড়ের সঠিক কৌশল, ইনজুরি
              প্রতিরোধ, পুষ্টি এবং প্রশিক্ষণের বিভিন্ন দিক সম্পর্কে জানতে
              পারবেন। এই সেমিনারটি আপনাকে নিরাপদে দৌড়ানোর জ্ঞান দিয়ে আপনার
              পারফরম্যান্স উন্নত করতে সহায়তা করবে।
            </p>
          </div>

          {/* Banner Image */}
          <div className="mb-10 rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/jkcombat-27a89.firebasestorage.app/o/galleryImages%2F129ee04f-0ee6-4a2c-9a3d-86b2802c5b94-IMG_0983.JPG?alt=media&token=5c5afafd-db2c-4635-86f9-cb218d2fbc1a"
              alt="Running Seminar Banner"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Payment Instructions Section */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Registration Fee & Payment Process
            </h3>
            <p className="text-gray-700 mb-5 text-lg">
              The registration fee for the seminar is{" "}
              <strong className="text-blue-600">BDT {SEMINAR_FEE}</strong>.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 font-bold">
                  1.
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Complete Your Payment
                  </h4>
                  <p className="text-gray-600">
                    Please send the registration fee to one of the following
                    mobile banking numbers using the **"Send Money"** option:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
                    <li>
                      <strong>bKash:</strong> 01985540923 (Personal)
                    </li>
                    <li>
                      <strong>Nagad:</strong> 01985540923 (Personal)
                    </li>
                    <li>
                      <strong>Rocket:</strong> 01985540923 (Personal)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 font-bold">
                  2.
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Save Your Transaction ID
                  </h4>
                  <p className="text-gray-600">
                    After a successful payment, you will receive a unique
                    **Transaction ID (TrxID)**. Please copy or note down this ID
                    carefully.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 font-bold">
                  3.
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Fill Out the Form
                  </h4>
                  <p className="text-gray-600">
                    Complete the registration form below with your personal
                    details and enter the Transaction ID in the designated field
                    to confirm your payment.
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
                Thank you for registering. Your submission has been received and
                you will be notified once your payment is verified.
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
            {/* Form Fields */}
            {/* Full Name */}
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
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            {/* Age */}
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
                placeholder="Your age in years"
                value={formData.age}
                onChange={handleChange}
                required
                min="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            {/* Occupation */}
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
                placeholder="e.g., Student, Doctor, Engineer"
                value={formData.occupation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            {/* Institution */}
            <div>
              <label
                htmlFor="institution"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Institution / Organization
              </label>
              <input
                type="text"
                name="institution"
                id="institution"
                placeholder="Name of your institution"
                value={formData.institution}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            {/* T-shirt Size */}
            <div className="md:col-span-2">
              <label
                htmlFor="tshirtSize"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                T-shirt Size (Chest Measurement)
              </label>
              <select
                name="tshirtSize"
                id="tshirtSize"
                value={formData.tshirtSize}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
              >
                <option value="" disabled>
                  Select your T-shirt Size
                </option>
                <option value="S">S (36" chest)</option>
                <option value="M">M (38" chest)</option>
                <option value="L">L (40" chest)</option>
                <option value="XL">XL (42" chest)</option>
                <option value="XXL">XXL (44" chest)</option>
              </select>
            </div>

            {/* Full Address */}
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
                placeholder="Your complete mailing address for correspondence"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y"
              ></textarea>
            </div>

            {/* Phone */}
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
                placeholder="e.g., 01xxxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            {/* Email */}
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
                placeholder="Your active email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
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
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
              >
                <option value="" disabled>
                  Select Payment Method
                </option>
                <option value="Bkash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>

            {/* Transaction Number */}
            <div>
              <label
                htmlFor="transactionNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Transaction Number (TrxID)
              </label>
              <input
                type="text"
                name="transactionNumber"
                id="transactionNumber"
                placeholder="Enter the payment TrxID"
                value={formData.transactionNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RunningSeminarForm;
