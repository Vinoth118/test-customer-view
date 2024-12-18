import React, { useState, Fragment } from "react";
import axios from "@/utils/axios";
import dynamic from "next/dynamic";
import InvoicePDF from "@/components/invoice";
import ManageTeam from "@/components/manage-team";
import toast from "react-hot-toast";
import Footer from "@/components/landing/Footer";
import Header from "@/components/Header";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import PDFDownloadLink with SSR disabled
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink), { ssr: false });

function anySuccessFullPaymentPresent(registration) {
  return registration.payment && registration.payment.length > 0
    ? registration.payment.some((payment) => payment.status === "paid")
    : false;
}

export default function MyEvents({ myRegistrations, settings, cities }) {
  const [expandedRegistrations, setExpandedRegistrations] = useState({});
  const [manageTeamModal, setManageTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const toggleRegistrationExpand = (registrationId) => {
    setExpandedRegistrations((prev) => ({
      ...prev,
      [registrationId]: !prev[registrationId],
    }));
  };

  const retryPayment = async (registration) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/event/retryRegistration`,
        {
          registrationId: registration.id,
        }
      );
      if (response.data.success) {
        const data = response.data.data;

        const options = {
          key: data.razorpayApiKey,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Corporate Sports Club",
          description: "Event Registration",
          image:
            "https://storage.googleapis.com/csc406410/public/1719810784660_CSC_Logo-01.png",
          order_id: data.order.id,
          handler: (response) => {
            if (response.razorpay_payment_id) {
              toast.success("Payment successful");
              window.location.reload();
            }
          },
          theme: {
            color: "#3399cc",
          },
        };
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.on("payment.failed", (response) => {
          toast.error("Payment failed, please try again");
        });

        razorpayInstance.open();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleManageTeam = async (registration, teamIndex) => {
    const isChallengeEvent = registration.event.type === "challenge";

    let teamId;
    if (isChallengeEvent) {
      // For challenge events, use the teamIndex to get the correct team
      teamId = registration.teams[teamIndex]?.id;
    } else {
      teamId = registration.teams[teamIndex]?.id;
    }

    if (!teamId) {
      console.error("No valid team ID found for registration:", registration);
      toast.error("No valid team available for this registration.");
      return;
    }

    try {
      const response = await axios.get(`/user/event/team/${teamId}`);
      if (response.data.success) {
        setSelectedTeam({
          ...response.data.data,
          isChallengeEvent,
          challengeEventId: isChallengeEvent ? registration.orderDetails.challengeEventId : null
        });
        setManageTeamModal(true);
      } else {
        toast.error(response.data.message || "Failed to fetch team details.");
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
      toast.error("Error fetching team details.");
    }
  };

  const renderOrderDetails = (registration) => {
    const isChallengeEvent = registration.event.type === "challenge";
    const isTournament = registration.event.type === "tournament" || registration.event.type === "league";

    if (!isChallengeEvent && !isTournament) return null;

    const orderDetails = registration.orderDetails;

    return (
      <div className=" mt-6">
        <button
          onClick={() => toggleRegistrationExpand(registration.id)}
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mt-4"
        >
          {expandedRegistrations[registration.id] ? (
            <>
              <ChevronUpIcon className="h-5 w-5 mr-1" />
              Hide Order Details
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-5 w-5 mr-1" />
              Show Order Details
            </>
          )}
        </button>
        
        <AnimatePresence>
          {expandedRegistrations[registration.id] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className=" py-5 ">
                {isChallengeEvent ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderDetails.registerAsTeam ? (
                        Array.from({ length: orderDetails.quantity }, (_, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Team {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => handleManageTeam(registration, index)}
                              >
                                Manage Players
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Individual
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            N/A
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sport
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registration.orderDetails.map((orderDetail, index) => (
                        <tr key={orderDetail.id}>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex flex-col">
                              <span>{orderDetail.sport ? orderDetail.sport.name : 'Unknown Sport'}</span>
                              <span className="text-xs text-gray-500">{orderDetail.sportCategory ? orderDetail.sportCategory.name : 'Unknown Category'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {orderDetail.quantity} {orderDetail.registerAsTeam ? "Team" : "Ind"}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{orderDetail.registerAsTeam
                              ? orderDetail.fee * orderDetail.quantity
                              : orderDetail.individualFee * orderDetail.quantity}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm"
                              onClick={() => handleManageTeam(registration, index)}
                            >
                              Manage players
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <Header cities={cities} settings={settings} isHome={true} />
      <div className="max-w-5xl px-3 sm:px-0 mx-auto mt-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Registration history
        </h1>
        <p className="mt-4 text-sm text-gray-500">
          Check the status of your registrations
        </p>

        <section aria-labelledby="recent-heading" className="mt-10">
          <h2 id="recent-heading" className="sr-only">
            Registration history
          </h2>

          {myRegistrations.length ? (
            <div className="space-y-8">
              {myRegistrations.map((registration, index) => (
                <div 
                  key={registration.id} 
                  className={`bg-white shadow overflow-hidden sm:rounded-lg ${
                    index === myRegistrations.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  {/* Registration header */}
                  <div className="px-4 py-4 sm:px-6 flex justify-between items-center bg-gray-100">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {registration.event.name}
                    </h3>
                    <div className="flex items-center space-x-4">
                      {!anySuccessFullPaymentPresent(registration) ? (
                        <button
                          onClick={() => retryPayment(registration)}
                          className="rounded-md border border-indigo-600 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Retry Payment
                        </button>
                      ) : (
                        <PDFDownloadLink
                          document={<InvoicePDF registration={registration} />}
                          fileName={`invoice_${registration.id}.pdf`}
                          className="rounded-md border border-indigo-600 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          {({ loading }) =>
                            loading ? 'Loading...' : 'Download Invoice'
                          }
                        </PDFDownloadLink>
                      )}
                    </div>
                  </div>

                  {/* Registration details */}
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <dl className="space-y-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date</dt>
                        <dd className="mt-2 text-sm text-gray-900">
                          {new Date(registration.createdAt).toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: 'numeric', 
                            hour12: true 
                          })}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Total amount</dt>
                        <dd className="mt-2 text-sm text-gray-900">
                          ₹{registration.payment && registration.payment.length > 0
                            ? registration.payment[0].totalAmount
                            : 0}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                        <dd className="mt-2 text-sm text-gray-900">
                          {anySuccessFullPaymentPresent(registration)
                            ? "Paid"
                            : "Failed"}
                        </dd>
                      </div>
                    </dl>

                    {/* Render collapsible order details only for challenge events and tournaments */}
                    {renderOrderDetails(registration)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <h1 className="text-2xl font-bold">No registrations found</h1>
            </div>
          )}
        </section>
      </div>
      <Footer settings={settings} />

      {/* Manage Team Modal */}
      <Transition.Root show={manageTeamModal} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={() => setManageTeamModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg max-w-lg fill-width">
                  {selectedTeam && (
                    <ManageTeam
                      selectedTeam={selectedTeam}
                      closeModal={() => setManageTeamModal(false)}
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
export async function getServerSideProps(context) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/landing`,
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );

    const profileResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/customer/profile`,
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );

    const blogs = response.data.data.blogs;
    const cities = response.data.data.cities;
    const settings = response.data.data.settings;
    const user = profileResponse.data.data.user;

    if (user.isDeleted) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    const myRegistrations = profileResponse?.data?.data?.registrations || [];

    return {
      props: {
        blogs,
        cities,
        settings,
        user,
        myRegistrations,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
