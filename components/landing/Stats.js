import FadeInWhenVisible from "../fadein";

export default function Stats({ settings }) {
  return (
    <div className="bg-indigo-800">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {settings.statTitle}
          </h2>
          <p className="mt-3 text-xl text-indigo-200 sm:mt-4">
            {settings.statSubTitle}
          </p>
        </div>
        <dl className="mt-10 text-center sm:mx-auto sm:grid sm:max-w-3xl sm:grid-cols-3 sm:gap-8">
          <FadeInWhenVisible>
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg font-medium leading-6 text-indigo-200">
                {settings.stat1SubTitle}
              </dt>
              <dd className="order-1 text-5xl font-bold tracking-tight text-white">
                {settings.stat1Title}
              </dd>
            </div>
          </FadeInWhenVisible>
          <FadeInWhenVisible>
            <div className="mt-10 flex flex-col sm:mt-0">
              <dt className="order-2 mt-2 text-lg font-medium leading-6 text-indigo-200">
                {settings.stat2SubTitle}
              </dt>
              <dd className="order-1 text-5xl font-bold tracking-tight text-white">
                {settings.stat2Title}
              </dd>
            </div>
          </FadeInWhenVisible>
          <FadeInWhenVisible>
            <div className="mt-10 flex flex-col sm:mt-0">
              <dt className="order-2 mt-2 text-lg font-medium leading-6 text-indigo-200">
                {settings.stat3SubTitle}
              </dt>
              <dd className="order-1 text-5xl font-bold tracking-tight text-white">
                {settings.stat3Title}
              </dd>
            </div>
          </FadeInWhenVisible>
        </dl>
      </div>
    </div>
  );
}
