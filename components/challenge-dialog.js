import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { IoFootsteps } from "react-icons/io5";
import { FaPerson } from "react-icons/fa6";
import { MdGroups } from "react-icons/md";
import axios from "@/utils/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function ChallengeDialog({ event, open, setOpen }) {
  const [hasGST, setHasGST] = useState(false);
  const [gstNumber, setGSTNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [registerAsTeam, setRegisterAsTeam] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (event.challengeDetails) {
      const { individualRegistrationAllowed, teamRegistrationAllowed } = event.challengeDetails;
      setRegisterAsTeam(teamRegistrationAllowed && !individualRegistrationAllowed);
    }
  }, [event]);

  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fee = registerAsTeam ? event.challengeDetails.fee : event.challengeDetails.individualFee;
    const total = fee * quantity;
    const taxPercentage = 18;
    const tax = (total * taxPercentage) / 100;
    setSubTotal(total);
    setTax(tax);
    setTotal(total + tax);
  }, [quantity, registerAsTeam, event.challengeDetails]);

  function showRegisterAsOption() {
    const { individualRegistrationAllowed, teamRegistrationAllowed } = event.challengeDetails;
    return individualRegistrationAllowed && teamRegistrationAllowed;
  }

  function getRegistrationTitle() {
    const { individualRegistrationAllowed, teamRegistrationAllowed } = event.challengeDetails;
    if (individualRegistrationAllowed && !teamRegistrationAllowed) {
      return "Individual Registration";
    } else if (!individualRegistrationAllowed && teamRegistrationAllowed) {
      return "Team Registration";
    } else {
      return "Register a team";
    }
  }

  const handleSubmit = async () => {
    const payload = {
      eventId: event.id,  // challenge event id
      quantity: quantity,  // Number of participants or teams
      registerAsTeam: registerAsTeam,  // True if registering as a team
      isPaid: event.isPaidEvent,  // True if the event is a paid event
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/event/register`, 
        payload
      );

      if (response.data.success) {
        const data = response.data.data;
        if (event.isPaidEvent) {
          // Initialize Razorpay payment
          const options = {
            key: data.razorpayApiKey,
            amount: data.order.amount,
            currency: data.order.currency,
            name: "Corporate Sports Club",
            description: "Event Registration",
            image: "https://storage.googleapis.com/csc406410/public/1719810784660_CSC_Logo-01.png",
            order_id: data.order.id,
            handler: function (response) {
              // Handle successful payment
              setOpen(false);
              toast.success("Payment successful");
              router.push("/my-events");
            },
            theme: {
              color: "#3399cc"
            }
          };
          const razorpayInstance = new Razorpay(options);
          razorpayInstance.on("payment.failed", (response) => {
            toast.error("Payment failed, please try again");
          });
          razorpayInstance.on("payment.paid", (response) => {
            toast.success("Payment successful");
            fbq("track", "Purchase", {
              value: data.order.amount / 100,
              currency: "INR",
            });
          });
          const res = await razorpayInstance.open();
          window.fbq("track", "InitiateCheckout");
          console.log(res, "open");
        } else {
          // For free events
          setOpen(false);
          toast.success("Registration successful");
          router.push("/my-events");
        }
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-105"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-105"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Panel className="z-50 bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg mx-auto font-medium text-gray-900">Challenge Registration</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm font-medium text-gray-700 ">
                      {showRegisterAsOption() ? "Register as team" : getRegistrationTitle()}
                    </span>
                    {showRegisterAsOption() && (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={registerAsTeam}
                          onChange={(e) => setRegisterAsTeam(e.target.checked)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    )}
                  </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <button
                          className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <MinusIcon className="h-5 w-5" />
                        </button>
                        <span className="mx-2 text-gray-700 w-8 text-center">{quantity}</span>
                        <button
                          className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <span className="text-xs  text-gray-500 mt-1">
                        {registerAsTeam ? "Team" : "Individual"}
                      </span>
                    </div>
                    <span className="text-sm sm:mr-7 mr-4 font-medium text-gray-900">
                      ₹{subTotal || 0} 
                    </span>
                  </div>
                
                {event.isPaidEvent && (
                  <div className="my-4 ">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={hasGST}
                        onChange={() => setHasGST(!hasGST)}
                      />
                      <span>I have GST number</span>
                    </label>
                    {hasGST && (
                      <div className="mt-2 flex flex-col w-1/3">
                        <input
                          type="text"
                          value={gstNumber}
                          onChange={(e) => setGSTNumber(e.target.value)}
                          className="mt-1 p-2 block rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter GST number"
                        />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="mt-3 p-2 block rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter Company Name"
                        />
                      </div>
                    )}
                  </div>
                )}
                <section aria-labelledby="summary-heading" className="bg-gray-100 rounded-lg p-6 sm:p-8">
                  <div className="flow-root">
                    <dl className="-my-4 divide-y divide-gray-200 text-sm">
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-gray-600">Subtotal</dt>
                        <dd className="font-medium text-gray-900">₹{subTotal}</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-gray-600">GST (18%)</dt>
                        <dd className="font-medium text-gray-900">₹{tax}</dd>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <dt className="text-base font-medium text-gray-900">Order total</dt>
                        <dd className="text-base font-medium text-gray-900">₹{total}</dd>
                      </div>
                    </dl>
                  </div>
                </section>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    {event.isPaidEvent ? "Continue to Payment" : "Complete Registration"}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
