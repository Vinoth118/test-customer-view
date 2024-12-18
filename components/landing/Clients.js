import React from "react";
import FadeInWhenVisible from "../fadein";
import Image from "next/image";

export default function Logos({ logos, title }) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-10 lg:px-10">
        <h2 className="text-center text-3xl font-bold leading-8 text-gray-900">
          {title}
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:mt-20 mt-10 mx-auto max-w-7xl px-2 md:px-10 justify-center items-center">
          {logos.map((logo, idx) => (
            <FadeInWhenVisible key={idx}>
              <Image
                key={idx}
                width={logo.width}
                height={logo.height}
                src={logo.src}
                className="w-40"
                alt={`Logo ${idx + 1}`}
              />
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </div>
  );
}
