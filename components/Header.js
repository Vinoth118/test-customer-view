import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog, Menu } from "@headlessui/react";
import Login from "../pages/Login";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { classNames } from "@/utils/helper";
  export default function Header({ cities, settings, isHome = false, user}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([
    "city",
    "cityId",
    "authenticated",
    "token",
  ]);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  useEffect(() => {
    if (cookies.city) {
      setSelectedCity(cookies.city);
    }
    if (cookies.token) {
      setAuthenticated(true);
    }
  }, [cookies]);

  const handleLocationSelect = (city) => {
    setCookie("city", city.name);
    setCookie("cityId", city.id);
    setSelectedCity(city.name);
    if (cookies.cityId !== city.id) {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("authenticated");
    removeCookie("city");
    removeCookie("cityId");
    localStorage.clear();
    window.location.href = "/";
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <header className="top-0 z-50 bg-white sticky">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between "
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1 p-1.5">
            {settings && settings.logo && (
              <img className="h-20 w-auto" src={settings.logo} alt="logo" />
            )}
          </Link>
        </div>

        <div className="flex place-items-center">
          {cities && cities.length > 0 && (
            <div
              className="relative"
              onMouseEnter={() => setLocationMenuOpen(true)}
              onMouseLeave={() => setLocationMenuOpen(false)}
            >
              <button
                className={classNames(
                  "flex items-center gap-x-1 text-sm font-semibold leading-6  p-2.5 mr-4",
                  isHome ? "text-black" : "text-black"
                )}
              >
                {selectedCity || "Location"}
                <ChevronDownIcon
                  className={classNames(
                    "h-4 w-4 mt-1",
                    isHome ? "text-black" : "text-black"
                  )}
                  aria-hidden="true"
                />
              </button>
              <Transition
                as={Fragment}
                show={locationMenuOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <div className="absolute right-0 top-full z-10 mt-2 w-56 rounded-xl bg-white p-2 ring-gray-900/5">
                  {cities.map((item) => (
                    <a
                      key={item.name}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                      onClick={() => {
                        handleLocationSelect(item);
                        setLocationMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </Transition>

            </div>
          )}
              <div className="border-l-2 h-5  border-gray-300 mx-3" />

          {authenticated ? (
            <div
              className="relative ml-5"
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              <UserCircleIcon
                className="sm:mr-0 mr-3 h-8 w-8 text-gray-400 cursor-pointer"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              />
              <Transition
                as={Fragment}
                show={profileMenuOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  {/* <div className="px-4 py-3">
                    <p className="text-sm">Signed in as</p>
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user?.name || "No name available"}
                    </p>
                  </div> */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/my-events"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Events
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          ) : (
            <button
              onClick={() => setModalIsOpen(true)}
              className="rounded-md bg-indigo-600 px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <Transition.Root show={modalIsOpen} as={Fragment}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <Login closeModal={closeModal} setAuthenticated={setAuthenticated} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  );
}