// components/Faq.js
import React from "react";
import Container from "./container";
import { Disclosure } from "@headlessui/react";
// Corrected import path for ChevronUpIcon (reverted to v1 style)
import { ChevronUpIcon } from "@heroicons/react/solid";

export default function Faq() {
  return (
    <Container className="!p-0 font-sans">
      {" "}
      {/* Apply base font-sans */}
      <div className="w-full max-w-2xl p-2 mx-auto">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-4">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className="flex items-center justify-between w-full px-5 py-4 
                                                text-lg text-left rounded-lg 
                                                bg-white dark:bg-brandTextSoft 
                                                hover:bg-slate-50 dark:hover:bg-slate-700 
                                                text-brandTextPrimary dark:text-slate-100 
                                                focus:outline-none focus-visible:ring-2 
                                                focus-visible:ring-brandAccentFocus focus-visible:ring-opacity-75 
                                                font-semibold font-header shadow-sm"
                  >
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-6 h-6 text-brandAccent transition-transform duration-200`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-5 pt-3 pb-5 text-brandTextSecondary dark:text-slate-300 font-body text-base leading-relaxed">
                    {item.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
}

const faqdata = [
  {
    question: "What combat training programs do you offer?",
    answer:
      "We offer a range of combat training programs, including martial arts, self-defense, weapon training, and fitness conditioning. Each program is tailored for different skill levels, from beginners to advanced fighters.",
  },
  {
    question: "Do I need prior experience to join the academy?",
    answer:
      "No, you don’t need any prior experience. Our programs are designed to cater to all levels, whether you’re a beginner or an experienced martial artist.",
  },
  {
    question: "What is the age requirement to join JK Combat Academy?",
    answer:
      "We offer training for all ages. Kids can start from age 6, and we also have specialized programs for teens and adults.",
  },
  {
    question: "Do you offer private training sessions?",
    answer:
      "Yes, we offer private training sessions for those looking for one-on-one guidance. Please contact us to schedule a session with one of our expert instructors.",
  },
  {
    question: "What is your membership policy?",
    answer:
      "Our memberships come in flexible options, including monthly and yearly plans. Family packages and group discounts are also available.",
  },
];
