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
  const [userData, setUserData] = useState(user); // Initialize with fetched user data
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state to track editing
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
        setIsEditing(false); // Reset editing state after saving
      } else {
        toast.error("Something went wrong, Please try again");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
    setIsEditing(true); // Set editing state to true when any input changes
  };

  const handleEmailUpdate = (email) => {
    setUserData({ ...userData, email });
    setShowLoginModal(false);
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    removeCookie("token");
    removeCookie("authenticated");
    removeCookie("city");
    removeCookie("cityId");
    localStorage.clear();
    window.location.href = "/";
  };


  const handleCancelEdit = () => {
    setUserData(user); // Reset to original user data
    setIsEditing(false); // Hide buttons
  };
  return (
    <div className="bg-white min-h-screen">
      <Toaster position="top-center" />
      <Header cities={cities} settings={settings} isHome={true} user={user}/>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-2">
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold leading-7 text-gray-900">Profile</h2>
          <p className="mt-2 text-md leading-6 text-gray-600">
            Please update your profile details to ensure you receive timely notifications about upcoming events. 
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Form */}
          <div className="w-full max-w-4xl ">
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        value={userData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                      Mobile Number
                    </label>
                    <div className="mt-2">
                      <input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="relative mt-2 flex items-center">
                      <input
                        id="email"
                        value={userData.email}
                        name="email"
                        type="email"
                        disabled
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900">
                      Company Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="companyName"
                        value={userData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        name="companyName"
                        type="text"
                        autoComplete="organization"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="designation" className="block text-sm font-medium leading-6 text-gray-900">
                      Designation
                    </label>
                    <div className="mt-2">
                      <input
                        id="designation"
                        value={userData.designation}
                        onChange={(e) => handleInputChange("designation", e.target.value)}
                        name="designation"
                        type="text"
                        autoComplete="organization-title"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                      Address
                    </label>
                    <div className="mt-2">
                      <input
                        id="address"
                        value={userData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                      City
                    </label>
                    <div className="mt-2">
                      <select
                        id="city"
                        name="city"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={userData.cityId}
                        onChange={(e) => handleInputChange("cityId", e.target.value)}
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
              <div className="flex justify-between items-center border-t border-gray-200 px-4 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={openDialog}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                >
                  Delete Account
                </button>
                {isEditing && (
                  <div className="flex items-center gap-x-6">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

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
// }
