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
} from "../../utils/firebase"; // Corrected path

import {
  InfoOutlined,
  PaymentOutlined,
  SchoolOutlined,
} from "@mui/icons-material";

export default function AdmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Note: This state needs to be updated during upload for the progress bar to reflect changes.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Added reset from react-hook-form
  } = useForm();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Current User:", user);
        setCurrentUser(user);
      } else {
        console.log("No user is signed in");
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (formData) => {
    if (!currentUser) {
      alert("Please sign in to submit the form."); // Consider a more styled modal/toast here
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(""); // Clear previous messages
    let imageUrl = "";

    try {
      if (formData.picture && formData.picture[0]) {
        const file = formData.picture[0];
        const reader = new FileReader();

        // Simulate progress for demo; replace with actual progress logic if available
        setUploadProgress(0);
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          currentProgress += 10;
          if (currentProgress <= 100) {
            setUploadProgress(currentProgress);
          } else {
            clearInterval(progressInterval);
          }
        }, 100); // Adjust timing for simulation

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
                setUploadProgress(100); // Ensure progress is 100 on success
                clearInterval(progressInterval);
                resolve();
              } else {
                clearInterval(progressInterval);
                setUploadProgress(0); // Reset progress on failure
                reject("Failed to upload image. Please try again.");
              }
            } catch (error) {
              clearInterval(progressInterval);
              setUploadProgress(0);
              console.error("Error uploading image:", error);
              reject("An error occurred while uploading the image.");
            }
          };
          reader.onerror = () => {
            clearInterval(progressInterval);
            setUploadProgress(0);
            reject("Error reading the image file.");
          };
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: finalFormData,
          uid: currentUser.uid,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitMessage("Form submitted successfully!");
        reset(); // Reset form fields on success
        setImagePreview(null); // Clear image preview
      } else {
        setSubmitMessage("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      if (!submitMessage.includes("successfully")) {
        // Don't reset progress if submission failed mid-upload
        setUploadProgress(0);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadProgress(0); // Reset progress when a new file is selected
      setSubmitMessage(""); // Clear submission message
    } else {
      setImagePreview(null);
    }
  };

  const commonInputClassName =
    "mt-1 block w-full border border-trueGray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brandBlue focus:border-brandBlue sm:text-sm font-body";
  const labelClassName = "block text-sm font-medium text-primary font-body";
  const errorClassName = "mt-2 text-sm text-brandRed font-body";

  return (
    <div className="min-h-screen bg-neutral py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-primary sm:text-4xl font-header">
            JK Combat Academy Admission Form
          </h2>
          <p className="mt-4 text-lg text-trueGray-700 font-body">
            Join our elite training program and unleash your potential
          </p>
        </div>
        <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
              {/* Left Section - Form Fields */}
              <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Form Fields */}
                  <div>
                    <label htmlFor="fullName" className={labelClassName}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.fullName && (
                      <p className={errorClassName}>
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="fatherName" className={labelClassName}>
                      Father's Name
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      {...register("fatherName", {
                        required: "Father's name is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.fatherName && (
                      <p className={errorClassName}>
                        {errors.fatherName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="motherName" className={labelClassName}>
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      id="motherName"
                      {...register("motherName", {
                        required: "Mother's name is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.motherName && (
                      <p className={errorClassName}>
                        {errors.motherName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="presentAddress" className={labelClassName}>
                      Present Address
                    </label>
                    <input
                      type="text"
                      id="presentAddress"
                      {...register("presentAddress", {
                        required: "Present address is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.presentAddress && (
                      <p className={errorClassName}>
                        {errors.presentAddress.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="permanentAddress"
                      className={labelClassName}
                    >
                      Permanent Address
                    </label>
                    <input
                      type="text"
                      id="permanentAddress"
                      {...register("permanentAddress", {
                        required: "Permanent address is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.permanentAddress && (
                      <p className={errorClassName}>
                        {errors.permanentAddress.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="mobile" className={labelClassName}>
                      Mobile
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      {...register("mobile", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message:
                            "Invalid mobile number format (10-15 digits)",
                        },
                      })}
                      className={commonInputClassName}
                      placeholder="Enter your mobile number"
                    />
                    {errors.mobile && (
                      <p className={errorClassName}>{errors.mobile.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClassName}>
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
                      className={commonInputClassName}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className={errorClassName}>{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className={labelClassName}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      {...register("dateOfBirth", {
                        required: "Date of birth is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.dateOfBirth && (
                      <p className={errorClassName}>
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className={labelClassName}>
                      Gender
                    </label>
                    <select
                      id="gender"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className={commonInputClassName}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className={errorClassName}>{errors.gender.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="profession" className={labelClassName}>
                      Profession
                    </label>
                    <input
                      type="text"
                      id="profession"
                      {...register("profession", {
                        required: "Profession is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.profession && (
                      <p className={errorClassName}>
                        {errors.profession.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bloodGroup" className={labelClassName}>
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      {...register("bloodGroup", {
                        required: "Blood group is required",
                      })}
                      className={commonInputClassName}
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
                      <p className={errorClassName}>
                        {errors.bloodGroup.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="nationality" className={labelClassName}>
                      Nationality
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      {...register("nationality", {
                        required: "Nationality is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.nationality && (
                      <p className={errorClassName}>
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="nid" className={labelClassName}>
                      National ID (NID)
                    </label>
                    <input
                      type="text"
                      id="nid"
                      {...register("nid", {
                        required: "National ID is required",
                        pattern: {
                          value: /^[0-9]{10,17}$/,
                          message: "Invalid NID format (10-17 digits)",
                        },
                      })}
                      className={commonInputClassName}
                      placeholder="Enter your NID number"
                    />
                    {errors.nid && (
                      <p className={errorClassName}>{errors.nid.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="birthCertificate"
                      className={labelClassName}
                    >
                      Birth Certificate Number
                    </label>
                    <input
                      type="text"
                      id="birthCertificate"
                      {...register("birthCertificate", {
                        required: "Birth certificate number is required",
                      })}
                      className={commonInputClassName}
                      placeholder="Enter your birth certificate number"
                    />
                    {errors.birthCertificate && (
                      <p className={errorClassName}>
                        {errors.birthCertificate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="religion" className={labelClassName}>
                      Religion
                    </label>
                    <input
                      type="text"
                      id="religion"
                      {...register("religion", {
                        required: "Religion is required",
                      })}
                      className={commonInputClassName}
                    />
                    {errors.religion && (
                      <p className={errorClassName}>
                        {errors.religion.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="picture" className={labelClassName}>
                      Upload Picture
                    </label>
                    <input
                      type="file"
                      id="picture"
                      {...register("picture")}
                      accept="image/*"
                      className="mt-1 block w-full text-sm text-trueGray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brandBlue/10 file:text-brandBlue hover:file:bg-brandBlue/20 cursor-pointer font-body"
                      onChange={handleImageUpload}
                    />
                    {errors.picture && (
                      <p className={errorClassName}>{errors.picture.message}</p>
                    )}

                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Image Preview"
                          className="w-32 h-32 object-cover rounded-md border border-trueGray-300"
                        />
                      </div>
                    )}

                    {isSubmitting &&
                      formData.picture &&
                      formData.picture[0] && ( // Only show progress if a picture is being submitted
                        <div className="mt-4 w-full bg-trueGray-200 rounded-full h-2.5">
                          <div
                            className="bg-brandBlue h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                  </div>

                  <div>
                    <label htmlFor="paymentMethod" className={labelClassName}>
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      {...register("paymentMethod", {
                        required: "Please select a payment method",
                      })}
                      className={commonInputClassName}
                    >
                      <option value="">Select a payment method</option>
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className={errorClassName}>
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="transactionId" className={labelClassName}>
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      id="transactionId"
                      {...register("transactionId", {
                        required: "Transaction ID is required",
                      })}
                      className={commonInputClassName}
                      placeholder="Enter your transaction ID"
                    />
                    {errors.transactionId && (
                      <p className={errorClassName}>
                        {errors.transactionId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-neutral bg-secondary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-60 disabled:cursor-not-allowed font-header transition-colors duration-300"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
                {submitMessage && (
                  <div
                    className={`mt-6 p-4 rounded-md text-center ${
                      submitMessage.includes("successfully")
                        ? "bg-brandGreen/20 text-emerald-800"
                        : "bg-brandRed/10 text-brandRed"
                    }`}
                  >
                    <p className="font-medium font-body">{submitMessage}</p>
                  </div>
                )}
              </div>

              {/* Right Section - Payment Instructions */}
              <div className="bg-trueGray-50 p-6 rounded-lg lg:sticky lg:top-12">
                {" "}
                {/* Made sticky for better UX on larger screens */}
                <h3 className="text-xl font-semibold text-primary mb-6 font-header">
                  Important Information
                </h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <InfoOutlined className="flex-shrink-0 h-6 w-6 text-brandBlue mr-3 mt-0.5" />
                    <p className="text-sm text-trueGray-700 font-body">
                      Please ensure all information provided is accurate and
                      up-to-date. Incomplete applications may delay the
                      admission process.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <PaymentOutlined className="flex-shrink-0 h-6 w-6 text-brandBlue mr-3 mt-0.5" />
                    <div className="text-sm text-trueGray-700 font-body">
                      <p className="font-semibold text-primary mb-1">
                        Payment Details:
                      </p>
                      To complete the application, please send a non-refundable
                      application fee of{" "}
                      <strong className="text-primary">BDT 21500</strong> via{" "}
                      <strong className="text-primary">Bkash</strong> or{" "}
                      <strong className="text-primary">Nagad</strong> to the
                      number{" "}
                      <strong className="text-secondary">01985540923</strong>.
                      <br /> <br />
                      <strong className="text-primary">
                        Instructions:
                      </strong>{" "}
                      Send the amount, then note down the transaction ID. Enter
                      this transaction ID in the form.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <SchoolOutlined className="flex-shrink-0 h-6 w-6 text-brandBlue mr-3 mt-0.5" />
                    <p className="text-sm text-trueGray-700 font-body">
                      Course details and schedules will be provided upon
                      successful application. Be prepared for an intensive
                      training regimen.
                    </p>
                  </li>
                </ul>
                <div className="mt-8 p-4 bg-accent/10 rounded-md border border-accent/30">
                  <h4 className="text-base font-semibold text-amber-800 mb-2 font-header flex items-center">
                    <InfoOutlined className="h-5 w-5 mr-2 text-amber-700" />
                    Health Notice
                  </h4>
                  <p className="text-sm text-amber-700 font-body">
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
