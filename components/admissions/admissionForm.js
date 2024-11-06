"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { onAuthStateChanged } from "firebase/auth";

import {
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  auth,
} from "..//..//utils/firebase";

import {
  InfoOutlined,
  PaymentOutlined,
  SchoolOutlined,
} from "@mui/icons-material";

export default function AdmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State to show image preview
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Set up a listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Current User:", user); // Log the current user to the console
        setCurrentUser(user); // Save the current user in the state if needed
      } else {
        console.log("No user is signed in");
        setCurrentUser(null);
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const onSubmit = async (formData) => {
    if (!currentUser) {
      alert("Please sign in to submit the form.");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = "";

    try {
      if (formData.picture && formData.picture[0]) {
        const file = formData.picture[0];
        const reader = new FileReader();

        const imageUploadPromise = new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            const base64Image = reader.result;

            try {
              const response = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
              });

              if (response.ok) {
                const data = await response.json();
                imageUrl = data.url;
                resolve();
              } else {
                reject("Failed to upload image. Please try again.");
              }
            } catch (error) {
              console.error("Error uploading image:", error);
              reject("An error occurred while uploading the image.");
            }
          };

          reader.onerror = () => reject("Error reading the image file.");
          reader.readAsDataURL(file);
        });

        await imageUploadPromise;
      }

      const finalFormData = {
        ...formData,
        picture: imageUrl,
      };

      const response = await fetch("/api/saveFormdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: finalFormData,
          uid: currentUser.uid,
        }),
      });

      const result = await response.json();
      setSubmitMessage(
        result.success
          ? "Form submitted successfully!"
          : "Failed to submit form. Please try again."
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            JK Combat Academy Admission Form
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join our elite training program and unleash your potential
          </p>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Section - Form Fields */}
              <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Existing Form Fields */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="fatherName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Father's Name
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      {...register("fatherName", {
                        required: "Father's name is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.fatherName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.fatherName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="motherName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      id="motherName"
                      {...register("motherName", {
                        required: "Mother's name is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.motherName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.motherName.message}
                      </p>
                    )}
                  </div>

                  {/* Present Address */}
                  <div>
                    <label
                      htmlFor="presentAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Present Address
                    </label>
                    <input
                      type="text"
                      id="presentAddress"
                      {...register("presentAddress", {
                        required: "Present address is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.presentAddress && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.presentAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Permanent Address */}
                  <div>
                    <label
                      htmlFor="permanentAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Permanent Address
                    </label>
                    <input
                      type="text"
                      id="permanentAddress"
                      {...register("permanentAddress", {
                        required: "Permanent address is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.permanentAddress && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.permanentAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mobile
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      {...register("mobile", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: "Invalid mobile number format",
                        },
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your mobile number"
                    />
                    {errors.mobile && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email format",
                        },
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      {...register("dateOfBirth", {
                        required: "Date of birth is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  {/* Profession */}
                  <div>
                    <label
                      htmlFor="profession"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Profession
                    </label>
                    <input
                      type="text"
                      id="profession"
                      {...register("profession", {
                        required: "Profession is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.profession && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.profession.message}
                      </p>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label
                      htmlFor="bloodGroup"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      {...register("bloodGroup", {
                        required: "Blood group is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select blood group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                    {errors.bloodGroup && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.bloodGroup.message}
                      </p>
                    )}
                  </div>

                  {/* Nationality */}
                  <div>
                    <label
                      htmlFor="nationality"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nationality
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      {...register("nationality", {
                        required: "Nationality is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.nationality && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>

                  {/* NID */}
                  <div>
                    <label
                      htmlFor="nid"
                      className="block text-sm font-medium text-gray-700"
                    >
                      National ID (NID)
                    </label>
                    <input
                      type="text"
                      id="nid"
                      {...register("nid", {
                        required: "National ID is required",
                        pattern: {
                          value: /^[0-9]{10,17}$/,
                          message: "Invalid NID format",
                        },
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your NID number"
                    />
                    {errors.nid && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.nid.message}
                      </p>
                    )}
                  </div>

                  {/* Birth Certificate */}
                  <div>
                    <label
                      htmlFor="birthCertificate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Birth Certificate Number
                    </label>
                    <input
                      type="text"
                      id="birthCertificate"
                      {...register("birthCertificate", {
                        required: "Birth certificate number is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your birth certificate number"
                    />
                    {errors.birthCertificate && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.birthCertificate.message}
                      </p>
                    )}
                  </div>

                  {/* Religion */}
                  <div>
                    <label
                      htmlFor="religion"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Religion
                    </label>
                    <input
                      type="text"
                      id="religion"
                      {...register("religion", {
                        required: "Religion is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.religion && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.religion.message}
                      </p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label
                      htmlFor="picture"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Picture
                    </label>
                    <input
                      type="file"
                      id="picture"
                      {...register("picture")}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      onChange={(e) => {
                        handleImageUpload(e);
                        setUploadProgress(0); // Reset progress when selecting a new file
                      }}
                    />
                    {errors.picture && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.picture.message}
                      </p>
                    )}

                    {/* Display Image Preview */}
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Image Preview"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* Display Upload Progress */}
                    {isSubmitting && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Additional form fields here */}

                  {/* Payment Method Selection */}
                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      {...register("paymentMethod", {
                        required: "Please select a payment method",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a payment method</option>
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  {/* Transaction ID Field */}
                  <div>
                    <label
                      htmlFor="transactionId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      id="transactionId"
                      {...register("transactionId", {
                        required: "Transaction ID is required",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your transaction ID"
                    />
                    {errors.transactionId && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.transactionId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
                {submitMessage && (
                  <div className="mt-4 p-4 bg-green-100 rounded-md">
                    <p className="text-green-700">{submitMessage}</p>
                  </div>
                )}
              </div>

              {/* Right Section - Payment Instructions */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Important Information
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <InfoOutlined className="flex-shrink-0 h-6 w-6 text-indigo-600 mr-2" />
                    <p className="text-sm text-gray-600">
                      Please ensure all information provided is accurate and
                      up-to-date. Incomplete applications may delay the
                      admission process.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <PaymentOutlined className="flex-shrink-0 h-6 w-6 text-indigo-600 mr-2" />
                    <p className="text-sm text-gray-600">
                      To complete the application, please send a non-refundable
                      application fee of BDT 21500 via <b>Bkash</b> or{" "}
                      <b>Nagad</b> to the number <b>01985540923</b>.
                      <br />
                      <b>Instructions:</b> Send the amount, then note down the
                      transaction ID. Enter this transaction ID in the form.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <SchoolOutlined className="flex-shrink-0 h-6 w-6 text-indigo-600 mr-2" />
                    <p className="text-sm text-gray-600">
                      Course details and schedules will be provided upon
                      successful application. Be prepared for an intensive
                      training regimen.
                    </p>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">
                    Health Notice
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Applicants must be in good physical condition. A medical
                    clearance may be required before starting the program.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
