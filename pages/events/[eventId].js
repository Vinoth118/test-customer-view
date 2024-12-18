import axios from "@/utils/axios";
import React, { useEffect, useState } from "react";
import Footer from "../../components/landing/Footer";
import { TbBuildingStadium } from "react-icons/tb";
import Header from "../../components/Header";
import Register from "../../components/register";
import { parseDate } from "@/utils/helper";
import ReactMarkdown from "react-markdown";
import FadeInWhenVisible from "@/components/fadein";
import WeekendRegister from "@/components/weekend-dialogue";
import ChallengeDialog from "../../components/challenge-dialog";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import remarkGfm from "remark-gfm";
import { tableComponents } from "@/components/utils";

export default function EventDetailPage({
  event,
  cities,
  settings,
  isAuthenticated,
}) {
  const formattedDate = parseDate(event.startDate);
  const [open, setOpen] = useState(false);
  const [showWeekendGameDialog, setShowWeekendGameDialog] = useState(false); // State to control the visibility of the weekend game dialog
  const [showChallengeDialog, setShowChallengeDialog] = useState(false); // State to control the visibility of the challenge dialog
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  useEffect(() => {
    if (!isAuthenticated) {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);

  const onRegister = () => {
    if (!cookies.token) {
      toast.error("Please login to register for the event");
      return;
    }
    window.fbq("track", "AddToCart");
    if (event.weekendGame) {
      setShowWeekendGameDialog(true);
    } else if (event.challengeDetails) {
      setShowChallengeDialog(true);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white">
      <Header cities={cities} settings={settings} />
        <title>{settings.siteTitle}</title>
        <meta name="description" content={event.seoDescription} />
        <meta name="keywords" content={event.seoKeywords} />
        <meta name="title" content={event.seoSiteTitle} />
        <meta name="thumbnail" content={event.coverImage} />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://csc-landing-test.netlify.app/"
        />
        <meta property="og:title" content={settings.seoSiteTitle} />
        <meta property="og:description" content={settings.seoDescription} />
        <meta property="og:image" content="" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://csc-landing-test.netlify.app/"
        />
        <meta property="twitter:title" content={settings.seoSiteTitle} />
        <meta
          property="twitter:description"
          content={settings.seoDescription}
        />
        <meta property="twitter:image" content="" />
      </div>

      <div className="md:w-3/4 flex flex-col md:mx-auto mx-5">
        <FadeInWhenVisible>
          <div className="aspect-w-16 mt-6 aspect-h-9">
            <img
              src={event.coverImage}
              alt={event.name}
              className="rounded-xl bg-gray-50 object-cover items-center justify-center mx-auto"
            />
          </div>
        </FadeInWhenVisible>

        <div className="py-2 flex items-center justify-between  transition-opacity duration-500   ">
          {/* Event date */}
          <h2 className="font-semibold text-2xl leading-7 text-gray-500  ">
            {parseDate(event.startDate)}
          </h2>
          <div className="space-x-4 flex items-center">
            {/* Add to Calendar button */}
            {/* <AddToCalendarButton
              name="Title"
              options={[
                "Google",
                "iCal",
                "Outlook.com",
                "Microsoft 365",
                "Microsoft Teams",
                "Yahoo",
              ]}
              inline={true}
              location="World Wide Web"
              startDate="2023-12-12"
              endDate="2023-12-12"
              startTime="10:15"
              endTime="23:30"
              hideBranding={true}
              hideRichData={true}
              hideTextLabelList={true}
              hideIconModal={true}
              hideCheckmark={true}
              hideTextLabelButton={true}
              timeZone="America/Los_Angeles"
            ></AddToCalendarButton> */}
            {/* Register button */}
            <button
              className="justify-center w-20 h-10 md:w-auto md:h-auto hover:bg-indigo-500 bg-indigo-600 text-white rounded-lg md:px-12 md:py-2 px-3 py-2 transition-opacity duration-500"
              onClick={onRegister}
            >
              Register
            </button>
            {showWeekendGameDialog && (
              <WeekendRegister
                event={event}
                sports={event.sportsDetails}
                open={showWeekendGameDialog}
                setOpen={setShowWeekendGameDialog}
                onClose={() => setShowWeekendGameDialog(false)}
              />
            )}
            {showChallengeDialog && event.challengeDetails && (
              <ChallengeDialog
                event={event}
                open={showChallengeDialog}
                setOpen={setShowChallengeDialog}
              />
            )}

            {!showWeekendGameDialog && open && (
              <Register
                event={event}
                sports={event.sportsDetails}
                open={open}
                setOpen={setOpen}
              />
            )}
          </div>
        </div>

        {/* Event name */}
        <h1 className="md:text-4xl text-4xl font-bold ">{event.name}</h1>

        <FadeInWhenVisible>
          <div className="space-y-10 mt-10">
            {/* <div className="flex bg-gray-100 ">
              <div className="bg-center p-5 rounded-lg">
                <IoLocationSharp size={"1rem"} className="text-black" />
              </div>
              <div className="flex flex-col ">
                <div className="text-gray-700 mt-4 ">
                  {event.location || "Location not provided"}
                </div>
              </div>
            </div> */}

            {/* Event venue */}

            <div className="mt-6 ">
              <h2 className="text-xl font-bold mb-4">Venue</h2>
              <div className="flex items-center">
                <TbBuildingStadium size={"1.5rem"} color="#333" />
                <p className="  ml-3 text-gray-700">
                  {event.venue || "Venue not provided"}
                </p>
              </div>
            </div>

            {/* About this event */}
            <div className="flex flex-col space-y-4 mt-8 overflow-x-auto">
              <h2 className="text-md text-xl font-bold ">About this event</h2>
              <div className="flex items-start prose">
                {/* <PiNotepad  size={"4rem"} color="#333" className="mr-3 " /> */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose lg:prose-xl text-gray-700"
                  components={tableComponents}
                >
                  {event.about}
                </ReactMarkdown>
              </div>
            </div>

            {/* Awards */}
            {event.awards && (
              <div className="flex flex-col space-y-4 mt-8 overflow-x-auto">
                <h2 className="text-xl font-bold ">Awards</h2>
                <div className="flex items-start prose">
                  {/* <MdOutlineNotes size={"4rem"} color="#333" className="mr-3 " />  */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose lg:prose-xl text-md text-gray-700"
                    components={tableComponents}
                  >
                    {event.awards}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Rules */}
            {event.rules && (
              <div className="flex flex-col space-y-4 mt-8 overflow-x-auto">
                <h2 className="text-xl font-bold ">Rules</h2>
                <div className="flex items-start prose">
                  {/* <MdOutlineNotes size={"4rem"} color="#333" className="mr-3 " />  */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose lg:prose-xl text-md text-gray-7000"
                    components={tableComponents}
                  >
                    {event.rules}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </FadeInWhenVisible>


      </div>
      <Footer settings={settings} />

    </>
  );
}

export async function getServerSideProps(context) {
  const { params, query } = context;
  const eventId = params.eventId || query.eventId;

  try {
    const [eventResponse, landingResponse] = await Promise.all([
      axios.get(`/user/landing/event/${eventId}`, {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/landing`, {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }),
    ]);

    const eventData = eventResponse.data.data;
    const cities = landingResponse.data.data.cities;
    const settings = landingResponse.data.data.settings;

    const mergedData = {
      ...eventData,
      cities: cities,
    };

    return {
      props: {
        event: mergedData,
        cities,
        settings,
        isAuthenticated: landingResponse.data.isAuthenticated,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      notFound: true,
    };
  }
}
