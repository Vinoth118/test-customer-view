import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axios";
import ComboBox from "./combo-box";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Register({ event, sports, open, setOpen, onRegister }) {
  const [sportCategoryCombo, setSportCategoryCombo] = useState([]);
  const [hasGST, setHasGST] = useState(false);
  const [gstNumber, setGSTNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedSportCategoryCombo, setSelectedSportCategoryCombo] = useState(
    []
  );
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const temp = [];
    let registerAsTeam = true;

    if (event.league) {
      if (event.teamRegistrationAllowed) {
        registerAsTeam = true;
      } else if (event.individualRegistrationAllowed) {
        registerAsTeam = false;
      }
    }

    sports.forEach((sport) => {
      sport.categories.forEach((category) => {
        if (!category.isRegistrationOpen) {
          return;
        }
        temp.push({
          sportId: sport.sportId,
          comboName: `${sport.name} - ${category.name}`,
          sportName: sport.name,
          categoryId: category.id,
          categoryName: category.name,
          numberOfTeamsAllowed: category.numberOfTeamsAllowed,
          numberOfTeamsInGroup: category.numberOfTeamsInGroup,
          totalNumberOfGroups: category.totalNumberOfGroups,
          teamsQualifyForKnockout: category.teamsQualifyForKnockout,
          fee: category.fee || 0,
          individualFee: category.individualFee || 0,
          eventSportCategoryId: category.eventSportCategoryId,
          registerAsTeam: registerAsTeam,
        });
      });
    });

    setSportCategoryCombo(temp);

    if (selectedSportCategoryCombo.length === 0) {
      setSelectedSportCategoryCombo([
        {
          quantity: 1,
          fee: 0,
          individualFee: 0,
          eventSportCategoryId: null,
          registerAsTeam: true,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (selectedSportCategoryCombo) {
      let total = 0;
      selectedSportCategoryCombo.forEach((combo) => {
        total +=
          (combo.registerAsTeam ? combo.fee : combo.individualFee) *
          combo.quantity;
      });

      let taxPercentage = 18;
      let tax = (total * taxPercentage) / 100;
      setSubTotal(total);
      setTax(tax);
      setTotal(total + tax);
    }
  }, [selectedSportCategoryCombo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      eventId: event.id,
      items: selectedSportCategoryCombo.map((combo) => ({
        sportId: combo.sportId,
        categoryId: combo.categoryId,
        eventSportCategoryId: combo.eventSportCategoryId,
        quantity: combo.quantity,
        registerAsTeam: combo.registerAsTeam,
      })),
      isPaid: event.isPaidEvent,
      gstNumber: gstNumber,
      companyName: companyName,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/event/register`,
        payload
      );

      if (response.data.success) {
        if (event.isPaidEvent) {
          // Initialize Razorpay payment
          const options = {
            key: response.data.data.razorpayApiKey,
            amount: response.data.data.order.amount,
            currency: response.data.data.order.currency,
            name: "Corporate Sports Club",
            description: `Registration for ${event.name}`,
            order_id: response.data.data.order.id,
            handler: function (response) {
              // Handle successful payment
              toast.success("Payment successful!");
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
              value: data.order.amount / 1000,
              currency: "INR",
            });
          });
          const res = await razorpayInstance.open();
          window.fbq("track", "InitiateCheckout");
          console.log(res, "open");
        } else {
          // For free events
          toast.success("Registration successful!");
          router.push("/my-events");
        }
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };


  const handleAddSport = () => {
    setSelectedSportCategoryCombo([
      ...selectedSportCategoryCombo,
      {
        quantity: 1,
        fee: 0,
        individualFee: 0,
        eventSportCategoryId: null,
        registerAsTeam: true,
      },
    ]);
  };

  const showRegisterAsOption = () => {
    if (event.league) {
      if (
        event.league.individualRegistrationAllowed &&
        event.league.teamRegistrationAllowed
      ) {
        return true;
      }
    }
    return false;
  };

  const registeringFor = (combo) => {
    if (combo.registerAsTeam) {
      return "Team";
    }
    return "Individual";
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-500 sm:bg-opacity-75 sm:transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center sm:items-center sm:px-6 lg:px-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-105"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-105"
              >
                <Dialog.Panel className="flex w-full max-w-3xl transform text-left text-base transition sm:my-8">
                  <div className="relative flex w-full flex-col overflow-hidden bg-white pb-8 pt-6 sm:rounded-lg sm:pb-6 lg:py-8">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                      <h2 className="flex items-center mx-auto text-lg font-medium text-gray-900">
                        {event.name} Registration
                      </h2>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <section aria-labelledby="cart-heading">
                      <h2 id="cart-heading" className="sr-only">
                        Items in your shopping cart
                      </h2>

                      {selectedSportCategoryCombo &&
                      selectedSportCategoryCombo.length > 0 ? (
                        <ul
                          role="list"
                          className="divide-y divide-gray-200 px-4 sm:px-6 lg:px-8"
                        >
                          {selectedSportCategoryCombo.map((combo, index) => (
                            <li
                              key={index}
                              className="flex py-8 text-sm sm:items-center"
                            >
                              <p className="sm:mt-0 mt-3 ">{index + 1}.</p>
                              <div className="ml-4 grid flex-auto grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-3 sm:ml-6 sm:flex sm:items-center sm:gap-0">
                                <div className="row-end-1 flex-auto sm:pr-6">
                                  <div className="flex flex-col">
                                    <ComboBox
                                      menus={sportCategoryCombo.map(
                                        (combo) => ({
                                          sportId: combo.sportId,
                                          categoryId: combo.categoryId,
                                          name: combo.sportName,
                                          subText: combo.categoryName,
                                          fee: combo.fee,
                                          individualFee: combo.individualFee,
                                          eventSportCategoryId:
                                            combo.eventSportCategoryId,
                                          registerAsTeam: combo.registerAsTeam,
                                        })
                                      )}
                                      setSelected={(e) => {
                                        const updatedCombo = [
                                          ...selectedSportCategoryCombo,
                                        ];
                                        e.quantity = combo.quantity;
                                        updatedCombo[index] = e;
                                        console.log(updatedCombo);
                                        setSelectedSportCategoryCombo(
                                          updatedCombo
                                        );
                                      }}
                                      selected={combo}
                                    />
                                    {showRegisterAsOption() && (
                                      <div className="mt-2">
                                        <div className="sm:col-span-2 sm:col-start-1">
                                          <label className="flex items-center cursor-pointer">
                                            <span className="mr-3 text-sm font-medium text-gray-900">
                                              Register as team
                                            </span>
                                            <input
                                              type="checkbox"
                                              className="sr-only peer"
                                              checked={combo.registerAsTeam}
                                              onChange={(e) =>
                                                setSelectedSportCategoryCombo(
                                                  selectedSportCategoryCombo.map(
                                                    (item, i) =>
                                                      i === index
                                                        ? {
                                                            ...item,
                                                            registerAsTeam:
                                                              e.target.checked,
                                                          }
                                                        : item
                                                  )
                                                )
                                              }
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                                          </label>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className="row-span-2 sm:mt-0 mt-3 row-end-2 font-medium text-gray-900 sm:order-1 sm:ml- sm:w-1/3 sm:flex-none sm:text-right ">
                                  {event.isPaidEvent ? (
                                    <span className="mr-7">
                                      ₹
                                      {(combo.registerAsTeam
                                        ? combo.fee
                                        : combo.individualFee) * combo.quantity}
                                    </span>
                                  ) : (
                                    <span>₹0</span>
                                  )}
                                  <br />
                                </p>
                                <div className="flex items-center sm:block sm:flex-none sm:text-center">
                                  <label
                                    htmlFor={`quantity-${index}`}
                                    className="sr-only"
                                  >
                                    Quantity, {combo.name}
                                  </label>
                                  <div
                                    className="flex gap-x-4"
                                    id={`quantity-${index}`}
                                    name={`quantity-${index}`}
                                  >
                                    <MinusCircleIcon
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const updatedCombo = [
                                          ...selectedSportCategoryCombo,
                                        ];
                                        updatedCombo[index].quantity -= 1;
                                        if (
                                          updatedCombo[index].quantity === 0
                                        ) {
                                          updatedCombo.splice(index, 1);
                                        }
                                        setSelectedSportCategoryCombo(
                                          updatedCombo
                                        );
                                      }}
                                    />
                                    <p className="text-lg">{combo.quantity}</p>
                                    <PlusCircleIcon
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const updatedCombo = [
                                          ...selectedSportCategoryCombo,
                                        ];
                                        updatedCombo[index].quantity += 1;
                                        setSelectedSportCategoryCombo(
                                          updatedCombo
                                        );
                                      }}
                                    />
                                  </div>
                                  <div className="ml-1 ">
                                    {registeringFor(combo)}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center justify-center py-5">
                          <p className="mt-1 text-gray-500">
                            Please add sport to register
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-center">
                        <input
                          type="button"
                          value="Add sport"
                          className="mb-4 justify-center md:w-auto md:h-auto hover:bg-indigo-500 bg-indigo-600 text-white rounded-lg md:px-12 md:py-2 px-3 py-2"
                          onClick={handleAddSport}
                        />
                      </div>

                      {event.isPaidEvent && (
                        <div className="my-4 ml-10">
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
                                id="gstNumber"
                                value={gstNumber}
                                onChange={(e) => {
                                  setGSTNumber(e.target.value);
                                }}
                                className="mt-1 p-2 block rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter GST number"
                              />
                              <input
                                id="companyName"
                                value={companyName}
                                onChange={(e) => {
                                  setCompanyName(e.target.value);
                                }}
                                className="mt-3 p-2 block rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter Company Name"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </section>

                    <section
                      aria-labelledby="summary-heading"
                      className="mt-auto sm:px-6 lg:px-8"
                    >
                      <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
                        <h2 id="summary-heading" className="sr-only">
                          Order summary
                        </h2>

                        <div className="flow-root">
                          <dl className="-my-4 divide-y divide-gray-200 text-sm">
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-gray-600">Subtotal</dt>
                              {event.isPaidEvent ? (
                                <dd className="font-medium text-gray-900">
                                  ₹{subTotal}
                                </dd>
                              ) : (
                                <dd className="font-medium text-gray-900">
                                  ₹0
                                </dd>
                              )}
                            </div>
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-gray-600">GST (18%)</dt>
                              {event.isPaidEvent ? (
                                <dd className="font-medium text-gray-900">
                                  ₹{tax}
                                </dd>
                              ) : (
                                <dd className="font-medium text-gray-900">
                                  ₹0
                                </dd>
                              )}
                            </div>
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-base font-medium text-gray-900">
                                Order total
                              </dt>
                              {event.isPaidEvent ? (
                                <dd className="text-base font-medium text-gray-900">
                                  ₹{total}
                                </dd>
                              ) : (
                                <dd className="text-base font-medium text-gray-900">
                                  ₹0
                                </dd>
                              )}
                            </div>
                          </dl>
                        </div>
                      </div>
                    </section>

                    <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        {event.isPaidEvent
                          ? "Continue to Payment"
                          : "Complete Registration"}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
