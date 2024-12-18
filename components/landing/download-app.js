export default function Example() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-8 sm:px-6  lg:px-8">
        <div className="relative isolate overflow-hidden  px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">
              Start using our app today.
            </h2>
            <p className="mt-6 text-lg leading-8 ">
              Our app simplifies sports event management, allowing you to
              effortlessly organize and register for events. Stay updated with
              schedules, receive notifications, and manage your participation
              with ease.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="https://play.google.com/store/apps/details?id=com.corporatesports.club&pcampaignid=web_share"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-none"
              >
                Download Now
              </a>
            </div>
          </div>
          <div className="md:ml-0 lg:ml-44 sm:ml-40 items-center justify-center flex">
           
                <img className="h-[500px]  " src="/App-screenshot.png" alt="" />
            
          </div>
        </div>
      </div>
    </div>
  );
}
