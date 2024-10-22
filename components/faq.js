import React from "react";
import Container from "./container";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

export default function Faq() {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-indigo-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
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
