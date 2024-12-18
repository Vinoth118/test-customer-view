import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AdDialog = ({ ad, isOpen, onClose }) => {
  if (!ad) {
    return null;
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50"
        onClose={onClose}
      >
        <div className="flex items-center justify-center px-4 text-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-block overflow-hidden text-left align-middle transition-all transform bg-transparent shadow-xl rounded-2xl">
              <button
                onClick={onClose}
                className="absolute top-0 right-0 m-2 p-0.5 bg-white rounded-full shadow-xl focus:outline-none z-60"
              >
                <XMarkIcon
                  className="h-5 w-5 stroke-2 text-gray-600"
                  aria-hidden="true"
                />
              </button>
              <a
                href={`${ad.link}`}
                target="_blank"
              >
                <img
                  src={ad.src}
                  alt="Ad Banner"
                  className="w-[500px] object-contain rounded-lg justify-center items-center"
                />
              </a>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AdDialog;
