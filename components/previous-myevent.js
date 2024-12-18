import Header from "@/components/Header";
import ManageTeam from "@/components/manage-team";
import axios from "@/utils/axios";
import { useEffect, useState, Fragment } from "react";
import { useCookies } from "react-cookie";
import EmailLogin from "../email-login";
import { CiEdit } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import dynamic from 'next/dynamic';
import InvoicePDF from "@/components/invoice";

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), { ssr: false });

function anySuccessFullPaymentPresent(registration) {
  return registration.payment && registration.payment.length > 0
    ? registration.payment.some((payment) => payment.status === "paid")
    : false;
}

export default function Profile({ cities, settings, user, myRegistrations }) {
  const [manageTeamModal, setManageTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [userData, setUserData] = useState(user);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const cancelButtonRef = useRef(null);

  useEffect(() => {});
  const [cookies, setCookie, removeCookie] = useCookies([
    "city",
    "cityId",
    "authenticated",
    "token",
  ]);

  const handleDeactivateAccount = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/deleteAccount`
      );

      setIsDeleted(true);
      removeCookie("token");
      removeCookie("authenticated");
      removeCookie("city");
      removeCookie("cityId");
      localStorage.clear();
      router.push("/");
      closeDialog();
      router.push("/");
    } catch (error) {
      console.error("Failed to deactivate account:", error);
    }
  };

  function closeModal() {
    setManageTeamModal(false);
  }

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/profile`,
        userData
      );
      if (response.data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Something went wrong, Please try again");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleEmailUpdate = (email) => {
    setUserData({ ...userData, email });
    setShowLoginModal(false);
    // Update authenticated state or any other necessary state changes
    setAuthenticated(true); // Assuming this reflects user authentication status
  };

  const handleLogout = async () => {
    // remove cookie and clear local storage
    removeCookie("token");
    removeCookie("authenticated");
    removeCookie("city");
    removeCookie("cityId");
    localStorage.clear();
    // redirect to /
    window.location.href = "/";
  };

  function closeModal() {
    setShowLoginModal(false);
  }

  const retryPayment = async (registration) => {
    try {
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
                router.push("/profile");
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
    } catch (error) {
      console.error("Error retrying payment:", error);
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <Toaster position="top-center" />
      <Header cities={cities} settings={settings} />

      <main className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8 lg:pb-24">
        <div className="border-b border-gray-900/10 pt-12">
          <div className="flex justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            {/* logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Logout
            </button>
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-600"> </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  value={userData.name}
                  onChange={(e) => {
                    setUserData({ ...userData, name: e.target.value });
                  }}
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  value={userData.phone}
                  name="phone"
                  type="phone"
                  autoComplete="phone"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="relative mt-2 flex items-center">
                <input
                  id="email"
                  value={userData.email}
                  name="email"
                  type="email"
                  disabled
                  className="block w-full pl-2 pr-10 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginModal(true)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-500"
                >
                  <CiEdit className="text-black h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Name
              </label>
              <div className="mt-2">
                <input
                  id="companyName"
                  value={userData.companyName}
                  onChange={(e) =>
                    setUserData({ ...userData, companyName: e.target.value })
                  }
                  name="companyName"
                  type="companyName"
                  autoComplete="companyName"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="designation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Designation
              </label>
              <div className="mt-2">
                <input
                  id="designation"
                  value={userData.designation}
                  onChange={(e) =>
                    setUserData({ ...userData, designation: e.target.value })
                  }
                  name="designation"
                  type="designation"
                  autoComplete="designation"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="mt-2">
                <input
                  id="address"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  name="address"
                  type="text"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3 pb-10">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full pl-2 rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-xs sm:text-sm sm:leading-6"
                  value={userData.cityId}
                  onChange={(e) =>
                    setUserData({ ...userData, cityId: e.target.value })
                  }
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={openDialog}
            className="h-10 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Delete Account
          </button>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProfile}
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>

        {showLoginModal && (
          <Transition.Root show={showLoginModal} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={closeModal}>
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
                      <EmailLogin
                        closeModal={closeModal}
                        setAuthenticated={setAuthenticated}
                        handleEmailUpdate={handleEmailUpdate} // Add this line
                      />
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        )}
        <div className="max-w-xl mt-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Registration history
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Check the status of your registrations
          </p>
        </div>

        <section aria-labelledby="recent-heading" className="mt-16">
          <h2 id="recent-heading" className="sr-only">
            Registration history
          </h2>

          {myRegistrations.length ? (
            <div className="space-y-20">
              {myRegistrations.map((registration) => (
                <div key={registration.id}>
                  <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                    <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-5 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:flex-none lg:gap-x-8">
                      <div className="flex justify-between pt-6 sm:block sm:pt-0">
                        <dt className="font-medium text-gray-900">Event</dt>
                        <dd className="sm:mt-1">{registration.event.name}</dd>
                      </div>
                      <div className="flex justify-between sm:block">
                        <dt className="font-medium text-gray-900">Date</dt>
                        <dd className="sm:mt-1">
                          {/* format date in dd-mmm-yyyy hh:mm A */}
                          <time dateTime={registration.createdAt}>
                            {new Date(
                              registration.createdAt
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </time>
                        </dd>
                      </div>
                      <div className="flex justify-between pt-6 font-medium sm:block sm:pt-0">
                        <dt className="text-gray-900">Total amount</dt>
                        <dd className="sm:mt-1">
                          ₹
                          {registration.payment &&
                          registration.payment.length > 0
                            ? registration.payment[0].totalAmount
                            : 0}
                        </dd>
                      </div>
                      <div className="flex justify-between pt-6 font-medium sm:block sm:pt-0">
                        <dt className="text-gray-900">Payment Status</dt>
                        <dd className="sm:mt-1">
                          {anySuccessFullPaymentPresent(registration)
                            ? "Paid"
                            : "Pending"}
                        </dd>
                      </div>
                    </dl>
                    {!anySuccessFullPaymentPresent(registration) && (
                      <button
                        onClick={() => retryPayment(registration)}
                        className="rounded-md border border-indigo-600 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Retry Payment
                      </button>
                    )}
                    {anySuccessFullPaymentPresent(registration) && (
                      <PDFDownloadLink
                        document={<InvoicePDF registration={registration} user={user} />}
                        fileName={`invoice_${registration.id}.pdf`}
                        className=" rounded-md border border-indigo-600 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {({ loading }) =>
                          loading ? 'Loading document...' : 'Download Invoice'
                        }
                      </PDFDownloadLink>
                    )}
                   
                  </div>
                  {registration.status === "success" && registration.teams ? (
                    <>
                      <table className="mt-4 w-full text-gray-500 sm:mt-6">
                        <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                          <tr>
                            <th
                              scope="col"
                              className="py-3 pr-8 font-normal sm:table-cell"
                            >
                              Team Id
                            </th>
                            <th
                              scope="col"
                              className="py-3 pr-8 font-normal sm:table-cell"
                            >
                              Sport
                            </th>
                            <th
                              scope="col"
                              className="hidden py-3 pr-8 font-bold sm:table-cell"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                          {registration.teams.map((team) => (
                            <tr key={team.id}>
                              <td className="py-6 pr-8 sm:table-cell">
                                #{team.id}
                              </td>
                              <td className="py-6 pr-8 sm:table-cell">
                                <div className="font-medium text-gray-9000">
                                  {team.eventSportCategory.sport.name} -{" "}
                                  {team.eventSportCategory.sportCategory.name}
                                </div>
                              </td>
                              <td className="py-6 pr-8 sm:table-cell">
                                <button
                                  className="rounded-md border border-indigo-600 px-5 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => {
                                    setSelectedTeam(team);
                                    setManageTeamModal(true);
                                  }}
                                >
                                  Manage Players
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      <table className="mt-4 w-full text-gray-500 sm:mt-6">
                        <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                          <tr>
                            <th
                              scope="col"
                              className="py-3 pr-8 font-normal sm:table-cell"
                            >
                              Sport
                            </th>
                            <th
                              scope="col"
                              className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="hidden py-3 pr-8 font-normal sm:table-cell"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="hidden py-3 pr-8 font-normal sm:table-cell"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                          {registration.orderDetails.map(
                            (orderDetail, index) => (
                              <tr key={orderDetail.id}>
                                <td className="py-6 pr-8">
                                  <div className="font-medium text-gray-9000">
                                    {orderDetail.sport.name} -{" "}
                                    {orderDetail.sportCategory.name}
                                  </div>
                                </td>
                                <td className="hidden py-6 pr-8 sm:table-cell">
                                  ₹
                                  {orderDetail.registerAsTeam
                                    ? orderDetail.fee * orderDetail.quantity
                                    : orderDetail.individualFee *
                                      orderDetail.quantity}
                                </td>
                                <td className="hidden py-6 pr-8 sm:table-cell">
                                  {orderDetail.quantity}{" "}
                                  {orderDetail.registerAsTeam
                                    ? "Team"
                                    : "Individual"}
                                </td>
                                <td className="hidden py-6 pr-8 sm:table-cell">
                                  <>-</>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <h1 className="text-2xl font-bold">No registrations found</h1>
            </div>
          )}
        </section>
      </main>

      <Transition.Root show={manageTeamModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={() => {
            setManageTeamModal(false);
          }}
        >
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
                  <ManageTeam
                    selectedTeam={selectedTeam}
                    closeModal={() => {
                      setManageTeamModal(false);
                    }}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-50"
          initialFocus={cancelButtonRef}
          onClose={closeDialog}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full ">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt- text-center sm:mt-2">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed{" "}
                      </Dialog.Title>
                      <div className="mt-2"> </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={handleDeactivateAccount}
                    >
                      Deactivate
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={closeDialog}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
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
      // Redirect if user is deleted
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
    console.error("Error fetching testimonials:", error);
    // redirect to /
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
// GET: http://company1.example.com/customer/profile
// {
//     "success": true,
//     "data": {
//         "user": {
//             "id": 4,
//             "phone": "8248017451",
//             "name": "Sathish",
//             "email": "sathishdev76@gmail.com",
//             "companyName": "Test",
//             "designation": null,
//             "address": null,
//             "cityId": null
//         },
//         "registrations": [
//             {
//                 "id": 8,
//                 "status": "pending",
//                 "orderDetails": [
//                     {
//                         "quantity": 1,
//                         "registerAsTeam": true,
//                         "eventSportCategoryId": 38,
//                         "sport": {
//                             "id": 3,
//                             "name": "Table Tennis"
//                         },
//                         "sportCategory": {
//                             "id": 4,
//                             "name": "Men's Double"
//                         },
//                         "fee": 1000,
//                         "individualFee": 0
//                     }
//                 ],
//                 "createdAt": "2024-07-08T09:27:46.000Z",
//                 "eventId": 29,
//                 "event": {
//                     "id": 29,
//                     "name": "Corporate Olympics",
//                     "type": "tournament",
//                     "coverImage": "https://storage.googleapis.com/csc406410/public/1720357299892_csc_Web-banner1.1.jpg"
//                 },
//                 "payment": [
//                     {
//                         "id": 1009,
//                         "status": "pending",
//                         "subTotal": 1000,
//                         "tax": 180,
//                         "totalAmount": 1180
//                     }
//                 ],
//                 "teams": []
//             },
//             {
//                 "id": 10,
//                 "status": "pending",
//                 "orderDetails": [
//                     {
//                         "quantity": 1,
//                         "registerAsTeam": true,
//                         "eventSportCategoryId": 38,
//                         "sport": {
//                             "id": 3,
//                             "name": "Table Tennis"
//                         },
//                         "sportCategory": {
//                             "id": 4,
//                             "name": "Men's Double"
//                         },
//                         "fee": 1000,
//                         "individualFee": 0
//                     }
//                 ],
//                 "createdAt": "2024-07-08T09:33:01.000Z",
//                 "eventId": 29,
//                 "event": {
//                     "id": 29,
//                     "name": "Corporate Olympics",
//                     "type": "tournament",
//                     "coverImage": "https://storage.googleapis.com/csc406410/public/1720357299892_csc_Web-banner1.1.jpg"
//                 },
//                 "payment": [
//                     {
//                         "id": 1011,
//                         "status": "pending",
//                         "subTotal": 1000,
//                         "tax": 180,
//                         "totalAmount": 1180
//                     }
//                 ],
//                 "teams": []
//             },
//             {
//                 "id": 11,
//                 "status": "success",
//                 "orderDetails": [
//                     {
//                         "quantity": 1,
//                         "registerAsTeam": true,
//                         "eventSportCategoryId": 60,
//                         "sport": {
//                             "id": 5,
//                             "name": "Carrom"
//                         },
//                         "sportCategory": {
//                             "id": 3,
//                             "name": "Men's Single"
//                         },
//                         "fee": 350,
//                         "individualFee": 0
//                     }
//                 ],
//                 "createdAt": "2024-07-08T09:37:44.000Z",
//                 "eventId": 29,
//                 "event": {
//                     "id": 29,
//                     "name": "Corporate Olympics",
//                     "type": "tournament",
//                     "coverImage": "https://storage.googleapis.com/csc406410/public/1720357299892_csc_Web-banner1.1.jpg"
//                 },
//                 "payment": [
//                     {
//                         "id": 1012,
//                         "status": "paid",
//                         "subTotal": 350,
//                         "tax": 63,
//                         "totalAmount": 413
//                     }
//                 ],
//                 "teams": [
//                     {
//                         "id": 42,
//                         "name": null,
//                         "eventSportCategory": {
//                             "id": 60,
//                             "sport": {
//                                 "id": 5,
//                                 "name": "Carrom"
//                             },
//                             "sportCategory": {
//                                 "id": 3,
//                                 "name": "Men's Single"
//                             }
//                         }
//                     }
//                 ]
//             },
//             {
//                 "id": 43,
//                 "status": "success",
//                 "orderDetails": [
//                     {
//                         "quantity": 1,
//                         "registerAsTeam": true,
//                         "eventSportCategoryId": 111,
//                         "sport": {
//                             "id": 10,
//                             "name": "Bowling"
//                         },
//                         "sportCategory": {
//                             "id": 3,
//                             "name": "Men's Single"
//                         },
//                         "fee": 500,
//                         "individualFee": 0
//                     }
//                 ],
//                 "createdAt": "2024-07-09T08:53:06.000Z",
//                 "eventId": 29,
//                 "event": {
//                     "id": 29,
//                     "name": "Corporate Olympics",
//                     "type": "tournament",
//                     "coverImage": "https://storage.googleapis.com/csc406410/public/1720357299892_csc_Web-banner1.1.jpg"
//                 },
//                 "payment": [
//                     {
//                         "id": 1044,
//                         "status": "paid",
//                         "subTotal": 500,
//                         "tax": 90,
//                         "totalAmount": 590
//                     }
//                 ],
//                 "teams": [
//                     {
//                         "id": 76,
//                         "name": null,
//                         "eventSportCategory": {
//                             "id": 111,
//                             "sport": {
//                                 "id": 10,
//                                 "name": "Bowling"
//                             },
//                             "sportCategory": {
//                                 "id": 3,
//                                 "name": "Men's Single"
//                             }
//                         }
//                     }
//                 ]
//             },
//             {
//                 "id": 73,
//                 "status": "pending",
//                 "orderDetails": [
//                     {
//                         "quantity": 1,
//                         "registerAsTeam": true,
//                         "eventSportCategoryId": 41,
//                         "sport": {
//                             "id": 3,
//                             "name": "Table Tennis"
//                         },
//                         "sportCategory": {
//                             "id": 7,
//                             "name": "Mixed Double"
//                         },
//                         "fee": 1000,
//                         "individualFee": 0
//                     }
//                 ],
//                 "createdAt": "2024-07-10T07:22:24.000Z",
//                 "eventId": 29,
//                 "event": {
//                     "id": 29,
//                     "name": "Corporate Olympics",
//                     "type": "tournament",
//                     "coverImage": "https://storage.googleapis.com/csc406410/public/1720357299892_csc_Web-banner1.1.jpg"
//                 },
//                 "payment": [
//                     {
//                         "id": 1076,
//                         "status": "pending",
//                         "subTotal": 1000,
//                         "tax": 180,
//                         "totalAmount": 1180
//                     }
//                 ],
//                 "teams": []
//             },
//             {
//                 "id": 114,
//                 "status": "pending",
//                 "orderDetails": [
//                     {
//                         "quantity": 1,
//                         "registerAsTeam": true,
//                         "eventSportCategoryId": 38,
//                         "sport": {
//                             "id": 3,
//                             "name": "Table Tennis"
//                         },
//                         "sportCategory": {
//                             "id": 4,
//                             "name": "Men's Double"
//                         },
//                         "fee": 1000,
//                         "individualFee": 0
//                     }
//                 ],
//                 "createdAt": "2024-07-11T08:22:13.000Z",
//                 "eventId": 29,
//                 "event": {
//                     "id": 29,
//                     "name": "Corporate Olympics",
//                     "type": "tournament",
//                     "coverImage": "https://storage.googleapis.com/csc406410/public/1720357299892_csc_Web-banner1.1.jpg"
//                 },
//                 "payment": [
//                     {
//                         "id": 1117,
//                         "status": "pending",
//                         "subTotal": 1000,
//                         "tax": 180,
//                         "totalAmount": 1180
//                     }
//                 ],
//                 "teams": []
//             },
//             {
//                 "id": 118,
//                 "status": "pending",
//                 "orderDetails": [
//                     {
//                         "quantity": 1,
//                         "registerAsTeam": true,
//                         "eventSportCategoryId": 40,
//                         "sport": {
//                             "id": 3,
//                             "name": "Table Tennis"
//                         },
//                         "sportCategory": {
//                             "id": 6,
//                             "name": "Women's Double"
//                         },
//                         "fee": 1000,
//                         "individualFee": 0
//                     }
//                 ],
//                 "createdAt": "2024-07-11T09:23:52.000Z",
//                 "eventId": 29,
//                 "event": {
//                     "id": 29,
//                     "name": "Corporate Olympics",
//                     "type": "tournament",
//                     "coverImage": "https://storage.googleapis.com/csc406410/public/1720357299892_csc_Web-banner1.1.jpg"
//                 },
//                 "payment": [
//                     {
//                         "id": 1121,
//                         "status": "pending",
//                         "subTotal": 1000,
//                         "tax": 180,
//                         "totalAmount": 1180
//                     }
//                 ],
//                 "teams": []
//             }
//         ]
//     }
// }*/