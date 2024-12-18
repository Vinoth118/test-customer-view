import React, { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { parseDate, ucFirst } from "@/utils/helper";

export default function Events({ events }) {
  const scrollContainerRef = useRef(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  function handleScrollLeft() {
    if (scrollContainerRef.current) {
      const scrollAmount =
        window.innerWidth <= 640 ? scrollContainerRef.current.offsetWidth : 400;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  }

  function handleScrollRight() {
    if (scrollContainerRef.current) {
      const scrollAmount =
        window.innerWidth <= 640 ? scrollContainerRef.current.offsetWidth : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }


  return (
    <div
      id="eventsSection"
      className="bg-white sm:py-20 mt-10 mb-10 lg:mb-0 lg:mt-0  relative"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {events && events.length ? (
          <button
            onClick={handleScrollLeft}
            className="hidden lg:block absolute left-0 top-1/2 transform -translate-x-10 -translate-y-1/2 z-10 p-2 lg:p-4 bg-white rounded-full shadow-lg"
          >
            <FaChevronLeft size={24} />
          </button>
        ) : (
          <></>
        )}
        {events && events.length ? (
          <button
            onClick={handleScrollRight}
            className="hidden lg:block absolute right-0 top-1/2 transform translate-x-10 -translate-y-1/2 z-10 p-2 lg:p-4 bg-white rounded-full shadow-lg"
          >
            <FaChevronRight size={24} />
          </button>
        ) : (
          <></>
        )}

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Events
          </h2>
        </div>
        {events && events.length ? (
          <div
            id="hide-scrollbar"
            ref={scrollContainerRef}
            className="mx-auto mt-8 overflow-x-auto whitespace-nowrap space-y-4 md:space-y-0 px-2 no-scrollbar relative"
            style={{ paddingRight: "3rem" }} // Add some right padding for better visibility
          >
            {events.map((event) => (
             <div
  key={event.id}
  className="inline-block overflow-hidden w-full sm:w-[375px] md:w-[375px] flex-none md:mr-7 mr-4 last:mr-0 rounded-2xl shadow-lg"
  style={{ height: 'fit-content' }}
>
                <Link href={`/events/${event.id}`} passHref>
                  <div className="flex w-full">
                    <img
                      src={event.coverImage}
                      className="aspect-[16/9] w-full rounded-t-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                  </div>
                  <div className="max-w-xl p-3">
                    <label className="mt-3 text-xs text-gray-500">
                      {parseDate(event.startDate)}
                    </label>
                    <div className="mt-2 flex items-center text-xs">
                      <div className="flex items-center">
                        <a className="mr-3 relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                          {ucFirst(event.type)}
                        </a>
                        <a className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                          {ucFirst(event.venue)}
                        </a>
                      </div>
                    </div>

                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <a href={event.href}>
                          <span className="absolute inset-0" />
                          {event.name}
                        </a>
                      </h3>
                      <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-6">
                        {event.shortDescription || ''}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-lg text-gray-500">No events found for the selected city!</p>
          </div>
        )}
      </div>
    </div>
  );
}
