import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Disclosure, Transition } from "@headlessui/react";

export default function PopupWidget() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [Message, setMessage] = useState("");

  // IMPORTANT: Replace YOUR_ACCESS_KEY_HERE with your actual Web3Forms access key
  const YOUR_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

  const userName = useWatch({ control, name: "name", defaultValue: "Someone" });

  const onSubmit = async (data, e) => {
    console.log(data);
    // Add the access key to the data
    const finalData = { ...data, apikey: YOUR_ACCESS_KEY };

    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(finalData, null, 2), // Send finalData
    })
      .then(async (response) => {
        let json = await response.json();
        if (json.success) {
          setIsSuccess(true);
          setMessage(json.message);
          e.target.reset();
          reset();
        } else {
          setIsSuccess(false);
          setMessage(json.message);
        }
      })
      .catch((error) => {
        setIsSuccess(false);
        setMessage("Client Error. Please check the console.log for more info");
        console.log(error);
      });
  };

  const inputBaseClasses =
    "w-full px-3 py-2.5 placeholder-slate-400 dark:placeholder-slate-500 border rounded-md focus:outline-none focus:ring-2 text-sm font-body";
  const inputNormalClasses =
    "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-brandTextPrimary dark:text-slate-100 focus:border-brandAccentFocus focus:ring-brandAccentFocus/30";
  const inputErrorClasses =
    "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/30";
  const labelClasses =
    "block mb-1.5 text-sm font-medium text-brandTextSecondary dark:text-slate-300 font-body";

  return (
    <div className="font-sans">
      {" "}
      {/* Base font for the widget */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="fixed z-40 flex items-center justify-center transition-all duration-300 ease-in-out 
                                          bg-brandAccent rounded-full shadow-lg right-5 bottom-5 w-14 h-14 
                                          focus:outline-none hover:bg-brandAccentHover focus:bg-brandAccentHover 
                                          focus:ring-4 focus:ring-brandAccentFocus/50"
            >
              <span className="sr-only">Open Contact form Widget</span>
              <Transition
                show={!open}
                enter="transition duration-200 transform ease"
                enterFrom="opacity-0 -rotate-45 scale-75"
                leave="transition duration-100 transform ease"
                leaveTo="opacity-0 -rotate-45"
                className="absolute w-6 h-6 text-brandTextOnAccent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </Transition>

              <Transition
                show={open}
                enter="transition duration-200 transform ease"
                enterFrom="opacity-0 rotate-45 scale-75"
                leave="transition duration-100 transform ease"
                leaveTo="opacity-0 rotate-45"
                className="absolute w-6 h-6 text-brandTextOnAccent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Transition>
            </Disclosure.Button>

            <Transition
              as={React.Fragment} // Use Fragment for seamless transition with Disclosure.Panel
              show={open} // Control transition with open state
              enter="transition duration-200 transform ease-out"
              enterFrom="opacity-0 translate-y-5"
              enterTo="opacity-100 translate-y-0"
              leave="transition duration-200 transform ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-5"
            >
              <Disclosure.Panel
                static /* Keep static for Headless UI to manage show state */
                className="fixed z-50 bottom-[100px] top-0 right-0 left-0 sm:top-auto sm:right-5 sm:left-auto 
                           flex flex-col overflow-hidden 
                           w-full sm:w-[360px] min-h-[300px] sm:h-[auto] sm:max-h-[calc(100vh-120px)]
                           bg-white dark:bg-brandTextSoft shadow-2xl rounded-lg border border-slate-300 dark:border-slate-700"
              >
                <div className="flex flex-col items-center justify-center h-auto p-5 bg-brandAccent">
                  <h3 className="text-lg font-semibold text-brandTextOnAccent font-header">
                    How can we help?
                  </h3>
                  <p className="text-sm text-brandTextOnAccent/80 font-body mt-1">
                    We usually respond in a few hours
                  </p>
                </div>

                <div className="flex-grow h-full p-6 overflow-y-auto bg-brandBackground dark:bg-slate-700">
                  {!isSubmitSuccessful && (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      {/* Hidden fields for Web3Forms */}
                      <input
                        type="hidden"
                        value={YOUR_ACCESS_KEY}
                        {...register("apikey")}
                      />
                      <input
                        type="hidden"
                        value={`${userName} sent a message from JKCA Site`}
                        {...register("subject")}
                      />
                      <input
                        type="hidden"
                        value="JK Combat Academy"
                        {...register("from_name")}
                      />
                      <input
                        type="checkbox"
                        className="hidden"
                        style={{ display: "none" }}
                        {...register("botcheck")}
                      ></input>

                      <div className="mb-4">
                        <label htmlFor="full_name" className={labelClasses}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          placeholder="John Doe"
                          {...register("name", {
                            required: "Full name is required",
                            maxLength: 80,
                          })}
                          className={`${inputBaseClasses} ${
                            errors.name ? inputErrorClasses : inputNormalClasses
                          }`}
                        />
                        {errors.name && (
                          <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                            {errors.name.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="email" className={labelClasses}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register("email", {
                            required: "Enter your email",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Please enter a valid email",
                            },
                          })}
                          placeholder="you@company.com"
                          className={`${inputBaseClasses} ${
                            errors.email
                              ? inputErrorClasses
                              : inputNormalClasses
                          }`}
                        />
                        {errors.email && (
                          <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                            {errors.email.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-5">
                        <label htmlFor="message" className={labelClasses}>
                          Your Message
                        </label>
                        <textarea
                          rows="4"
                          id="message"
                          {...register("message", {
                            required: "Enter your Message",
                          })}
                          placeholder="Your Message..."
                          className={`${inputBaseClasses} h-28 resize-none ${
                            errors.message
                              ? inputErrorClasses
                              : inputNormalClasses
                          }`}
                        />
                        {errors.message && (
                          <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                            {errors.message.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-3 py-3 text-sm font-semibold text-brandTextOnAccent bg-brandAccent rounded-md 
                                     hover:bg-brandAccentHover focus:bg-brandAccentHover 
                                     focus:outline-none focus:ring-2 focus:ring-brandAccentFocus focus:ring-opacity-50
                                     disabled:opacity-70 disabled:cursor-not-allowed font-body"
                        >
                          {isSubmitting ? (
                            <svg
                              className="w-5 h-5 mx-auto text-white animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            "Send Message"
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {isSubmitSuccessful && isSuccess && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <svg
                        width="60"
                        height="60"
                        className="text-green-500 dark:text-green-400 mb-4"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M26.6666 50L46.6666 66.6667L73.3333 33.3333M50 96.6667C43.8716 96.6667 37.8033 95.4596 32.1414 93.1144C26.4796 90.7692 21.3351 87.3317 17.0017 82.9983C12.6683 78.6649 9.23082 73.5204 6.8856 67.8586C4.54038 62.1967 3.33331 56.1283 3.33331 50C3.33331 43.8716 4.54038 37.8033 6.8856 32.1414C9.23082 26.4796 12.6683 21.3351 17.0017 17.0017C21.3351 12.6683 26.4796 9.23084 32.1414 6.88562C37.8033 4.5404 43.8716 3.33333 50 3.33333C62.3767 3.33333 74.2466 8.24998 82.9983 17.0017C91.75 25.7534 96.6666 37.6232 96.6666 50C96.6666 62.3768 91.75 74.2466 82.9983 82.9983C74.2466 91.75 62.3767 96.6667 50 96.6667Z"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                      </svg>
                      <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 font-header">
                        Message Sent Successfully
                      </h3>
                      <p className="mt-2 text-sm text-brandTextSecondary dark:text-slate-300 font-body md:px-3">
                        {Message}
                      </p>
                      <button
                        className="mt-8 text-sm text-brandAccent dark:text-brandAccentFocus hover:underline font-medium font-body"
                        onClick={() => {
                          reset();
                          setIsSuccess(false);
                          setIsSubmitSuccessful(
                            false
                          ); /* Need to reset isSubmitSuccessful too */
                        }}
                      >
                        Send Another Message
                      </button>
                    </div>
                  )}

                  {isSubmitSuccessful && !isSuccess && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 97 97"
                        className="text-red-500 dark:text-red-400 mb-4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.9995 69C43.6205 53.379 52.3786 44.621 67.9995 29M26.8077 29L67.9995 69M48.2189 95C42.0906 95 36.0222 93.7929 30.3604 91.4477C24.6985 89.1025 19.554 85.6651 15.2206 81.3316C10.8872 76.9982 7.44975 71.8538 5.10454 66.1919C2.75932 60.53 1.55225 54.4617 1.55225 48.3333C1.55225 42.205 2.75932 36.1366 5.10454 30.4748C7.44975 24.8129 10.8872 19.6684 15.2206 15.335C19.554 11.0016 24.6985 7.56418 30.3604 5.21896C36.0222 2.87374 42.0906 1.66667 48.2189 1.66667C60.5957 1.66667 72.4655 6.58333 81.2172 15.335C89.9689 24.0867 94.8856 35.9566 94.8856 48.3333C94.8856 60.7101 89.9689 72.58 81.2172 81.3316C72.4655 90.0833 60.5957 95 48.2189 95Z"
                          stroke="CurrentColor"
                          strokeWidth="3"
                        />
                      </svg>
                      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 py-3 font-header">
                        Oops, Something Went Wrong!
                      </h3>
                      <p className="text-sm text-brandTextSecondary dark:text-slate-300 font-body md:px-3">
                        {Message}
                      </p>
                      <button
                        className="mt-8 text-sm text-brandAccent dark:text-brandAccentFocus hover:underline font-medium font-body"
                        onClick={() => {
                          reset();
                          setIsSuccess(false);
                          setIsSubmitSuccessful(false);
                        }}
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
}
