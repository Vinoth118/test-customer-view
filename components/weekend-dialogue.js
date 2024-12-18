import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CiCalendar } from "react-icons/ci";
import { IoIosTimer } from "react-icons/io";
import { LiaRunningSolid } from "react-icons/lia";
import axios from "@/utils/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckToSlot } from "react-icons/fa6";

// Add this new component for the slot display
const TimeSlotWithTeams = ({ slot, selectedSlots, onSelect }) => {
  const isSlotSelected = (slotIndex) => {
    return selectedSlots.some(s => s.slotId === slot.id && s.slotIndex === slotIndex);
  };

  const getAvailabilityMessage = () => {
    const availableSlots = Array.from({ length: slot.noOfSlots }).filter((_, index) =>
      !slot[`team${String.fromCharCode(65 + index)}Booked`]
    ).length;

    if (availableSlots === slot.noOfSlots) {
      return "All teams available";
    } else if (availableSlots > 0) {
      return "Opponent available";
    }
    return "No Teams available";
  };

  // Helper function to chunk array into pairs
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const slots = Array.from({ length: slot.noOfSlots }).map((_, index) => ({
    index,
    isBooked: slot[`team${String.fromCharCode(65 + index)}Booked`] || false
  }));

  const slotPairs = chunkArray(slots, 2);

  return (
    <div className="w-full mb-2">
      <div className="text-center py-1.5 text-sm font-medium">
        {slot.slotName}
      </div>
      <div className="p-2">
        <div className="flex flex-col gap-4">
          {slotPairs.map((pair, pairIndex) => (
            <div key={pairIndex} className="flex justify-between items-center w-full px-4"> {/* Added w-full and px-4 */}
              {/* First slot in pair */}
              <div
                onClick={() => !pair[0].isBooked && onSelect(slot.id, pair[0].index, slot.price)}
                className={`flex flex-col items-center justify-center py-2 px-5 rounded-md transition-all duration-200 w-[45%]
                  ${pair[0].isBooked
                    ? 'border border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                    : isSlotSelected(pair[0].index)
                      ? 'border border-green-500 bg-green-100'
                      : 'border border-green-500 hover:bg-green-100/30 cursor-pointer'
                  }
                `}
              >
                <div className="font-medium text-sm">Team {pair[0].index + 1}</div>
                <div className="text-xs my-0.5 text-gray-600">
                  {pair[0].isBooked ? 'Booked' : ''}
                </div>
                {!pair[0].isBooked && (
                  <div className="text-sm font-medium text-gray-900">₹{slot.price}</div>
                )}
              </div>

              {/* Vertical divider */}
              {pair[1] && <div className="w-[0.5px] h-16 bg-gray-300"></div>}

              {/* Second slot in pair */}
              {pair[1] ? (
                <div
                  onClick={() => !pair[1].isBooked && onSelect(slot.id, pair[1].index, slot.price)}
                  className={`flex flex-col items-center justify-center py-2 px-5 rounded-md transition-all duration-200 w-[45%]
                    ${pair[1].isBooked
                      ? 'border border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                      : isSlotSelected(pair[1].index)
                        ? 'border border-green-500 bg-green-100'
                        : 'border border-green-500 hover:bg-green-100/30 cursor-pointer'
                    }
                  `}
                >
                  <div className="font-medium text-sm">Team {pair[1].index + 1}</div>
                  <div className="text-xs my-0.5 text-gray-600">
                    {pair[1].isBooked ? 'Booked' : ''}
                  </div>
                  {!pair[1].isBooked && (
                    <div className="text-sm font-medium text-gray-900">₹{slot.price}</div>
                  )}
                </div>
              ) : (
                // Center the single slot when there's no pair
                <div className="w-[45%]"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-1">
          <span className="text-[11px] text-gray-500">{getAvailabilityMessage()}</span>
        </div>
      </div>
      <div className="border-t w-1/2 mx-auto border-gray-200 mt-2"></div>
    </div>
  );
};

export default function WeekendRegister({ event, open, setOpen }) {
  const [hasGST, setHasGST] = useState(false);
  const [gstNumber, setGSTNumber] = useState("");
  const [gstVerified, setGSTVerified] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]); // Array of selected slots
  const router = useRouter();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isSlotSectionOpen, setIsSlotSectionOpen] = useState(false);

  // Format the timeslots data
  const formatTimeslots = (slots) => {
    return slots.map(slot => {
      // Create dynamic booked status for all possible slots
      const slotBookings = {};
      for (let i = 0; i < slot.noOfSlots; i++) {
        const key = `team${String.fromCharCode(65 + i)}Booked`;
        slotBookings[key] = bookedSlots.some(b =>
          b.slotId === slot.id &&
          b.slotIndex === i &&
          b.registeredByUser !== null
        );
      }

      return {
        id: slot.id,
        slotName: slot.slotName,
        price: event.weekendGameDetails.fee,
        noOfSlots: slot.noOfSlots,
        ...slotBookings
      };
    });
  };

  // In your render method, use the formatted timeslots
  const formattedTimeslots = formatTimeslots(event?.weekendGameDetails?.timeslots || []);

  // Handler for slot selection
  const handleSlotSelect = (slotId, slotIndex, price) => {
    setSelectedSlots(prev => {
      // Check if this slot+index combination is already selected
      const existingSelection = prev.find(
        s => s.slotId === slotId && s.slotIndex === slotIndex
      );

      if (existingSelection) {
        // If already selected, remove it
        return prev.filter(
          s => !(s.slotId === slotId && s.slotIndex === slotIndex)
        );
      } else {
        // Add new selection
        return [...prev, { slotId, slotIndex, price }];
      }
    });
  };

  // Calculate total price from selected slots
  const calculateTotal = () => {
    return selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
  };

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one slot");
      return;
    }

    try {
      const response = await axios.post("/user/event/register", {
        eventId: event.id,
        slots: selectedSlots.map((slot) => ({
          timeSlotId: slot.slotId,
          slotIndex: slot.slotIndex,
        })),
        isPaid: event.isPaidEvent,
        gstNumber: hasGST ? gstNumber : null,
        companyName: hasGST ? companyName : null,
      });

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
  const fee = calculateTotal(); // Get total from selected slots
  const gst = (fee * 0.18).toFixed(2);
  const total = (parseFloat(fee) + parseFloat(gst)).toFixed(2);

  const verifyGST = async (e) => {
    e.preventDefault();
    const payload = {
      gstNumber: gstNumber,
    };
  }

  // Add this date formatting function inside WeekendRegister component
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  // Add this function to fetch booked slots
  const fetchBookedSlots = async () => {
    try {
      const response = await axios.get(`/user/event/weekend-slots/${event.id}/bookings`);
      if (response.data.success) {
        setBookedSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      toast.error('Failed to fetch slot availability');
    }
  };

  // Call it when component mounts
  useEffect(() => {
    if (open && event?.id) {
      fetchBookedSlots();
    }
  }, [open, event?.id]);

  return (
    <>
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
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-0">
              <Dialog.Panel className="z-50 bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium mx-auto text-gray-900">Weekend Game Registration</h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-1/4 text-sm font-medium text-gray-700 mb-1 sm:mb-0">Sport:</label>
                    <div className="relative w-full sm:w-1/2 border border-gray-300 rounded-md py-2 px-4 bg-white text-sm text-gray-500">
                      <LiaRunningSolid className="h-5 w-5 absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                      {event?.weekendGameDetails?.sport?.name} - {event?.weekendGameDetails?.category?.name}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <label className="w-full sm:w-1/4 text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                      Event Date:
                    </label>
                    <div className="relative w-full sm:w-1/2 border border-gray-300 rounded-md py-2 px-4 bg-white text-sm text-gray-500">
                      <span>{formatEventDate(event?.startDate)}</span>
                      <CiCalendar className="h-5 w-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start relative">
                    <label className="w-full sm:w-1/4 text-sm font-medium text-gray-700 mb-1 sm:mb-0 pt-2">
                      Available Teams:
                    </label>
                    <div className="relative w-full sm:w-1/2">
                      <button
                        onClick={() => setIsSlotSectionOpen(!isSlotSectionOpen)}
                        className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm hover:border-gray-400 transition-colors duration-200"
                      >
                        <span className="text-gray-700">
                          {selectedSlots.length > 0 
                            ? `Selected Team${selectedSlots.length > 1 ? 's' : ''} : ${selectedSlots.length}` 
                            : 'Select Your Team'}
                        </span>
                        <FaCheckToSlot className="h-5 w-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </button>

                      <AnimatePresence>
                        {isSlotSectionOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 w-full mt-2 border  rounded-lg bg-white shadow-lg"
                          >
                            <div className="p-2 ">
                              <div className="flex items-center justify-between  mb-3">


                              </div>
                              <div className="max-h-[250px] overflow-y-auto no-scrollbar w-full"> {/* Added w-full */}
                                {formattedTimeslots.map((slot, index) => (
                                  <TimeSlotWithTeams
                                    key={index}
                                    slot={slot}
                                    selectedSlots={selectedSlots}
                                    onSelect={handleSlotSelect}
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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

                  <section aria-labelledby="summary-heading" className="bg-gray-100 rounded-lg p-6 sm:p-8">
                    <div className="flow-root">
                      <dl className="-my-4 divide-y divide-gray-200 text-sm">
                        <div className="flex items-center justify-between py-4">
                          <dt className="text-gray-600">Subtotal</dt>
                          {event.isPaidEvent ? (
                            <dd className="font-medium text-gray-900">₹{fee}</dd>
                          ) : (
                            <dd className="font-medium text-gray-900">₹0</dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-4">
                          <dt className="text-gray-600">GST (18%)</dt>
                          {event.isPaidEvent ? (
                            <dd className="font-medium text-gray-900">₹{gst}</dd>
                          ) : (
                            <dd className="font-medium text-gray-900">₹0</dd>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-4">
                          <dt className="text-base font-medium text-gray-900">Order total</dt>
                          {event.isPaidEvent ? (
                            <dd className="text-base font-medium text-gray-900">₹{total}</dd>
                          ) : (
                            <dd className="font-medium text-gray-900">₹0</dd>
                          )}
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
                      {event.isPaidEvent
                        ? "Continue to Payment"
                        : "Complete Registration"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
}
