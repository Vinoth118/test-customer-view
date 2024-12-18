import React from "react";
import {
  RocketLaunchIcon,
  UserPlusIcon,HeartIcon,
  PuzzlePieceIcon
} from "@heroicons/react/24/outline";

export default function Feature() {
  const features = [
    {
      name: "Tailored Corporate Sports Events   ",
      description:
        "We specialize in crafting customized sports events designed to meet the unique needs and preferences of corporate clients, we've got you covered.",
      icon: RocketLaunchIcon,
    },
    {
      name: "Professional Event Management",
      description:
        "Our experienced team is dedicated to ensuring that every detail of your corporate sports event is seamlessly executed. we handle it all. Sit back, relax, and let us turn your vision into reality.",
      icon: UserPlusIcon,
    },
    {
      name: "Team Building with a Sporting Twist",
      description:
        "We believe in the power of sports to strengthen team bonds and enhance collaboration. Team building has never been this exhilarating!.",
      icon: PuzzlePieceIcon,
    },
    {
      name: "Wellness Initiatives",
      description:
        "Our events incorporate elements that promote physical fitness, mental well-being, and a positive corporate culture. ",
      icon: HeartIcon,
    },
  ];
  return (
    <div id="aboutsection" className="mb-20 mx-4">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          What We Do?{" "}
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Welcome to{" "}
          <span className="font-bold text-indigo-600">
            Corporate Sports Club,{" "}
          </span>
          where we bring the thrill of sports to the corporate world. Our
          passion lies in creating unforgettable sports events tailored for
          corporate companies.
        </p>
      </div>
      <div className="mx-auto max-w-2xl mt-16 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
