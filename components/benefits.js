import Image from "next/image";
import React from "react";
import Container from "./container";

export default function Benefits(props) {
  const { data } = props;

  return (
    <>
      <Container className="flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap font-sans bg-brandBackground dark:bg-brandTextPrimary">
        <div
          className={`flex items-center justify-center w-full lg:w-1/2 ${
            props.imgPos === "right" ? "lg:order-1" : ""
          }`}
        >
          <div>
            <Image
              src={data.image}
              width="521"
              height="482"
              alt={data.title || "Benefits Illustration"}
              layout="intrinsic"
              placeholder="blur"
              blurDataURL={
                data.blurDataURL ||
                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..." // Default fallback blurDataURL
              }
            />
          </div>
        </div>

        <div
          className={`flex flex-wrap items-center w-full lg:w-1/2 ${
            props.imgPos === "right" ? "lg:justify-end" : ""
          }`}
        >
          <div>
            <div className="flex flex-col w-full mt-4">
              <h3
                className="max-w-2xl mt-3 text-3xl font-bold leading-snug tracking-tight lg:leading-tight lg:text-4xl 
                           text-brandTextPrimary dark:text-brandBackground font-header"
              >
                {data.title}
              </h3>

              <p
                className="max-w-2xl py-4 text-lg leading-normal lg:text-xl xl:text-xl 
                           text-brandTextSecondary dark:text-trueGray-300 font-body"
              >
                {data.desc}
              </p>
            </div>

            <div className="w-full mt-5">
              {data.bullets.map((item, index) => (
                <Benefit key={index} title={item.title} icon={item.icon}>
                  {item.desc}
                </Benefit>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

function Benefit(props) {
  return (
    <>
      <div className="flex items-start mt-8 space-x-3 font-body">
        <div className="flex items-center justify-center flex-shrink-0 mt-1 bg-brandAccentFocus rounded-md w-11 h-11">
          {React.cloneElement(props.icon, {
            className: "w-7 h-7 text-brandTextOnAccent",
          })}
        </div>
        <div>
          <h4 className="text-xl font-medium text-brandTextPrimary dark:text-brandBackground">
            {props.title}
          </h4>
          <p className="mt-1 text-brandTextSecondary dark:text-trueGray-300">
            {props.children}
          </p>
        </div>
      </div>
    </>
  );
}
