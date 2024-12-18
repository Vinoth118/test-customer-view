import FadeInWhenVisible from "../fadein";

export default function Testimonials({ testimonials }) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold leading-8 tracking-tight text-indigo-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We have worked with thousands of amazing people
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="flex flex-wrap items-center justify-center">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="pt-8 sm:inline-block w-full sm:px-4 md:w-[33%]"
              >
                <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                  <blockquote className="text-gray-900">
                    <p className="text-center">{`“${testimonial.review}”`}</p>
                  </blockquote>
                  {/* <figcaption className="mt-6 flex items-center gap-x-4">
                    <img
                      className="h-10 w-10 rounded-full bg-gray-50"
                      src={testimonial.imageUrl}
                      alt=""
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600">{testimonial.title}</div>
                    </div>
                  </figcaption> */}
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
